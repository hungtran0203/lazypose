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
