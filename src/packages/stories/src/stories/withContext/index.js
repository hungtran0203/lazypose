import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';

import lazypose from '@lazypose';

const UserContext = React.createContext({});

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
  .withContext('contextValue', UserContext)
  .withProps(({ contextValue }) => {
    action('contextValue')(contextValue)
    return {}
  })
  .compose(
    ({
      isToggle, onClick,
      value, onChange,
      contextValue
     }) => (
      <div>
        <Button onClick={onClick}>
          Toggle State
        </Button>
        <input value={value} onChange={onChange}/>
        <div>{isToggle.toString()}</div>
        <div>{JSON.stringify(contextValue)}</div>
      </div>
    )
  )

storiesOf('withContext', module)
  .add('basic', () => (<UserContext.Provider value={{ field: 'withContextTest'}}>
    <Component />
  </UserContext.Provider>))
