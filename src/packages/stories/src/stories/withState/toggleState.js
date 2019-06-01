import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';

import lazypose from '@lazypose';

const Component = lazypose
  .withState('isToggle', 'setToggle', false)
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

storiesOf('withState', module)
  .add('toggleState', () => <Component />)
