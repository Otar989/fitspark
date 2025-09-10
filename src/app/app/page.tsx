import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { Navbar } from '@/components/navbar'
import { DashboardContent } from '@/components/dashboard-content'

export default async function DashboardPage() {
  const supabase = createClient()
  
  // Check if user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <DashboardContent />
        </div>
      </main>
    </div>
  )
}