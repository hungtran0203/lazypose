import { useState } from 'react'
import { applyThunkIfNeeded } from '../utils'

export const withConst = (constName, initValue) => ownerProps => {
  const [constValue] = useState(applyThunkIfNeeded(initValue)(ownerProps))
  return {
    ...ownerProps,
    [constName]: constValue,
  }
}

export default withConst
