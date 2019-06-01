import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';

import lazypose from '@lazypose';

const Component = lazypose
  .withState('counter', 'setCounter', 0)
  .setDisplayName('CounterStateComponent')
  .compose(
    ({ counter, setCounter }) => (
      <div>
        <Button onClick={(...args) => {
          action('clicked')(...args)
          setCounter(counter + 1);
        }}>
          Change Counter
        </Button>
        <div>{counter}</div>
      </div>
    )
  )

storiesOf('withState', module)
  .add('counterState', () => <Component />)
