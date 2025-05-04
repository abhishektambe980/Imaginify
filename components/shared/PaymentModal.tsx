"use client";

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '../ui/button';
import { createPaymentOrder } from '@/lib/actions/payment.actions';
import { loadRazorpay } from '@/lib/utils';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentModal = ({ 
  credits = 10,
  amount = 100,
  userId,
  planId = 1
}: {
  credits?: number;
  amount?: number;
  userId: string;
  planId?: number;
}) => {
  useEffect(() => {
    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    try {
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
              window.location.reload();
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
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
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="premium">
          Buy Credits
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buy AI Credits</DialogTitle>
          <DialogDescription>
            Get {credits} credits for ₹{amount}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button onClick={handlePayment}>
            Proceed to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
