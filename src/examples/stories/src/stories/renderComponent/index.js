import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';

import lazypose from '@lazypose';

const Component = lazypose()
  .withState('isToggle', 'setToggle', false)
  .withConst('stringState', 'a string state')
  .renderComponent(({ stringState, isToggle, setToggle }) => (
    <div>
      <div>renderComponent with props "{stringState}"</div>
      <div>
        <Button onClick={(...args) => {
          action('clicked')(...args)
          setToggle(!isToggle);
        }}>
          Toggle State
        </Button>
      </div>
      <div>ToggleState: {isToggle.toString()}</div>
    </div>
  ))
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

storiesOf('renderComponent', module)
  .add('basic', () => <Component />)
