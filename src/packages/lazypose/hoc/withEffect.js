import { useEffect } from 'react'
import { applyThunkIfNeeded } from '../utils'

export const withEffect = (effect, deps) => ownerProps => {
  useEffect(
    applyThunkIfNeeded(effect)(ownerProps),
    applyThunkIfNeeded(deps)(ownerProps)
  )
  return ownerProps
}

export default withEffect
