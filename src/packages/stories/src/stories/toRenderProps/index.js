import React from 'react';

import { storiesOf } from '@storybook/react';

import lazypose from '@lazypose';

storiesOf('toRenderProps', module)
  .add(
    'sample usage',
    () => (
      <div>
      {lazypose()
        .withState('value', 'setTrackVal', '')
        .withHandlers({
          onChange: (ownerProps) => (...args) => {
            ownerProps.setTrackVal(args[0].target.value)
          }
        })
        .toRenderProps(({ value, onChange }) => {
          return (
            <div>
              <div><input value={value} onChange={onChange} /></div>
              <div>Current Value: {value}</div>
            </div>
        )})
      }
      </div>
    )
  )

;
