import { applyThunkIfNeeded } from '../utils'

export const defaultProps = props => ownerProps => {
  const defProps = applyThunkIfNeeded(props)(ownerProps)

  return { ...defProps, ...ownerProps }
}

export default defaultProps
