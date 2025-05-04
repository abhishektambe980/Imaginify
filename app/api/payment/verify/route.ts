import { NextResponse } from "next/server";
import { verifyPayment } from "@/lib/actions/payment.actions";

export async function POST(request: Request) {
  try {
    const {
      orderId,
      paymentId,
      signature,
      userId,
      credits
    } = await request.json();

    if (!orderId || !paymentId || !signature || !userId || !credits) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    await verifyPayment(orderId, paymentId, signature, userId, credits);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
