import React from 'react'
import _ from 'lodash'

import { RenderComponentError } from './utils'

import * as allHocs from './hoc'

/**
 * useage:
 *
 * lazypose()
 *  .mapProps(
 *    propsMapper: (ownerProps: Object) => Object,
 *  )
 *  .withProps(
 *    createProps: (ownerProps: Object) => Object | Object
 *  )
 *  .withHandlers(
 *    handlerCreators: {
 *      [handlerName: string]: (props: Object) => Function
 *    } |
 *    handlerCreatorsFactory: (initialProps) => {
 *      [handlerName: string]: (props: Object) => Function
 *    }
 *  )
 *  .withState(
 *    stateName: string,
 *    stateUpdaterName: string,
 *    initialState: any | (props: Object) => any
 *  )
 *
 *
 *  .compose(ReactComponent)
 */
class LazyPose {
  data = null
  queueStack = []

  dataSchema = {
    mapperQueues: {
      defer: [],
      static: [],
      init: [],
      default: [],
    },
  }

  constructor({ data }) {
    this.initData(data)
  }

  _pushQueue(name) {
    this.queueStack.push(name)
  }

  _getActiveQueue() {
    const queueName = this.queueStack.pop() || 'default'
    return (
      _.get(this.data.mapperQueues, queueName) || this.data.mapperQueues.default
    )
  }

  getQueue(queueName) {
    return [
      ...(_.get(this.data.mapperQueues, queueName) ||
        this.data.mapperQueues.default),
    ]
  }

  /**
   *
   *
   * @param {*} data
   * @memberof LazyPose
   */
  initData(data) {
    this.data = {}
    _.entries(this.dataSchema).map(([key, defVal]) => {
      this.data[key] = _.get(data, key, defVal)
      return true
    })
  }

  /**
   *
   *
   * @memberof LazyPose
   */
  isStatic = enhancer => !!_.get(enhancer, 'isStatic')

  /**
   *
   *
   * @memberof LazyPose
   */
  createStatic = (key, value) => {
    const enhancer = Component => {
      _.set(Component, key, value)
      return true
    }
    _.set(enhancer, 'isStatic', true)
    return enhancer
  }

  /**
   *
   *
   * @param {*} propMapper
   * @returns
   * @memberof LazyPose
   */
  _add(propMapper) {
    if (this.isStatic(propMapper)) {
      this._pushQueue('static')
    }
    this._getActiveQueue().push(propMapper)
    return this
  }

  /**
   *
   *
   * @param {*} enhancer
   * @returns
   * @memberof LazyPose
   */
  with(enhancer) {
    return this._add(enhancer)
  }

  /**
   *
   *
   * @param {*} cb
   * @returns
   * @memberof LazyPose
   */
  use(cb) {
    if (cb instanceof LazyPose) {
      this.combine(cb)
    } else {
      cb(this)
    }
    return this
  }

  /**
   *
   *
   * @param {*} enhancer
   * @returns
   * @memberof LazyPose
   */
  get defer() {
    this._pushQueue('defer')
    return this
  }

  get static() {
    this._pushQueue('static')
    return this
  }

  get init() {
    this._pushQueue('static')
    return this
  }

  combine(...lazyposers) {
    lazyposers.map(lazyposer => {
      Object.keys(this.data.mapperQueues).map(queueName =>
        this.data.mapperQueues[queueName].concat(lazyposer.getQueue(queueName))
      )
      return null
    })
  }

  /**
   *
   *
   * @memberof LazyPose
   */
  compose = BaseComponent => {
    const calculateProps = this.calc

    const WrappedComponent = props => {
      try {
        const mappedProps = calculateProps(props)
        return <BaseComponent {...mappedProps} />
      } catch (error) {
        if (error instanceof RenderComponentError) {
          const { Component, props: propsToRender } = error
          return <Component {...propsToRender} />
        }
        throw error
      }
    }

    // check for staticSetter
    this.data.mapperQueues.static.map(enhancer => enhancer(WrappedComponent))
    return WrappedComponent
  }

  /**
   *
   *
   * @memberof LazyPose
   */
  renderProps = renderer => {
    const calculateProps = this.calc
    return ownerProps => {
      const mappedProps = calculateProps(ownerProps)
      return renderer(mappedProps)
    }
  }

  /**
   *
   *
   * @memberof LazyPose
   */
  calc = ownerProps => {
    // calculate with fixed queue order
    let calcProps = ownerProps
    const queues = [
      this.data.mapperQueues.init,
      this.data.mapperQueues.default,
      this.data.mapperQueues.defer,
    ]
    queues.map(propMappers => {
      calcProps = propMappers.reduce(
        (calProps, propMapper) => propMapper(calProps),
        calcProps
      )
      return calcProps
    })
    return calcProps
  }

  /**
   *
   *
   * @returns
   * @memberof LazyPose
   */
  clone() {
    return new LazyPose({ data: _.cloneDeep(this.data) })
  }

  /**
   *
   *
   * @memberof LazyPose
   */
  loadEnhancer = enhancerDef => {
    _.entries(enhancerDef).map(([hocName, hoc]) => {
      if (LazyPose.prototype[hocName]) {
        // console.warn('enhancer exists, ignore')
      } else {
        // @TODO: only allow to extends enhancer with name is different with Lazypose methods
        LazyPose.prototype[hocName] = function proto(...args) {
          return this.with(hoc(...args))
        }
      }
      return null
    })
  }
}

export const lazypose = () => new LazyPose({})

export const loadEnhancer = lazypose().loadEnhancer

/**
 * define hoc methods
 */
loadEnhancer(allHocs)

/** ############################################################################### */

export default lazypose
