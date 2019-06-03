import { useEffect, useState } from 'react'
import _ from 'lodash'
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
    if (_.has(cbMap, cbName)) {
      const cbWrapper = _.get(cbMap, cbName)
      const cb = _.get(callbacks, cbName)
      if (_.isFunction(cbWrapper) && _.isFunction(cb)) {
        cbWrapper(ownerProps)(cb.bind(thisArg))
      }
    }
    return null
  })
  return ownerProps
}

export default lifecycle
