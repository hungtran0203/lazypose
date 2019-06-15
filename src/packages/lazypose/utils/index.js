import _ from 'lodash'

export const applyThunkIfNeeded = thunk => (...args) => {
  if (_.isFunction(thunk)) {
    return thunk(...args)
  }
  return thunk
}

export const applyEnhancer = enhancer => props => {
  if (_.has(enhancer, 'calc') && _.isFunction(enhancer.calc)) {
    return enhancer.calc(props)
  }
  if (_.isFunction(enhancer)) {
    return enhancer(props)
  }
  return {}
}

export class RenderComponentError extends Error {
  constructor({ Component, props }) {
    super()
    this.Component = Component
    this.props = props
  }

  toString() {
    return `Trying to render ${this.Component} out side of composing`
  }
}

export const pick = (obj, keys) => {
  const result = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key]
    }
  }
  return result
}

export const omit = (obj, keys) => {
  const { ...rest } = obj
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (rest.hasOwnProperty(key)) {
      delete rest[key]
    }
  }
  return rest
}

export const mapValues = (obj, func) => {
  const result = {}
  /* eslint-disable no-restricted-syntax */
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = func(obj[key], key)
    }
  }
  return result
}
