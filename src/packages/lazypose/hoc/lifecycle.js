import { useEffect, useState } from 'react'
import has from 'lodash/has'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'

import { applyThunkIfNeeded } from '../utils'

const componentDidMount = props => cb => {
  useEffect(() => {
    cb(props)
  }, [])
}

const componentWillMount = componentDidMount
const componentWillUnmount = props => cb => {
  useEffect(() => () => cb(props), [])
}

const cbMap = {
  componentDidMount,
  componentWillUnmount,
  componentWillMount,
  // TODO: add others lifecycle hooks
}

export const lifecycle = config => ownerProps => {
  const callbacks = applyThunkIfNeeded(config)(ownerProps)
  // simulate this of class component
  const [thisArg] = useState({})
  Object.keys(callbacks).map(cbName => {
    if (has(cbMap, cbName)) {
      const cbWrapper = get(cbMap, cbName)
      const cb = get(callbacks, cbName)
      if (isFunction(cbWrapper) && isFunction(cb)) {
        cbWrapper(ownerProps)(cb.bind(thisArg))
      }
    }
    return null
  })
  return ownerProps
}

export default lifecycle
