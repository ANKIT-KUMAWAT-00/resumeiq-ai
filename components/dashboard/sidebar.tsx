'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  CreditCard, 
  Settings, 
  BarChart, 
  LogOut 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/(auth)/actions'

const routes = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'New Review',
    icon: FileText,
    href: '/review/new',
  },
  {
    label: 'History',
    icon: History,
    href: '/history',
  },
  {
    label: 'Analytics',
    icon: BarChart,
    href: '/analytics',
  },
  {
    label: 'Billing',
    icon: CreditCard,
    href: '/billing',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-muted/20 border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <FileText className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl font-bold">ResumeIQ AI</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-primary"
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Log out
        </Button>
      </div>
    </div>
  )
}