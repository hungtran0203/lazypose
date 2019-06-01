import React, { useState, useEffect } from 'react'

import lazypose from '~/libs/lazypose'

const TEST2 = lazypose.withOM().compose(props => {
  console.log('render TEST2')
  return props.OM.read('TEST', 'test') || null
})

export const TestComponent2 = lazypose
  .withOM()
  .mapProps(ownerProps => ({
    ...ownerProps,
    mapProps: 'mapProps',
  }))
  .withProps(ownerProps => ({
    withProps: 'withProps',
  }))
  .withState('state1', 'setState1', 1)
  .withState('state2', 'setState2', '')
  .withState('state3', 'setState3', '')
  .withHandlers({
    onClick1: props => () => {
      console.log('clickme')
    },
    onChange: props => e => {
      console.log('withHandlerswithHandlerswithHandlers', props)
      console.log(e.target.value)
      props.setState3(e.target.value)
      props.setState2(e.target.value)
    },
  })
  .compose(props => {
    console.log('rendering state', props)
    // setTimeout(() => {
    //   const { state1, setState1 } = props;
    //   const { state2, setState2 } = props;
    //   setState1(state1 + 1);
    //   setState2(state2 + 2)
    // }, 1000);
    const { ObjectManager } = props
    console.log('ObjectManager', ObjectManager.read('TEST', 'test'))
    // setTimeout(() => console.log( ObjectManager.update('TEST', 'test', (val) => ((val || 0) + 1))), 2000)
    return (
      <React.Fragment>
        <div>{props.state1}</div>
        <div>{props.state2}</div>
        <input value={props.state3} onChange={props.onChange} />
        {(ObjectManager.read('TEST', 'test') || 0) > 5 ? null : (
          <div>
            <TEST2 com="TEST2" />
          </div>
        )}
      </React.Fragment>
    )
  })

const TEST3 = props => {
  useEffect(() => {
    console.log('efffffff', props)
    return () => {
      console.log('casdcasdcascs', props)
    }
  }, [])
  return <div>33333</div>
}

let cb
setTimeout(() => cb(2), 10000)

export const TestComponent = () => {
  const [ts, setTs] = useState(0)
  cb = setTs
  return ts === 2 ? null : (
    <div>
      <TEST2 com="TestComponent2" />
      <TEST3 />
    </div>
  )
}

export default TestComponent
