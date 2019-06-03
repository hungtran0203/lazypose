import React from 'react';
import { withState, compose } from 'recompose';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';

import lazypose from '@lazypose';

const Presentation = ({
  counter, setCounter,
  counter2, setCounter2,
  counter3, setCounter3,
  counter4, setCounter4,
}) => (
  <div>
    <div>
      <Button onClick={(...args) => {
        action('clicked')(...args)
        setCounter(counter + 1);
      }}>
        Change Counter
      </Button>
      <div>{counter}</div>
    </div>
    <div>
      <Button onClick={(...args) => {
        action('clicked')(...args)
        setCounter2(counter2 + 1);
      }}>
        Change Counter2
      </Button>
      <div>{counter2}</div>
    </div>
    <div>
      <Button onClick={(...args) => {
        action('clicked')(...args)
        setCounter3(counter3 + 1);
      }}>
        Change Counter3
      </Button>
      <div>{counter3}</div>
    </div>
    <div>
      <Button onClick={(...args) => {
        action('clicked')(...args)
        setCounter4(counter4 + 1);
      }}>
        Change Counter4
      </Button>
      <div>{counter4}</div>
    </div>
  </div>
);

const Component = lazypose
  .withState('counter', 'setCounter', 0)
  .withState('counter2', 'setCounter2', 0)
  .withState('counter3', 'setCounter3', 0)
  .withState('counter4', 'setCounter4', 0)
  .withState('counter5', 'setCounter5', 0)
  .setDisplayName('CounterStateComponent')
  .compose(Presentation)

const ReComponent = compose(
  withState('counter', 'setCounter', 0),
  withState('counter2', 'setCounter2', 0),
  withState('counter3', 'setCounter3', 0),
  withState('counter4', 'setCounter4', 0),
  withState('counter5', 'setCounter5', 0),
)(Presentation)


storiesOf('withState', module)
  .add('counterState', () => <Component />)
  .add('counterState - recompose', () => <ReComponent />)
