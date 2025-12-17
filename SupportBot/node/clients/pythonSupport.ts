import { ExternalClient, IOContext, InstanceOptions } from '@vtex/api'

export class PythonSupportClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    // TODO: Replace with actual Python service URL when available
    super('https://PYTHON_SERVICE_URL', context, {
      ...options,
      timeout: 3000,
    })
  }

  public notifySupport(payload: any) {
    return this.http.post('/assist', payload, {
      metric: 'python-support-notify',
    })
  }
}
