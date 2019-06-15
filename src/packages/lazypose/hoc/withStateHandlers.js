import { useState } from 'react'
import get from 'lodash/get'
import mapValues from 'lodash/mapValues'
import { applyThunkIfNeeded } from '../utils'

export const withStateHandlers = (
  initialState,
  stateUpdaters
) => ownerProps => {
  const [stateValue, setter] = useState(
    applyThunkIfNeeded(initialState)(ownerProps)
  )
  const handers = mapValues(
    stateUpdaters,
    (stateHandler, stateName) => value => {
      const newStateValue = stateHandler(
        get(stateValue, stateName),
        ownerProps
      )(value)
      setter({ ...stateValue, ...newStateValue })
    }
  )
  return {
    ...ownerProps,
    ...handers,
  }
}

export default withStateHandlers
