import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings, preferences, and billing.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Profile Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              Update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your name" defaultValue="ResumeIQ User" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter your email" disabled defaultValue="user@example.com" />
              <p className="text-[0.8rem] text-muted-foreground">
                Your email is managed by your authentication provider.
              </p>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Billing & Subscription Card (Stripe Hookup) */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription & Billing</CardTitle>
            <CardDescription>
              Manage your ResumeIQ AI plan and payment methods.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Free Plan</h4>
                  <p className="text-sm text-muted-foreground">10 Resume Analyses remaining</p>
                </div>
                <div className="font-bold text-xl">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              </div>
            </div>
            {/* This button will eventually hook up to your Stripe Customer Portal */}
            <Button variant="outline" className="w-full">
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}