"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadRazorpay } from '@/lib/utils'; 
import { useToast } from "@/components/ui/use-toast";
import { plans } from "@/constants";

interface Plan {
  _id: number;
  name: string;
  icon: string;
  price: number;
  credits: number;
  description: string;
  inclusions: Array<{
    label: string;
    isIncluded: boolean;
  }>;
}

interface CreditPlansProps {
  userId: string;
  user: any;
}

const CreditPlans = ({ userId, user }: CreditPlansProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRazorpay();
  }, []);

  const handlePayment = async (plan: Plan) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: plan.price,
          credits: plan.credits,
          userId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Imaginify",
        description: `${plan.credits} Credits Purchase`,
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            const res = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                userId,
                credits: plan.credits
              }),
            });

            if (!res.ok) {
              throw new Error('Payment verification failed');
            }

            const data = await res.json();
            
            if (data.success) {
              toast({
                title: "Payment Successful",
                description: `${plan.credits} credits have been added to your account`,
                duration: 5000,
                className: "success-toast",
              });
              window.location.reload();
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if credits were deducted",
              duration: 5000,
              className: "error-toast",
            });
          }
        },
        prefill: {
          name: user?.firstName,
          email: user?.email,
        },
        theme: {
          color: "#2563EB",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to initiate payment. Please try again.",
        duration: 5000,
        className: "error-toast",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const plansWithDescriptions: Plan[] = plans.map(plan => ({
    ...plan,
    description: `Perfect for ${plan.credits === 10 ? 'getting started' : plan.credits === 50 ? 'regular users' : 'power users'}`
  }));

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {plansWithDescriptions.map((plan) => (
        <Card key={plan.name} className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-center">
              <span className="text-5xl font-extrabold">₹{plan.price}</span>
              <span className="ml-1 text-xl text-muted-foreground">/one-time</span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="relative w-6 h-6">
                <Image
                  src="/assets/icons/credit-coins.svg"
                  alt="credits"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="p-16-medium">{plan.credits} Credits</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-purple-gradient bg-cover"
              onClick={() => handlePayment(plan)}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Buy Credit"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CreditPlans;
