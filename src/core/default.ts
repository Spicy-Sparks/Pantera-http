import { Pantera } from './pantera'

export const defaultInstance = new Pantera({
  responseType: 'json',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
