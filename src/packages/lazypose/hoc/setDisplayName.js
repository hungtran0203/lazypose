import lazypose from '../lazypose'

export const setDisplayName = displayName =>
  lazypose.createStatic('displayName', displayName)

export default setDisplayName
