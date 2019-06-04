import { useLayoutEffect } from 'react'
import { applyThunkIfNeeded } from '../utils'

export const withPropsOnChange = (
  shouldMapOrKeys,
  createProps
) => ownerProps => {
  let newProps = {}
  useLayoutEffect(() => {
    newProps = applyThunkIfNeeded(createProps)(ownerProps)
  }, shouldMapOrKeys)

  return { ...ownerProps, ...newProps }
}

export default withPropsOnChange
