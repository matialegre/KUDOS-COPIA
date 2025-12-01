import { IOClients } from '@vtex/api'
import { PromotionsClient } from './promotions'
import { CallMeBotClient } from './callmebot'

export class Clients extends IOClients {
  public get promotions() {
    return this.getOrSet('promotions', PromotionsClient)
  }

  public get callmebot() {
    return this.getOrSet('callmebot', CallMeBotClient)
  }
}
