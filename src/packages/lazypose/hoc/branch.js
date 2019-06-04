import { applyThunkIfNeeded, applyEnhancer } from '../utils'

export const branch = (test, left, ...rest) => ownerProps => {
  const testRtn = applyThunkIfNeeded(test)(ownerProps)
  if (testRtn) {
    return applyEnhancer(left)(ownerProps)
  }
  if (rest.length) {
    return applyEnhancer(rest[0])(ownerProps)
  }

  return ownerProps
}

export default branch
