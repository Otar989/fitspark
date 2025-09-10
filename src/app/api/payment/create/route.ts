import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { yookassa } from '@/lib/yookassa'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, description, returnUrl } = body

    if (!amount || !description || !returnUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Create payment with YooKassa
    const payment = await yookassa.createPayment({
      amount: Number(amount),
      description,
      userId: user.id,
      returnUrl
    })

    // Store payment info in database for tracking
    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        payment_id: payment.id,
        user_id: user.id,
        amount: amount,
        status: payment.status,
        description: description
      })

    if (insertError) {
      console.warn('Failed to store payment info:', insertError)
      // Continue anyway as the payment was created successfully
    }

    return NextResponse.json({ 
      paymentId: payment.id,
      paymentUrl: payment.confirmation?.confirmation_url,
      status: payment.status 
    })

  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}