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
  .withRef('inputRef', null)
  .withProps(({ inputRef }) => {
    action('CheckInputRef')(inputRef, inputRef.current && inputRef.current.value)
    return {}
  })
  .compose(
    ({
      isToggle, onClick,
      value, onChange,
      inputRef
     }) => (
      <div>
        <Button onClick={onClick}>
          Toggle State
        </Button>
        <input ref={inputRef} value={value} onChange={onChange}/>
        <div>{isToggle.toString()}</div>
      </div>
    )
  )

storiesOf('withRef', module)
  .add('basic', () => <Component />)
