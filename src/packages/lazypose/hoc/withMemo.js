import { useMemo } from 'react'
import { applyThunkIfNeeded } from '../utils'

export const withMemo = (memoName, memoCalculator, deps) => ownerProps => {
  const memoValue = useMemo(
    applyThunkIfNeeded(memoCalculator)(ownerProps),
    applyThunkIfNeeded(deps)(ownerProps)
  )
  return {
    ...ownerProps,
    [memoName]: memoValue,
  }
}

export default withMemo
