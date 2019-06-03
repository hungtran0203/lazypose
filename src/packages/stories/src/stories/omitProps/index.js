import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';

import lazypose from '@lazypose';

const Component = lazypose
  .withState('isToggle', 'setToggle', false)
  .withState('stateToOmit', 'setStateToOmit', false)
  .omitProps(['setStateToOmit'])
  .compose(
    ({ isToggle, setToggle, ...rest }) => (
      <div>
        <Button onClick={(...args) => {
          action('clicked')(...args)
          action('Query Props')(rest)
          setToggle(!isToggle);
        }}>
          Toggle State
        </Button>
        <div>{isToggle.toString()}</div>
      </div>
    )
  )

storiesOf('omitProps', module)
  .add('omit a state setter', () => <Component />)
