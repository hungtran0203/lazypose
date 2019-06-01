import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';

import lazypose from '@lazypose';

const Component = lazypose
  .withState('counter', 'setCounter', 0)
  .withHandlers({
    onClick: ({ counter, setCounter }) => () => {
      action('onClick')(counter)
      setCounter(counter + 1)
    }
  })
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
  .add('onClickHandler', () => <Component />)
