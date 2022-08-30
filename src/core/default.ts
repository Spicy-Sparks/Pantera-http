import { Pantera } from './pantera'

export const defaultInstance = new Pantera({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
