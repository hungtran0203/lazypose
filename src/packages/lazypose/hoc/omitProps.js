import _ from 'lodash'
import { applyThunkIfNeeded } from '../utils'

export const omitProps = config => ownerProps => {
  const propsToOmit = applyThunkIfNeeded(config)(ownerProps)
  return _.omit(ownerProps, propsToOmit || [])
}

export default omitProps
