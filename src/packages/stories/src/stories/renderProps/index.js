import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';

import lazypose from '@lazypose';

const RenderPropComponent = (props) => {
  const { children } = props;
  const [value, onChange] = useState('')
  const providedProps = { value, onChange: e => onChange(e.target.value) }
  return (
    <div>
      {children(providedProps)}
    </div>
  )
}

storiesOf('renderProps', module)
  .add(
    'sample usage',
    () => (
      <div>
        <RenderPropComponent>
          {lazypose()
            .withState('trackValue', 'setTrackVal', ({ value }) => value)
            .withHandlers({
              onChange: (ownerProps) => (...args) => {
                ownerProps.onChange(...args);
                ownerProps.setTrackVal(args[0].target.value)
              }
            })
            .renderProps(({ value, onChange, trackValue }) => {
              return (
                <div>
                  <div><input value={value} onChange={onChange} /></div>
                  <div>Current Value: {value}</div>
                  <div>Track Value: {trackValue}</div>
                </div>
              )
          })}
        </RenderPropComponent>
      </div>
    )
  )

;
