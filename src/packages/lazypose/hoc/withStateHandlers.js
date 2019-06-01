import { useState } from 'react'
import _ from 'lodash'
import { applyThunkIfNeeded } from '../utils'

export const withStateHandlers = (
  initialState,
  stateUpdaters
) => ownerProps => {
  const [stateValue, setter] = useState(
    applyThunkIfNeeded(initialState)(ownerProps)
  )
  const handers = _.mapValues(
    stateUpdaters,
    (stateHandler, stateName) => value => {
      const newStateValue = stateHandler(
        _.get(stateValue, stateName),
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
