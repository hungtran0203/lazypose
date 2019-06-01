import { useState } from 'react'
import { applyThunkIfNeeded } from '../utils'

export const withState = (
  stateName,
  stateUpdaterName,
  initialState
) => ownerProps => {
  const [stateValue, setter] = useState(
    applyThunkIfNeeded(initialState)(ownerProps)
  )
  return {
    ...ownerProps,
    [stateName]: stateValue,
    [stateUpdaterName]: setter,
  }
}
