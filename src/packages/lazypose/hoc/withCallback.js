import { useCallback } from 'react'
import { applyThunkIfNeeded } from '../utils'

export const withCallback = (callbackName, callback, deps) => ownerProps => {
  const cb = useCallback(
    applyThunkIfNeeded(callback)(ownerProps),
    applyThunkIfNeeded(deps)(ownerProps)
  )
  return {
    ...ownerProps,
    [callbackName]: cb,
  }
}

export default withCallback
