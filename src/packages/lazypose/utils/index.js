import isFunction from 'lodash/isFunction'
import has from 'lodash/has'

export const castArray = arr => {
  if (Array.isArray(arr)) return arr
  return arr ? [arr] : []
}

export const applyThunkIfNeeded = thunk => (...args) => {
  if (isFunction(thunk)) {
    return thunk(...args)
  }
  return thunk
}

export const applyEnhancer = enhancer => props => {
  if (has(enhancer, 'calc') && isFunction(enhancer.calc)) {
    return enhancer.calc(props)
  }
  if (isFunction(enhancer)) {
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

export const compose = (...funcs) => {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }
  const Component = funcs.pop()
  const enhancer = funcs.reduce((a, b) => (...args) => a(b(...args)))
  return enhancer(Component)
}
