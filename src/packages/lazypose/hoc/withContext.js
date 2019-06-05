import { useContext } from 'react'
import { applyThunkIfNeeded } from '../utils'

export const withContext = (refName, initValue) => ownerProps => {
  const refValue = useContext(applyThunkIfNeeded(initValue)(ownerProps))
  return {
    ...ownerProps,
    [refName]: refValue,
  }
}

export default withContext
