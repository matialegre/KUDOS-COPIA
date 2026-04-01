import { ExternalClient, IOContext, InstanceOptions } from '@vtex/api'

export class PythonSupportClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('http://placeholder.local', context, {
      ...options,
      timeout: 5000,
    })
  }

  public async notifySupport(endpoint: string, payload: any) {
    const url = `${endpoint.replace(/\/+$/, '')}/assist`

    return this.http.post(url, payload, {
      metric: 'python-support-notify',
    })
  }
}
