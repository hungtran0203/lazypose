import React from 'react';
import ReactDOM from 'react-dom';

import { storiesOf } from '@storybook/react';

import lazypose from '@lazypose';

const Component = lazypose()
.setDisplayName('SetDisplayName')
.compose(
  () => (
    <div>
      ReactVersion: {React.version}
      ReactDOMVersion: {ReactDOM.version}
    </div>
  )
);

storiesOf('setDisplayName', module)
  .add(
    'setComponentName',
    () => <Component />
  )
;
