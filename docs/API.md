# API

In these API docs, a **higher-order component** (HOC) refers to a function that accepts a single React component and returns a new React component.

```js
const EnhancedComponent = lazypose()(BaseComponent)
```

This form makes HOCs (sometimes called **enhancers**) composable:

```js
const composedHoc = compose(hoc1, hoc2, hoc3)

// Same as
const composedHoc = BaseComponent => hoc1(hoc2(hoc3(BaseComponent)))
```

Most Recompose helpers are **functions that return higher-order components**:

```js
const hoc = mapProps(ownerProps => childProps)
const EnhancedComponent = hoc(BaseComponent)

// Same as
const EnhancedComponent = mapProps(ownerProps => childProps)(BaseComponent)
```

Some, like `pure`, are higher-order components themselves:

```js
const PureComponent = pure(BaseComponent)
```

## TOC

- [API](#api)
  - [TOC](#toc)
  - [Higher-order components](#higher-order-components)
    - [`mapProps()`](#mapprops)
    - [`.withProps()`](#withprops)
    - [`.withPropsOnChange()`](#withpropsonchange)
    - [`.withHandlers()`](#withhandlers)
    - [`.defaultProps()`](#defaultprops)
    - [`.renameProp()`](#renameprop)
    - [`.renameProps()`](#renameprops)
    - [`.flattenProp()`](#flattenprop)
    - [`.withState()`](#withstate)
    - [`.withStateHandlers()`](#withstatehandlers)
    - [`.withReducer()`](#withreducer)
    - [`.branch()`](#branch)
    - [`.renderComponent()`](#rendercomponent)
    - [`.renderNothing()`](#rendernothing)
    - [`withContext()`](#withcontext)
    - [`.lifecycle()`](#lifecycle)
    - [`toRenderProps()`](#torenderprops)
    - [`fromRenderProps()`](#fromrenderprops)
  - [Static property helpers](#static-property-helpers)
    - [`.setStatic()`](#setstatic)
    - [`.setDisplayName()`](#setdisplayname)
  - [Utilities](#utilities)
    - [`.compose()`](#compose)
    - [`.use()`](#use)
    - [`.with()`](#with)
    - [`.combine()`](#combine)
    - [`.renderProps()`](#renderprops)
    - [`.clone()`](#clone)
    - [`.loadEnhancer()`](#loadenhancer)
  - [Prop mapper queues](#prop-mapper-queues)
    - [`.init`](#init)
    - [`.defer`](#defer)
    - [`.static`](#static)

## Higher-order components

### `mapProps()`

```js
.mapProps(
  propsMapper: (ownerProps: Object) => Object,
): HigherOrderPropMapper
```

Accepts a function that maps owner props to a new collection of props that are passed to the base component.

`.mapProps()` pairs well with functional utility libraries like [lodash/fp](https://github.com/lodash/lodash/tree/npm/fp). 

### `.withProps()`

```js
.withProps(
  createProps: (ownerProps: Object) => Object | Object
): HigherOrderPropMapper
```

Like `mapProps()`, except the newly created props are merged with the owner props.

Instead of a function, you can also pass a props object directly. In this form, it is similar to `defaultProps()`, except the provided props take precedence over props from the owner.


### `.withPropsOnChange()`

```js
.withPropsOnChange(
  shouldMapOrKeys: Array<string> | (props: Object, nextProps: Object) => boolean,
  createProps: (ownerProps: Object) => Object
): HigherOrderPropMapper
```

Like `.withProps()`, except the new props are only created when one of the owner props specified by `.shouldMapOrKeys` changes. 

### `.withHandlers()`

```js
.withHandlers(
  handlerCreators: {
    [handlerName: string]: (props: Object) => Function
  } |
  handlerCreatorsFactory: (initialProps) => {
    [handlerName: string]: (props: Object) => Function
  }
): HigherOrderPropMapper
```

Takes an object map of handler creators or a factory function. These are higher-order functions that accept a set of props and return a function handler:

This allows the handler to access the current props via closure, without needing to change its signature.

Handlers are passed to the base component as immutable props, whose identities are preserved across renders. This avoids a common pitfall where functional components create handlers inside the body of the function, which results in a new handler on every render and breaks downstream `shouldComponentUpdate()` optimizations that rely on prop equality. This is the main reason to use `withHandlers` to create handlers instead of using `mapProps` or `withProps`, which will create new handlers every time when it get updated.

Usage example:

```js
const enhancer = lazypose()
  .withState('value', 'updateValue', ''),
  .withHandlers({
    onChange: props => event => {
      props.updateValue(event.target.value)
    },
    onSubmit: props => event => {
      event.preventDefault()
      submitForm(props.value)
    }
  })
)

const Form = enhancer.compose(({ value, onChange, onSubmit }) =>
  <form onSubmit={onSubmit}>
    <label>Value
      <input type="text" value={value} onChange={onChange} />
    </label>
  </form>
)
```

### `.defaultProps()`

```js
.defaultProps(
  props: Object
): HigherOrderPropMapper
```

Specifies props to be passed by default to the base component. Similar to `.withProps()`, except the props from the owner take precedence over props provided to the HoC.

Although it has a similar effect, using the `.defaultProps()` HoC is *not* the same as setting the static `defaultProps` property directly on the component.


### `.renameProp()`

```js
.renameProp(
  oldName: string,
  newName: string
): HigherOrderPropMapper
```

Renames a single prop.

### `.renameProps()`

```js
.renameProps(
  nameMap: { [key: string]: string }
): HigherOrderPropMapper
```

Renames multiple props, using a map of old prop names to new prop names.

### `.flattenProp()`

```js
.flattenProp(
  propName: string
): HigherOrderPropMapper
```

Flattens a prop so that its fields are spread out into the props object.

```js
const enhancer = lazypose()
  .withProps({
    object: { a: 'a', b: 'b' },
    c: 'c'
  }),
  .flattenProp('object')
)
const Abc = enhancer.compose(BaseComponent)

// Base component receives props: { a: 'a', b: 'b', c: 'c', object: { a: 'a', b: 'b' } }
```

An example use case for `.flattenProp()` is when receiving fragment data from Relay. Relay fragments are passed as an object of props, which you often want flattened out into its constituent fields:

```js
// The `post` prop is an object with title, author, and content fields
const enhancer = lazypose().flattenProp('post')
const Post = enhancer.compose(({ title, content, author }) =>
  <article>
    <h1>{title}</h1>
    <h2>By {author.name}</h2>
    <div>{content}</div>
  </article>
)
```

### `.withState()`

```js
.withState(
  stateName: string,
  stateUpdaterName: string,
  initialState: any | (props: Object) => any
): HigherOrderPropMapper
```

Passes two additional props to the base component: a state value, and a function to update that state value. The state updater has the following signature:

```js
.stateUpdater<T>((prevValue: T) => T, ?callback: Function): void
.stateUpdater(newValue: any, ?callback: Function): void
```

The first form accepts a function which maps the previous state value to a new state value. You'll likely want to use this state updater along with `.withHandlers()` to create specific updater functions. For example, to create a HoC that adds basic counting functionality to a component:

```js
const addCounting = layzpose()
  .withState('counter', 'setCounter', 0),
  .withHandlers({
    increment: ({ setCounter }) => () => setCounter(n => n + 1),
    decrement: ({ setCounter }) => () =>  setCounter(n => n - 1),
    reset: ({ setCounter }) => () => setCounter(0)
  })
)
```

The second form accepts a single value, which is used as the new state.

Both forms accept an optional second parameter, a callback function that will be executed once `setState()` is completed and the component is re-rendered.

An initial state value is required. It can be either the state value itself, or a function that returns an initial state given the initial props.

### `.withStateHandlers()`

```js
.withStateHandlers(
  initialState: Object | (props: Object) => any,
  stateUpdaters: {
    [key: string]: (state:Object, props:Object) => (...payload: any[]) => Object
  }
)

```

Passes state object properties and immutable updater functions
in a form of `(...payload: any[]) => Object` to the base component.

Every state updater function accepts state, props and payload and must return a new state or undefined. The new state is shallowly merged with the previous state.
Returning undefined does not cause a component rerender.

Example:

```js
  const Counter = lazypose()
  .withStateHandlers(
    ({ initialCounter = 0 }) => ({
      counter: initialCounter,
    }),
    {
      incrementOn: ({ counter }) => (value) => ({
        counter: counter + value,
      }),
      decrementOn: ({ counter }) => (value) => ({
        counter: counter - value,
      }),
      resetCounter: (_, { initialCounter = 0 }) => () => ({
        counter: initialCounter,
      }),
    }
  )
  .compose(
    ({ counter, incrementOn, decrementOn, resetCounter }) =>
      <div>
        <Button onClick={() => incrementOn(2)}>Inc</Button>
        <Button onClick={() => decrementOn(3)}>Dec</Button>
        <Button onClick={resetCounter}>Reset</Button>
      </div>
  )
```

### `.withReducer()`

```js
.withReducer<S, A>(
  stateName: string,
  dispatchName: string,
  reducer: (state: S, action: A) => S,
  initialState: S | (ownerProps: Object) => S
): HigherOrderPropMapper
```

Similar to `.withState()`, but state updates are applied using a reducer function. A reducer is a function that receives a state and an action, and returns a new state.

Passes two additional props to the base component: a state value, and a dispatch method. The dispatch method has the following signature:

```js
dispatch(action: Object, ?callback: Function): void
```

It sends an action to the reducer, after which the new state is applied. It also accepts an optional second parameter, a callback function with the new state as its only argument.

### `.branch()`

```js
.branch(
  test: (props: Object) => boolean,
  left: HigherOrderPropMapper,
  right: ?HigherOrderPropMapper
): HigherOrderPropMapper
```

Accepts a test function and two higher-order components. The test function is passed the props from the owner. If it returns true, the `left` higher-order component is applied to `BaseComponent`; otherwise, the `right` higher-order component is applied. If the `right` is not supplied, it will by default render the wrapped component.

### `.renderComponent()`

```js
.renderComponent(
  Component: ReactClass | ReactFunctionalComponent | string
): HigherOrderPropMapper
```

Takes a component and returns a higher-order component version of that component.

This is useful in combination with another helper that expects a higher-order component, like `.branch()`:

```js
const enhancer = lazypose()
  .branch(
    props => !(props.title && props.author && props.content),
    lazypose().renderComponent(Spinner)
  )
)
const Post = enhancer.compose(({ title, author, content }) =>
  <article>
    <h1>{title}</h1>
    <h2>By {author.name}</h2>
    <div>{content}</div>
  </article>
)
```

### `.renderNothing()`

```js
.renderNothing: HigherOrderPropMapper
```

A higher-order prop mapper that always throw error with render `null` component to stop prop mapping procedure.

This is useful in combination with another helper that expects a higher-order component, like `.branch()`:

```js
// `hasNoData()` is a function that returns true if the component has
// no data
const hideIfNoData = hasNoData =>
  branch(
    hasNoData,
    renderNothing
  )

// Now use the `hideIfNoData()` helper to hide any base component
const enhancer = lazypose()
  .branch(
    props => !(props.title && props.author && props.content),
    lazypose.renderNothing()
  )
)
const Post = enhancer.compose(({ title, author, content }) =>
  <article>
    <h1>{title}</h1>
    <h2>By {author.name}</h2>
    <div>{content}</div>
  </article>
)
```

### `withContext()`

```js
.withContext(
  contextPropName: String,
  CreateContextObject: Object,
): HigherOrderPropMapper
```

Consumer context provided by `CreateContextObject.Provider` and pass to props object

### `.lifecycle()`

```js
.lifecycle(
  spec: Object,
): HigherOrderPropMapper
```

A higher-order component version of [`React.Component()`](https://facebook.github.io/react/docs/react-api.html#react.component). It supports the entire `Component` API, except the `render()` method, which is implemented by default (and overridden if specified; an error will be logged to the console). You should use this helper as an escape hatch, in case you need to access component lifecycle methods.

Any state changes made in a lifecycle method, by using `setState`, will be propagated to the wrapped component as props.

Example:
```js
const PostsList = ({ posts }) => (
  <ul>{posts.map(p => <li>{p.title}</li>)}</ul>
)

const PostsListWithData = lazypose().lifecycle({
  componentDidMount({ setState }) {
    fetchPosts().then(posts => {
      setState({ posts });
    })
  }
})(PostsList);
```

### `toRenderProps()`

```js
toRenderProps(
  hoc: HigherOrderPropMapper
): ReactFunctionalComponent
```

Creates a component that accepts a function as a children with the high-order component applied to it. 

Example:
```js
const enhance = withProps(({ foo }) => ({ fooPlusOne: foo + 1 }))
const Enhanced = toRenderProps(enhance)

<Enhanced foo={1}>{({ fooPlusOne }) => <h1>{fooPlusOne}</h1>}</Enhanced>
// renders <h1>2</h1>
```

### `fromRenderProps()`

```js
fromRenderProps(
  RenderPropsComponent: ReactClass | ReactFunctionalComponent,
  propsMapper: (...props: any[]) => Object,
  renderPropName?: string
): HigherOrderPropMapper
```

Takes a **render props** component and a function that maps props to a new collection of props that are passed to the base component.

The default value of third parameter (`renderPropName`) is `children`. You can use any prop (e.g., `render`) for render props component to work.

> Check the official documents [Render Props](https://reactjs.org/docs/render-props.html#using-props-other-than-render) for more details.

```js
import { fromRenderProps } from 'recompose';
const { Consumer: ThemeConsumer } = React.createContext({ theme: 'dark' });
const { Consumer: I18NConsumer } = React.createContext({ i18n: 'en' });
const RenderPropsComponent = ({ render, value }) => render({ value: 1 });

const EnhancedApp = compose(
  // Context (Function as Child Components)
  fromRenderProps(ThemeConsumer, ({ theme }) => ({ theme })),
  fromRenderProps(I18NConsumer, ({ i18n }) => ({ locale: i18n })),
  // Render props
  fromRenderProps(RenderPropsComponent, ({ value }) => ({ value }), 'render'),
)(App);

// Same as
const EnhancedApp = () => (
  <ThemeConsumer>
    {({ theme }) => (
      <I18NConsumer>
        {({ i18n }) => (
          <RenderPropsComponent
            render={({ value }) => (
              <App theme={theme} locale={i18n} value={value} />
            )}
          />
        )}
      </I18NConsumer>
    )}
  </ThemeConsumer>
)
```

## Static property helpers

These functions look like higher-order component helpers — they are curried and component-last. However, rather than returning a new component, they mutate the base component by setting or overriding a static property.

### `.setStatic()`

```js
.setStatic(
  key: string,
  value: any
): HigherOrderPropMapper
```

Assigns a value to a static property on the base component.

### `.setDisplayName()`

```js
.setDisplayName(
  displayName: string
): HigherOrderPropMapper
```

Assigns to the `displayName` property on the base component.

## Utilities

Recompose also includes some additional helpers that aren't higher-order components, but are still useful.

### `.compose()`

```js
.compose(baseComponent: ReactClass | ReactFunctionalComponent): ReactFunctionalComponent
```

Use to compose multiple higher-order components into a single higher-order component.

### `.use()`

```js
.use(baseComponent: ReactClass | ReactFunctionalComponent): ReactFunctionalComponent
```

Document needed.

### `.with()`

```js
.with(baseComponent: ReactClass | ReactFunctionalComponent): ReactFunctionalComponent
```

Document needed.

### `.combine()`

```js
.combine(baseComponent: ReactClass | ReactFunctionalComponent): ReactFunctionalComponent
```

Document needed.

### `.renderProps()`

```js
.renderProps(baseComponent: ReactClass | ReactFunctionalComponent): ReactFunctionalComponent
```

Document needed.

### `.clone()`

```js
.clone(baseComponent: ReactClass | ReactFunctionalComponent): ReactFunctionalComponent
```

Document needed.

### `.loadEnhancer()`

```js
.loadEnhancer(baseComponent: ReactClass | ReactFunctionalComponent): ReactFunctionalComponent
```

Document needed.

## Prop mapper queues

Document needed.

### `.init`

```js
.init
```

Document needed.

### `.defer`

```js
.defer
```

Document needed.

### `.static`

```js
.static
```

Document needed.

