import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { razorpay } from "@/lib/razorpay/client";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .single();

    if (subscription?.status === "active") {
      return NextResponse.json(
        { error: "Already subscribed" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: 29900,
      currency: "INR",
      receipt: `rcpt_${user.id.slice(0, 30)}`,
      notes: {
        userId: user.id,
      },
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}