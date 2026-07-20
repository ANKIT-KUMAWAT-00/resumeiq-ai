'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function deleteReview(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('resume_reviews')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    revalidatePath('/history')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting review:', error)
    return { error: error.message || 'Failed to delete review' }
  }
}