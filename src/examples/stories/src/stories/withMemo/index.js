import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';

import lazypose from '@lazypose';

const Component = lazypose()
  .withState('value', 'setValue', '')
  .withState('isToggle', 'setToggle', false)
  .withCallback('onChange', ({ value, setValue }) => (event) => {
    action('change')(value, event.target.value);
    setValue(event.target.value);
  }, ({ isToggle }) => ([isToggle]))
  .withCallback('onClick', ({ isToggle, setToggle }) => (...args) => {
    action('clicked')(...args)
    setToggle(!isToggle);
  }, ({ isToggle }) => ([isToggle]))
  .withMemo('memoVal', ({ isToggle }) => () => {
    action('memoRun')(isToggle)
    return `Memo value is ${isToggle.toString()}`
  }, ({ isToggle }) => ([isToggle]))
  .compose(
    ({
      isToggle, memoVal, onClick,
      value, onChange,
     }) => (
      <div>
        <Button onClick={onClick}>
          Toggle State
        </Button>
        <input value={value} onChange={onChange}/>
        <div>{isToggle.toString()}</div>
        <div>{memoVal}</div>
      </div>
    )
  )

storiesOf('withMemo', module)
  .add('memo value is calculated when state changed', () => <Component />)
