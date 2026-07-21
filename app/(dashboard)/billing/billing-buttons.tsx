'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function UpgradeButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
      })

      const order = await res.json()

      if (!order.id) {
        throw new Error(order.error || 'Failed to create order')
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'ResumeIQ AI',
        description: 'ResumeIQ Pro Subscription',
        order_id: order.id,

        handler: async function (response: any) {
  try {
    const verify = await fetch("/api/razorpay/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    });

    const result = await verify.json();

    if (result.success) {
      toast.success("🎉 Welcome to ResumeIQ Pro!");
      window.location.href = "/billing";
    } else {
      toast.error(result.error || "Payment verification failed");
    }
  } catch (error) {
    console.error(error);
    toast.error("Verification failed");
  }
},

        prefill: {
          name: '',
          email: '',
          contact: '',
        },

        theme: {
          color: '#4F46E5',
        },
      }

      const paymentObject = new (window as any).Razorpay(options)

      paymentObject.open()
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleUpgrade}
      disabled={isLoading}
      className="w-full sm:w-auto"
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      Upgrade to Pro
    </Button>
  )
}

export function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleManage = async () => {
    toast.info('Subscription management coming soon.')
  }

  return (
    <Button
      variant="outline"
      onClick={handleManage}
      disabled={isLoading}
      className="w-full sm:w-auto"
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      Manage Subscription
    </Button>
  )
}