import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import lazypose from '@lazypose';

const Component = lazypose()
  .withState('value', 'setValue', false)
  .withState('value2', 'setValue2', ({ value }) => !value)
  .defer.omitProps(['value2'])
  .withHandlers({
    onClick: ({ setValue, value, value2, setValue2 }) => () => {
      action('clicked')(value, value2)
      setValue(!value)
      setValue2(!value2)
    }
  })
  .defer.omitProps(['setValue'])
  .compose(
    (props) => (
      <div>
        <input type="checkbox" {...props} />
        <div>{props.value.toString()}</div>
      </div>
    )
  )

storiesOf('defer', module)
  .add('defer to omit a props', () => <Component />)
