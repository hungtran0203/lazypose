import { useRef } from 'react'
import { applyThunkIfNeeded } from '../utils'

export const withRef = (refName, initValue) => ownerProps => {
  const refValue = useRef(applyThunkIfNeeded(initValue)(ownerProps))
  return {
    ...ownerProps,
    [refName]: refValue,
  }
}

export default withRef
