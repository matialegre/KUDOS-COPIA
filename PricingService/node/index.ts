import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { Service } from '@vtex/api'

import { Clients } from './clients'
import { sum } from './middlewares/sum'
import { netPrice } from './middlewares/netPrice'
import { createCoupon } from './middlewares/createCoupon'
import { notifySupport } from './middlewares/notifySupport'
import { supportCreate } from './middlewares/supportCreate'
import { supportPending } from './middlewares/supportPending'

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

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    code: number
  }
}

export default new Service({
  clients,
  routes: {
    sum,
    netPrice,
    createCoupon,
    notifySupport,
    supportCreate,
    supportPending,
  },
})
