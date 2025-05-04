import { NextResponse } from "next/server";
import { createPaymentOrder } from "@/lib/actions/payment.actions";

export async function POST(request: Request) {
  try {
    const { amount, credits, userId } = await request.json();

    if (!amount || !credits || !userId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const order = await createPaymentOrder(amount, credits, userId);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
