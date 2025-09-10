import { createHash, createHmac } from 'crypto'

export interface YooKassaPayment {
  id: string
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled'
  amount: {
    value: string
    currency: string
  }
  confirmation?: {
    type: string
    confirmation_url?: string
  }
  metadata?: Record<string, string>
}

export interface CreatePaymentParams {
  amount: number
  description: string
  userId: string
  returnUrl: string
}

class YooKassa {
  private shopId?: string
  private secretKey?: string
  private baseUrl = 'https://api.yookassa.ru/v3'

  private ensureCredentials() {
    if (!this.shopId || !this.secretKey) {
      this.shopId = process.env.YOOKASSA_SHOP_ID
      this.secretKey = process.env.YOOKASSA_SECRET_KEY
      
      if (!this.shopId || !this.secretKey) {
        throw new Error('YooKassa credentials are not configured')
      }
    }
  }

  private getAuthHeader(): string {
    this.ensureCredentials()
    const auth = Buffer.from(`${this.shopId}:${this.secretKey}`).toString('base64')
    return `Basic ${auth}`
  }

  private generateIdempotencyKey(): string {
    return crypto.randomUUID()
  }

  async createPayment({
    amount,
    description,
    userId,
    returnUrl
  }: CreatePaymentParams): Promise<YooKassaPayment> {
    this.ensureCredentials()
    try {
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Idempotence-Key': this.generateIdempotencyKey(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: {
            value: amount.toFixed(2),
            currency: 'RUB'
          },
          confirmation: {
            type: 'redirect',
            return_url: returnUrl
          },
          capture: true,
          description,
          metadata: {
            user_id: userId,
            subscription_type: 'premium_monthly'
          }
        })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`YooKassa API error: ${error}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating YooKassa payment:', error)
      throw error
    }
  }

  async getPayment(paymentId: string): Promise<YooKassaPayment> {
    this.ensureCredentials()
    try {
      const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
        headers: {
          'Authorization': this.getAuthHeader(),
        }
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`YooKassa API error: ${error}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting YooKassa payment:', error)
      throw error
    }
  }

  verifyWebhookSignature(body: string, signature: string): boolean {
    const webhookSecret = process.env.YOOKASSA_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.warn('YooKassa webhook secret not configured')
      return true // Allow webhooks if no secret configured
    }

    const hash = createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    return hash === signature
  }
}

export const yookassa = new YooKassa()