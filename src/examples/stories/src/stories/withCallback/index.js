import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';

import lazypose from '@lazypose';

const Component = lazypose()
  .withState('isToggle', 'setToggle', false)
  .withCallback('onClick', ({ isToggle, setToggle }) => (...args) => {
    action('clicked')(...args)
    setToggle(!isToggle);
  }, ({ isToggle }) => ([isToggle]))
  .compose(
    ({ isToggle, onClick }) => (
      <div>
        <Button onClick={onClick}>
          Toggle State
        </Button>
        <div>{isToggle.toString()}</div>
      </div>
    )
  )

storiesOf('withCallback', module)
  .add('callback to change state', () => <Component />)
