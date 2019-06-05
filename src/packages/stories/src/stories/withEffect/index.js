import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';

import lazypose from '@lazypose';

const Component = lazypose()
  .withState('value', 'setValue', '')
  .withState('isToggle', 'setToggle', false)
  .withCallback('onChange', ({ value, setValue }) => (event) => {
    setValue(event.target.value);
  }, ({ isToggle }) => ([isToggle]))
  .withCallback('onClick', ({ isToggle, setToggle }) => (...args) => {
    action('clicked')(...args)
    setToggle(!isToggle);
  }, ({ isToggle }) => ([isToggle]))
  .withEffect(({ isToggle }) => () => {
    action('effect isToogle changed')(isToggle)
  }, ({ isToggle }) => ([isToggle]))
  .compose(
    ({
      isToggle, onClick,
      value, onChange,
     }) => (
      <div>
        <Button onClick={onClick}>
          Toggle State
        </Button>
        <input value={value} onChange={onChange}/>
        <div>{isToggle.toString()}</div>
      </div>
    )
  )

storiesOf('withEffect', module)
  .add('effect is triggerred when state changed', () => <Component />)
