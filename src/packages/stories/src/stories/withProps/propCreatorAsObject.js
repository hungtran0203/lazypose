import React from 'react';
import ReactDOM from 'react-dom';

import { storiesOf } from '@storybook/react';

import lazypose from '@lazypose';

storiesOf('withProps', module)
  .add(
    'propCreator as object',
    lazypose()
      .withProps({
        title: 'propCreator as object'
      })
      .compose(
        ({ title }) => (
          <div>
            ReactVersion: {React.version}
            ReactDOMVersion: {ReactDOM.version}
            <div>{title}</div>
          </div>
        )
      )
  )

;
