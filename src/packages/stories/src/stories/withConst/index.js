import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';

import lazypose from '@lazypose';

const Component = lazypose
  .withState('isToggle', 'setToggle', false)
  .withConst('constProp', 'CONST STRING')
  .compose(
    ({ isToggle, setToggle, constProp }) => (
      <div>
        <Button onClick={(...args) => {
          action('clicked')(...args)
          setToggle(!isToggle);
        }}>
          Toggle State
        </Button>
        <div>{isToggle.toString()}</div>
        <div>withConst Value: {constProp}</div>
      </div>
    )
  )

storiesOf('withConst', module)
  .add('withConst props is not changed on rerendering', () => <Component />)
