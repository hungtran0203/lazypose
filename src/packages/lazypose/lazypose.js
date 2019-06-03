import React from 'react'
import _ from 'lodash'

import * as allHocs from './hoc'

/**
 * useage:
 *
 * lazypose
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
  dataSchema = {
    propMappers: [],
    staticSetters: [],
  }

  constructor({ data }) {
    this.initData(data)
  }

  initData(data) {
    this.data = {}
    _.entries(this.dataSchema).map(([key, defVal]) => {
      this.data[key] = _.get(data, key, defVal)
      return true
    })
  }

  isStatic = enhancer => !!_.get(enhancer, 'isStatic')

  createStatic = (key, value) => {
    const enhancer = Component => {
      _.set(Component, key, value)
      return true
    }
    _.set(enhancer, 'isStatic', true)
    return enhancer
  }

  _add(propMapper) {
    const instance = this.checkIfNewInstanceNeeded()
    if (this.isStatic(propMapper)) {
      instance.data.staticSetters.push(propMapper)
    } else {
      instance.data.propMappers.push(propMapper)
    }
    return instance
  }

  with(enhancer) {
    return this._add(enhancer)
  }

  compose = BaseComponent => {
    const calculateProps = this.calc

    // return class LazyPoseComponent extends React.Component {
    //   componentData = {};
    //   WrappedComponent = (props) => {
    //     // calculateProps
    //     const mappedProps = calculateProps(
    //       props,
    //       [this.state, (...args) => this.setState(...args)],
    //       this.componentData,
    //       this.context
    //     );
    //     return <BaseComponent {...mappedProps} />
    //   }
    //   render() {
    //     const WrappedComponent = this.WrappedComponent;
    //     return (<WrappedComponent {...this.props} />);
    //   }
    // }
    const componentData = {}
    const context = {}
    const state = {}
    const setState = () => {}

    const WrappedComponent = props => {
      const mappedProps = calculateProps(
        props,
        [state, setState],
        componentData,
        context
      )
      return <BaseComponent {...mappedProps} />
    }

    // check for staticSetter
    this.data.staticSetters.map(enhancer => enhancer(WrappedComponent))
    return WrappedComponent
  }

  renderProps = renderer => {
    const calculateProps = this.calc
    return ownerProps => {
      const mappedProps = calculateProps(ownerProps)
      return renderer(mappedProps)
    }
  }

  calc = (ownerProps, stateArr, componentData, context) =>
    this.data.propMappers.reduce(
      (calProps, propMapper) =>
        propMapper(calProps, stateArr, componentData, context),
      ownerProps
    )

  checkIfNewInstanceNeeded() {
    if (!this.data.propMappers.length) {
      return new LazyPose({ data: null })
    }
    return this
  }

  clone() {
    return new LazyPose({ data: _.cloneDeep(this.data) })
  }
}

export const lazypose = new LazyPose({})

export const loadEnhancer = enhancerDef => {
  _.entries(enhancerDef).map(([hocName, hoc]) => {
    if (LazyPose.prototype[hocName]) {
      // console.warn('enhancer exists, ignore')
    } else {
      LazyPose.prototype[hocName] = function proto(...args) {
        return this.with(hoc(...args))
      }
    }
    return null
  })
}

/**
 * define hoc methods
 */
loadEnhancer(allHocs)

/** ############################################################################### */

export default lazypose
