import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 flex flex-col items-center text-center">
        <div className="bg-primary/10 p-3 rounded-full mb-4">
          <MailCheck className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl tracking-tight">Check your email</CardTitle>
        <CardDescription>
          We just sent a verification link to your inbox. 
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Click the link in the email to verify your account and get started with ResumeIQ AI. 
          If you don't see it, check your spam folder!
        </p>
        <div className="pt-4 flex flex-col gap-2">
         <Link href="/login">
  <Button variant="default" className="w-full">
    Back to Login
  </Button>
</Link>
        </div>
      </CardContent>
    </Card>
  );
}