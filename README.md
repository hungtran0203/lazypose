Lazypose
-----

Lazypose is a React Hook utility for building and combining hooks to a single Higher-order functional component.

[**Full API documentation**](docs/API.md) - Learn about each helper

```
npm install lazypose --save
```

## You can use Lazypose to...

### ...lift state, context, callbacks, handlers into functional wrappers

Helpers like `.withState()` provide a nicer way to express state updates:

```js
const enhancer = lazypose().withState('counter', 'setCounter', 0)
const Counter = enhancer.compose(({ counter, setCounter }) =>
  <div>
    Count: {counter}
    <button onClick={() => setCounter(n => n + 1)}>Increment</button>
    <button onClick={() => setCounter(n => n - 1)}>Decrement</button>
  </div>
)
```

### ...to inject data to renderProps pattern

Helpers like `.renderProps()` is used for inject additional state/data to renderProps pattern:

```js
<Downshift
  onChange={selection => alert(`You selected ${selection.value}`)}
  itemToString={item => (item ? item.value : '')}
>{
lazypose()
.withState('value', 'changeValue', ({ value }) => value.toLowerCase())
.renderProps(
  ({
      getInputProps,
      getItemProps,
      getLabelProps,
      getMenuProps,
      isOpen,
      inputValue,
      highlightedIndex,
      selectedItem,
    }) => (
      <div>
        <label {...getLabelProps()}>Enter a fruit</label>
        <input {...getInputProps()} />
        <ul {...getMenuProps()}>
          {isOpen
            ? items
                .filter(item => !inputValue || item.value.includes(inputValue))
                .map((item, index) => (
                  <li
                    {...getItemProps({
                      key: item.value,
                      index,
                      item,
                      style: {
                        backgroundColor:
                          highlightedIndex === index ? 'lightgray' : 'white',
                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                      },
                    })}
                  >
                    {item.value}
                  </li>
                ))
            : null}
        </ul>
      </div>
    )
)
  }
  </Downshift>
```

### ...optimize rendering performance

Lazypose was heavily inspired by `recompose` and support most of enhancer privided by that library. Also Lazypose is written to resolve the main rendering performance disadvantage of recompose. While `recompose` produces each WrappingHOCComponent for each composed enhancer, `lazypose` produces only one WrappingHOCComponent
`Recompose way`
```js
const enhance = compose(
  withState('username', 'setUsername', '')
  withState('firstname', 'setFirstname', '')
  withState('lastname', 'setLastname', '')
  withHandlers({
    onSubmit: ({ username, firstname, lastname }) => () => {
      subbmitForm({ username, firstname, lastname })
    }
  }),
  lifecyle({
    componentDidMount() {
      loadUserData(this.props.username)
    }
  })
)(PresentationComponent)
```
`in React devtool inspection`
```js
  <withState(withState(withState(withHandlers(lifecyle))))>
    <withState(withState(withHandlers(lifecyle)))>
      <withState(withHandlers(lifecyle))>
        <withHandlers(lifecyle)>
          <lifecyle>
            <PresentationComponent />
          </lifecyle>          
        </withHandlers(lifecyle)>        
      </withState(withHandlers(lifecyle))>      
    </withState(withState(withHandlers(lifecyle)))>    
  </withState(withState(withState(withHandlers(lifecyle))))>  
```

`Lazypose way`
```js
const enhance = lazypose()
  .withState('username', 'setUsername', '')
  .withState('firstname', 'setFirstname', '')
  .withState('lastname', 'setLastname', '')
  .withHandlers({
    onSubmit: ({ username, firstname, lastname }) => () => {
      subbmitForm({ username, firstname, lastname })
    }
  }),
  .lifecyle({
    componentDidMount() {
      loadUserData(this.props.username)
    }
  })
  .compose(PresentationComponent)
```
`in React devtool inspection`
```js
  <LazyposeWrapper>
    <PresentationComponent />
  </LazyposeWrapper>  
```

