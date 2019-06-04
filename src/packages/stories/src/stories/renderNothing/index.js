import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';

import lazypose from '@lazypose';

const Component = lazypose()
  .withState('isToggle', 'setToggle', false)
  .withConst('stringState', 'a string state')
  .renderNothing()
  .withProps(() => {
    action('withPropsCalled')()
    return {}
  })
  .compose(
    ({ isToggle, setToggle }) => (
      <div>
        <Button onClick={(...args) => {
          action('clicked')(...args)
          setToggle(!isToggle);
        }}>
          Toggle State
        </Button>
        <div>{isToggle.toString()}</div>
      </div>
    )
  )


const Component2 = lazypose()
  .withState('isToggle', 'setToggle', false)
  .withConst('stringState', 'a string state')
  .branch(({ isToggle }) => !!isToggle, lazypose().renderNothing())
  .withProps(() => {
    action('withPropsCalled')()
    return {}
  })
  .compose(
    ({ isToggle, setToggle }) => (
      <div>
        <Button onClick={(...args) => {
          action('clicked')(...args)
          setToggle(!isToggle);
        }}>
          Toggle State
        </Button>
        <div>{isToggle.toString()}</div>
      </div>
    )
  )
  
storiesOf('renderNothing', module)
  .add('basic', () => <Component />)
  .add('with banch', () => <Component2 />)
