import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { Service } from '@vtex/api'

import { Clients } from './clients'
import { botMessage } from './middlewares/botMessage'
import { botSession } from './middlewares/botSession'

declare global {
  type Context = ServiceContext<Clients>
}
const TIMEOUT_MS = 800

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
  },
}

export default new Service({
  clients,
  routes: {
    botSession,
    botMessage,
  },
})
