import omit from 'lodash/omit'
import { applyThunkIfNeeded, castArray } from '../utils'

export const omitProps = config => ownerProps => {
  const propsToOmit = applyThunkIfNeeded(config)(ownerProps)
  return omit(ownerProps, castArray(propsToOmit))
}

export default omitProps
