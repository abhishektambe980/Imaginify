"use server";

import Razorpay from 'razorpay';
import { redirect } from 'next/navigation';
import { updateCredits } from './user.actions';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export async function createPaymentOrder(amount: number, credits: number, userId: string) {
  try {
    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      credits,
      userId
    };
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
}

export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string,
  userId: string,
  credits: number
) {
  try {
    // Verify payment signature
    const generated_signature = require('crypto')
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generated_signature === signature) {
      // Payment is successful, update user credits
      await updateCredits(userId, credits);
      return { success: true };
    } else {
      throw new Error('Payment verification failed');
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}