### ...reuse enhancer or group of enhancers
```js
const formEnhancer = lazypose()
  .withState('formField1', 'setField1')
  .withState('formField2', 'setField2')
  .withState('formField3', 'setField3')
  
const ContainerComponent = formEnhancer
  .clone()
  .withHandlers({
    onSubmit: ({ formField1, formField2, formField3 }) => () => {
      subbmitForm1({ formField1, formField2, formField3 })
    }
  }),
  .compose(FORM1)
  
const ContainerComponent2 = formEnhancer
  .clone()
  .withState('formField4', 'setField4')
  .withHandlers({
    onSubmit: ({ formField1, formField2, formField3, formField4 }) => () => {
      subbmitForm2({ formField1, formField2, formField3, formField4 })
    }
  }),
  .compose(FORM1)
```

### ...interoperate with other React Hook libraries

Lazypose allows to add new enhancer by using `loadEnhancer` method

```js
lazypose().loadEnhancer({
  withWindowSize: (options) => (ownerProps) => {
     .....
  },
  withQuery: (options) => (ownerProps) => {
     .....
  },
  mapPropsStream: (options) => (ownerProps) => {
     .....
  },
});

// then
const Container = lazypose()
  .withWindowSize(options)
  .withQuery(options)
  .mapPropsStream(options)
  .compose(PRESENTATION)
```

### ...full control of props mapping flow
Lazypose maintain the order of enhancers pushed to lazypose to run the props mapping flow with the same order.
Also enhancers are kept in 3 difference queues: `init`, `defer` and `default` queue.
Where `init` queue is run first then `default` queue and `defer` queue is last.
By utilizing different queues properly, we can control to init nessesary props or clean up props easily
```js
const FORM = lazypose()
  .withConst('firstname').defer.omitProps('firstname')
  .withConst('lastname').defer.omitProps('lastname')
  .withConst('fullname', ({ firstname, lastname } ) => `${firstname} ${lastname}`
  .init.withState('field1', 'setField1')
```


### ...and more

## API docs

[Read them here](docs/API.md)

## Why

`Recompose` was an amazing utility for composing Presentation component from enhancers. With `Recompose` utilities, developer can easily convert a ES6 class component to functional component. So Presentation component will become a Dumb UI Component, it renders whatever props it received without internal state, handler, callback and effect. But it also has downside that create too many middle WrapperComponent and it impact to rendering performance. When React version 16.8.0 is release with React Hook feature, `Recompose` is replaced and prefer to use over `Recompose`. Developer can re-write code by using React Hooks, but with React Hooks, testing will be not simple causes state, data is declared inside component. `Recompose` gave developer a change to move all state, handler, callback, context data outside of Presentation Component then testing Presentation Component is simple by mockup props properly.
The main concept of `Lazypose` is to move all Reack Hooks to a single wrapper functional component and the results of React Hooks are converted or mapped to props then passing to Dumb Presentation Component.

`Lazypose` provide utility to create function components that have several key advantages as stated in `recompose` README:

- They help prevent abuse of the `setState()` API, favoring props instead.
- They encourage the ["smart" vs. "dumb" component pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).
- They encourage code that is more reusable and modular.
- They discourage giant, complicated components that do too many things.
- In the future, they will allow React to make performance optimizations by avoiding unnecessary checks and memory allocations.


### Higher-order components made easy

Most of the time when we talk about composition in React, we're talking about composition of components. For example, a `<Blog>` component may be composed of many `<Post>` components, which are composed of many `<Comment>` components.

Recompose focuses on another unit of composition: **higher-order components** (HoCs). HoCs are functions that accept a base component and return a new component with additional functionality. They can be used to abstract common tasks into reusable pieces.

Recompose provides a toolkit of helper functions for creating higher-order components.

## [Should I use this? Performance and other concerns](docs/performance.md)

## Usage

All functions are available on the top-level export.

```js
import { compose, mapProps, withState /* ... */ } from 'recompose'
```

