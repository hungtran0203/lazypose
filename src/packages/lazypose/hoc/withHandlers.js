import _ from 'lodash'
import { applyThunkIfNeeded } from '../utils'

export const withHandlers = handlerCreator => ownerProps => {
  const getOwnerProps = () => ownerProps
  const handlers = applyThunkIfNeeded(handlerCreator)(ownerProps)

  const newProps = _.mapValues(
    handlers,
    handler => (...args) => handler(getOwnerProps())(...args)
    // return useCallback((...args) => handler(getOwnerProps())(...args), []);
  )
  return { ...ownerProps, ...newProps }
}

export default withHandlers
