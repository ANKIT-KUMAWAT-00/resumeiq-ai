'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

import { signupSchema, SignupFormValues } from '@/lib/validations/auth'
import { signup } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<SignupFormValues>({
  resolver: zodResolver(signupSchema),
  mode: "onChange",
  reValidateMode: "onChange",
})

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true)

    const result = await signup(data)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(result?.success || 'Account created successfully!')
      router.push('/verify-email')
    }

    setIsLoading(false)
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Create an account to start reviewing your resumes.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
  id="fullName"
  placeholder="John Doe"
  className={errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}
  {...register("fullName")}
/>
              {errors.fullName && (
                <p className="text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
  id="email"
  type="email"
  placeholder="m@example.com"
  className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
  {...register("email")}
/>
              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
  id="password"
  type="password"
  className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
  {...register("password")}
/>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Account
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}