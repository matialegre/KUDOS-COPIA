import { IOClients } from '@vtex/api'
import { PythonSupportClient } from './pythonSupport'

export class Clients extends IOClients {
  public get pythonSupport() {
    return this.getOrSet('pythonSupport', PythonSupportClient)
  }
}
