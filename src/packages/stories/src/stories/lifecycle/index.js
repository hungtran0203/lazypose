import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';

import lazypose from '@lazypose';

const Component = lazypose()
  .withState('isToggle', 'setToggle', false)
  .lifecycle({
    componentWillMount() {
      action('componentWillMount')()
    },
    componentDidMount() {
      action('componentDidMount')()
    },
    componentWillUnmount() {
      action('componentWillUnmount')()
    }
  })
  .compose(
    ({ isToggle, setToggle }) => (
      <div>
        <Button onClick={(...args) => {
          action('clicked')(...args)
          setToggle(!isToggle);
        }}>
          Toggle State
        </Button>
        <div>{isToggle.toString()}</div>
      </div>
    )
  )

storiesOf('lifecycle', module)
  .add('trigger lifecycle functions', () => <Component />)
