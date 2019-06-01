import { applyThunkIfNeeded } from '../utils'

export const withProps = createProps => ownerProps => {
  const newProps = applyThunkIfNeeded(createProps)(ownerProps)

  return { ...ownerProps, ...newProps }
}
