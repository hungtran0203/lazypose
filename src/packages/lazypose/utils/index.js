import _ from 'lodash'

export const applyThunkIfNeeded = thunk => (...args) => {
  if (_.isFunction(thunk)) {
    return thunk(...args)
  }
  return thunk
}
