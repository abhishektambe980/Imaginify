"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { loadRazorpay } from "@/lib/utils";
import { createPaymentOrder } from "@/lib/actions/payment.actions";
import { useToast } from "../ui/use-toast";

export const InsufficientCreditsModal = ({ 
  credits = 10,
  amount = 100,
  userId,
  onClose
}: {
  credits?: number;
  amount?: number;
  userId: string;
  onClose?: () => void;
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const order = await createPaymentOrder(amount, credits, userId);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Imaginify",
        description: `${credits} Credits Purchase`,
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
                credits
              }),
            });

            const data = await res.json();
            
            if (data.success) {
              toast({
                title: "Payment Successful",
                description: `${credits} credits have been added to your account`,
                duration: 5000,
                className: "success-toast",
              });
              if (onClose) onClose();
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
          name: "User",
          email: "user@example.com",
        },
        theme: {
          color: "#2563EB",
        },
      };

      const rzp = new window.Razorpay(options);
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insufficient Credits</DialogTitle>
          <DialogDescription>
            You don't have enough credits to perform this action. Please purchase more credits to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-6 items-center">
            <Image 
              src="/assets/icons/credits.svg"
              alt="credits"
              width={50}
              height={50}
              className="pb-2"
            />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">{credits} Credits</p>
              <p className="text-sm text-muted-foreground">
                ₹{amount}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-purple-gradient bg-cover"
          >
            {isLoading ? "Processing..." : "Buy Credits"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}