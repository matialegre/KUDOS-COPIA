import { ExternalClient, IOContext, InstanceOptions } from '@vtex/api'

export interface CallMeBotMessage {
  phone: string
  text: string
  apiKey: string
}

export class CallMeBotClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('https://api.callmebot.com', context, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
      },
      timeout: 3000,
    })
  }

  public sendWhatsAppMessage({ phone, text, apiKey }: CallMeBotMessage) {
    const params = new URLSearchParams({
      phone,
      text,
      apikey: apiKey,
    })

    return this.http.get<string>(`/whatsapp.php?${params.toString()}`, {
      metric: 'callmebot-whatsapp',
    })
  }
}