**Note:** `react` is a _peer dependency_ of Recompose.  If you're using `preact`, add this to your `webpack.config.js`:

```js
resolve: {
  alias: {
    react: "preact"
  }
}
```

### Composition

Recompose helpers are designed to be composable:

```js
const BaseComponent = props => {...}

// This will work, but it's tedious
let EnhancedComponent = pure(BaseComponent)
EnhancedComponent = mapProps(/*...args*/)(EnhancedComponent)
EnhancedComponent = withState(/*...args*/)(EnhancedComponent)

// Do this instead
// Note that the order has reversed — props flow from top to bottom
const enhance = compose(
  withState(/*...args*/),
  mapProps(/*...args*/),
  pure
)
const EnhancedComponent = enhance(BaseComponent)
```

Technically, this also means you can use them as decorators (if that's your thing):

```js
@withState(/*...args*/)
@mapProps(/*...args*/)
@pure
class Component extends React.Component {...}
```

### Optimizing bundle size

Since `0.23.1` version recompose got support of ES2015 modules.
To reduce size all you need is to use bundler with tree shaking support
like [webpack 2](https://github.com/webpack/webpack) or [Rollup](https://github.com/rollup/rollup).

#### Using babel-plugin-lodash

[babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash) is not only limited to [lodash](https://github.com/lodash/lodash). It can be used with `recompose` as well.

This can be done by updating `lodash` config in `.babelrc`.

```diff
 {
-  "plugins": ["lodash"]
+  "plugins": [
+    ["lodash", { "id": ["lodash", "recompose"] }]
+  ]
 }
```

After that, you can do imports like below without actually including the entire library content.

```js
import { compose, mapProps, withState } from 'recompose'
```

### Debugging

It might be hard to trace how does `props` change between HOCs. A useful tip is you can create a debug HOC to print out the props it gets without modifying the base component. For example:

make

```js
const debug = withProps(console.log)
```

then use it between HOCs

```js
const enhance = compose(
  withState(/*...args*/),
  debug, // print out the props here
  mapProps(/*...args*/),
  pure
)
```


## Who uses Recompose
If your company or project uses Recompose, feel free to add it to [the official list of users](https://github.com/acdlite/recompose/wiki/Sites-Using-Recompose) by [editing](https://github.com/acdlite/recompose/wiki/Sites-Using-Recompose/_edit) the wiki page.

## Recipes for Inspiration
We have a community-driven Recipes page. It's a place to share and see recompose patterns for inspiration. Please add to it! [Recipes](https://github.com/acdlite/recompose/wiki/Recipes).

## Feedback wanted

Project is still in the early stages. Please file an issue or submit a PR if you have suggestions! Or ping me (Andrew Clark) on [Twitter](https://twitter.com/acdlite).


## Getting Help

**For support or usage questions like “how do I do X with Recompose” and “my code doesn't work”, please search and ask on [StackOverflow with a Recompose tag](http://stackoverflow.com/questions/tagged/recompose?sort=votes&pageSize=50) first.**

We ask you to do this because StackOverflow has a much better job at keeping popular questions visible. Unfortunately good answers get lost and outdated on GitHub.

Some questions take a long time to get an answer. **If your question gets closed or you don't get a reply on StackOverflow for longer than a few days,** we encourage you to post an issue linking to your question. We will close your issue but this will give people watching the repo an opportunity to see your question and reply to it on StackOverflow if they know the answer.

Please be considerate when doing this as this is not the primary purpose of the issue tracker.

### Help Us Help You

On both websites, it is a good idea to structure your code and question in a way that is easy to read to entice people to answer it. For example, we encourage you to use syntax highlighting, indentation, and split text in paragraphs.

Please keep in mind that people spend their free time trying to help you. You can make it easier for them if you provide versions of the relevant libraries and a runnable small project reproducing your issue. You can put your code on [JSBin](http://jsbin.com) or, for bigger projects, on GitHub. Make sure all the necessary dependencies are declared in `package.json` so anyone can run `npm install && npm start` and reproduce your issue.
