Lazypose
-----

Lazypose is a React Hook utility for building and combining React Hooks to single level Higher-order wrapper functional components.

[**Full API documentation**](docs/API.md) - Learn about each helper

```
npm install lazypose --save
```

## Why

When React version 16.8.0 is release with React Hook feature, `Recompose` is replaced and prefer to use over `Recompose`. Developer can re-write code by using React Hooks, but with React Hooks, testing will be not simple causes state, data is declared inside component. 

The main concept of `Lazypose` is to move all Reack Hooks to a single wrapper functional component. And then results of React Hooks are converted or mapped to props then passing to Dumb Presentation Component.

`Lazypose` provide utility to create function component that have several key advantages as stated in `recompose`:

- They help prevent abuse of the `setState()` API, favoring props instead.
- They encourage the ["smart" vs. "dumb" component pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).
- They encourage code that is more reusable and modular.
- They discourage giant, complicated components that do too many things.
- Functions can be composed together.
- The code is easily tested.
- There aren’t any observable side effects.
- The data is immutable.
- In the future, they will allow React to make performance optimizations by avoiding unnecessary checks and memory allocations.

| React Hook  | Recompose | Lazypose |
| ------------- | ------------- | ------------- |
| ![alt text](https://i.ibb.co/zxj9ZVm/Screen-Shot-2019-06-10-at-10-41-27.png)  | ![alt text](https://i.ibb.co/hFV9L7D/Screen-Shot-2019-06-10-at-11-00-02.png)   | ![alt text](https://i.ibb.co/vmvKr0G/Screen-Shot-2019-06-10-at-11-01-28.png)  |


### Higher-order components made easy

Most of the time when we talk about composition in React, we're talking about composition of components. For example, a `<Blog>` component may be composed of many `<Post>` components, which are composed of many `<Comment>` components.

Recompose focuses on another unit of composition: **higher-order components** (HoCs). HoCs are functions that accept a base component and return a new component with additional functionality. They can be used to abstract common tasks into reusable pieces.

Recompose provides a toolkit of helper functions for creating higher-order components.

## You can use Lazypose to...

### ...lift state, context, callbacks, handlers into functional wrappers

Helpers like `.withState()` provide a nicer way to express state updates:

```js
import lazypose from 'lazypose'
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


## Usage

All functions are available on the top-level export.

```js
import lazypose from 'lazypose'
const enahncer = lazypose().withState().withProps()...
```

## Getting Help

### Help Us Help You

On both websites, it is a good idea to structure your code and question in a way that is easy to read to entice people to answer it. For example, we encourage you to use syntax highlighting, indentation, and split text in paragraphs.

Please keep in mind that people spend their free time trying to help you. You can make it easier for them if you provide versions of the relevant libraries and a runnable small project reproducing your issue. You can put your code on [JSBin](http://jsbin.com) or, for bigger projects, on GitHub. Make sure all the necessary dependencies are declared in `package.json` so anyone can run `npm install && npm start` and reproduce your issue.
