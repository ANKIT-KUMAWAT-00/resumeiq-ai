import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRazorpayClient } from "@/lib/razorpay/client";

export async function POST() {
  try {
    const supabase = await createClient();

    // Get logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("USER:", user);
    console.log("USER ERROR:", userError);

    if (userError) {
      return NextResponse.json(
        { error: userError.message },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check subscription
    const {
      data: subscription,
      error: subscriptionError,
    } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();

    console.log("SUBSCRIPTION:", subscription);
    console.log("SUBSCRIPTION ERROR:", subscriptionError);

    if (subscriptionError) {
      console.error("Subscription Query Error:", subscriptionError);

      return NextResponse.json(
        {
          error: subscriptionError.message,
        },
        { status: 500 }
      );
    }

    if (subscription?.status === "active") {
      return NextResponse.json(
        {
          error: "Already subscribed",
        },
        { status: 400 }
      );
    }

    // Razorpay
    const razorpay = getRazorpayClient();

    console.log("Razorpay initialized");

    const order = await razorpay.orders.create({
      amount: 29900,
      currency: "INR",
      receipt: `rcpt_${user.id.substring(0, 25)}`,
      notes: {
        userId: user.id,
      },
    });

    console.log("ORDER CREATED:", order);

    return NextResponse.json(order);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}