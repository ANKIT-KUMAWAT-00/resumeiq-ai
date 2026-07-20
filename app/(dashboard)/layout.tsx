import { Sidebar } from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen relative flex">
      {/* Desktop Sidebar */}
      <div className="hidden h-full md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <main className="md:pl-64 flex-1 h-full overflow-y-auto bg-background">
        <div className="container mx-auto p-6 md:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}