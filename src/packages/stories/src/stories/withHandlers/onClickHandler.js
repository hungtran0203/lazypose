import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';

import lazypose from '@lazypose';

const HandlerCreators = lazypose
  .withState('counter', 'setCounter', 0)
  .withState('value', 'setValue', '')
  .withHandlers({
    onClick: ({ counter, setCounter }) => () => {
      setCounter(counter + 1)
      action('onClick')(counter)
    },
    onChange: ({ setValue }) => (event) => {
      setValue(event.target.value)
      action('onChange')(event.target.value)
    }
  })
  .setDisplayName('OnClickHandler')
  .compose(
    ({ counter, onClick, value, onChange }) => (
    <div>
      <div>
        <Button onClick={onClick}>
          Change Counter
        </Button>
        <div>{counter}</div>
      </div>
      <div>
        <input value={value} onChange={onChange} />
        <div>InputValue {value}</div>
      </div>
    </div>
    )
  )

const HandlerCreatorsFactory = lazypose
  .withState('counter', 'setCounter', 0)
  .withHandlers(() => ({
    onClick: ({ counter, setCounter }) => () => {
      action('onClick')(counter)
      setCounter(counter + 1)
    }
  }))
  .setDisplayName('OnClickHandler')
  .compose(
    ({ counter, onClick }) => (
      <div>
        <Button onClick={onClick}>
          Change Counter
        </Button>
        <div>{counter}</div>
      </div>
    )
  )

storiesOf('withHandlers', module)
  .add('HandlerCreators', () => <HandlerCreators />)
  .add('HandlerCreatorsFactory', () => <HandlerCreatorsFactory />)
