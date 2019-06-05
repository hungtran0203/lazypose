import { useLayoutEffect } from 'react'
import { applyThunkIfNeeded } from '../utils'

export const withLayoutEffect = (effect, deps) => ownerProps => {
  useLayoutEffect(
    applyThunkIfNeeded(effect)(ownerProps),
    applyThunkIfNeeded(deps)(ownerProps)
  )
  return ownerProps
}

export default withLayoutEffect
