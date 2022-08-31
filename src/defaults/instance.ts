import { Pantera } from '../core/pantera'

export const instance = new Pantera({
  responseType: 'json',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
