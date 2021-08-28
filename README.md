# <div style="text-align: center;"><img src="https://raw.githubusercontent.com/develemit/ultima/main/public/UltimaWeapon.png" height="50px"/>Ultima<img src="public/UltimaWeapon.png" height="50px" /></div>

### Why ultima?
An excellent question! Ultima is fundamentally a jest test organizer. It's a different approach to writing tests with the end goal being — write less code to achieve 100% test coverage for React Components.

<br>

### Getting Started:
First things first, lets get it installed!

>`npm install --save-dev @develemit/ultima`

Next up! We'll need to import `@develemit/ultima` into your .spec.js

>`import Ultima from @develemit/ultima';`

Ultima is a constructor function which takes a config object to personalize the returned `ultima` function for your test file.

Ultima takes an object with the following keys:

| key          | value                                               | type            | required          |
|--------------|-----------------------------------------------------|-----------------|-------------------|
| Component    | component under test                                | React Component | yes               |
| defaultProps | props to be passed to each test                     | Object          | highly suggested! |
| mockContextValues*  | default values for your React Context - (React.useContext API) | Object             | no                |
| setContext*   | mocked function used to invoke your Context changes - (React.useContext API) | function        | no                |
| useState*  | directly passed from React after being locally mocked (examples below) | function        | no                |
| config       | default config values for your tests                | Object          | no                |

*For additional examples of mocking context, please see `examples/App/App.spec.jsx` within this repo.
<br>
<br>

>Ultimately, an `ultima` function will be able to be destructured from calling `new Ultima({//...aboveTableValues})` that you will be able to provide an array of test objects for your testing purposes.

```js
const { ultima } = new Ultima({});
```

>There are two other helper functions that can be destructured from above: 

```js
const { ultima, mockUseState, mockSetContext } = new Ultima({});
```

`mockUseState` takes any number of arguments which will be the values of the components `useState` calls. So, for example:

```js
// * Say you have three useStats
const [name, setName] = useState('bob');
const [age, setAge] = useState(99);
const [loggedIn, setLoggedIn] = useState(false);

// Referencing the table below using the "mock" property

{
  title: 'first useState Mock Test!',
  mock: () => mockUseState(
    ['bingo', jest.fn()],
    [23, jest.fn()],
    [true, jest.fn()],
    ),
  //...restOfTestProperties
}
```
```js
// * Similarly, mockSetContext takes an object which will add/override properties in your mockContextValues

const mockContextValues = {
  name: 'bob',
  age: 99,
  loggedIn: false,
}

{
  title: 'first mockSetContext Mock Test!',
  mock: () => mockSetContext({
    name: 'bingo',
    age: 23,
    loggedIn: true,
  })
  //...restOfTestProperties
}
```

> `mockUseState` should only be used with `useState` hook based state 
(<span style="color: darkorange;">not class based components</span>)
<br/> For additional examples see `src/examples/App.spec.jsx`

> `mockSetContext` should only be used with `useContext` hook based state 
(<span style="color: darkorange;">not class based components</span>)
<br/>
For additional examples see `src/Store.jsx`, `src/hooks/useStore.js` and `src/examples/App.spec.jsx`

The objects that make up the test array will have the following properties:

| key 	| description 	| type 	| required 	| Example Value 	|
|-	|-	|:-:	|:-:	|:-:	|
| title 	| value to be used for test name 	| string 	| yes 	| `'age input test'` 	|
| find 	| freeform value for finding elements inside the parent component	| string/Component / [string/Component] 	| no 	| `'.age-input-class-name'` / `Input` / `['.container', '#age-input']` 	|
| props 	| props to be provided to the component  (these merge with and override any defaultProps provided) 	| object 	| no 	| `{ loggedIn: false, setAge: mockSetAge }` 	|
| mock 	| used for any custom mocking/side effects that may need to happen for the current test 	| function 	| no 	| `() => { mockSetAge.mockImplementationOnce(() => NaN) } ` 	|
| debug 	| provides insights into the current test (context/current mock results) - `false` by default	| boolean 	| no 	| `true`	|
| changes 	| array of objects used to trigger events or props of components 	| array of objects** 	| no 	| `[`<br> `{ title: 'changes to age 20', event: 'onChange', value: { target: { value: 20'} } },`<br> `{ title: 'to blah', event: 'onChange', value: { target: { value: 'blah' } } },`<br> `]`, 	|
| expectParam 	| to be passed to jest's `expect` function ex: `expect(expectParam)` 	| any \| array of any 	| depends* 	| `[mockSetAge, mockSetAge, mockSetAge ]` 	|
| expectFunc 	| to be passed as the function after jest's `expect` ex: `expect(expectParam)[expectFunc]` (default = "toHaveBeenCalledWith") 	| string \| array of strings 	| depends* 	| `['toHaveBeenCalledWith', 'toHaveBeenCalledWith', 'toHaveBeenCalled']` <br> (side note - should you need to mix jest methods that both take and do not take an expected argument, put all methods that don't expect an argument at the end, and only provide values as necessary based on  `changes`  length ) 	|
| expected 	| to be passed to the `expectFunc` ex: `expect(expectParam)[expectFunc](expected)` 	| any \| array of any 	| depends* 	| `[20, 40]` <br> (side note - You don't need to match the length of `expectFunc` if the ) 	|
| render 	| can be used to opt out of the ultima test flow and create test cases yourself with the provided Component 	| function 	| no 	| See render Example Below 	|
<br>
<br>
* `expected` is only required should the `expectFunc` be a type of jest function that requires an argument. Otherwise it should be left blank (for example `toBeTruthy` does not expect an argument)

\* similarly, should the `render` method be used, `expectParam`, `expectFunc` and `expected` would all not be needed, as native jest can be used inside of the `render`

\** Please reference the table for the shape of the objects for `changes`
<br>
<br>
Changes can be used in one of two ways. 
<br>
<br>
>A) -  A more native approach via enzyme, simulating events

<br>

>B) - Manually triggering props to invoke functions or effects

| key 	| description 	| type 	| Method (A/B) 	| required 	| Example Value 	|
|-	|-	|:-:	|:-:	|:-:	|:-:	|
| title 	| title for the individual change test 	| string 	| both 	| yes 	| `"returns 20"` 	|
| find 	| to be provided to a `querySelector` function if needing to find a nested element to trigger event 	| any \| [any] 	| both 	| no 	| `"#age-input"` 	|
| props 	| props to be used for the current change event <br> (these merge with and override any defaultProps or test level props provided) 	| object 	| both 	|  	| `{ loggedIn: false  }` 	|
| event 	| name of the prop to be invoked 	| string 	| B 	| A - no <br> B - yes 	| `'onChange'` 	|
| value 	| the return value from the `expectParam` (see above) 	| any 	| B 	| A - no <br> B - yes 	| `{ target: { value: 20 } }` 	|
| at 	| index of element to trigger simulate 	| int 	| A 	| A - yes <br> B - no 	| `0` 	|
| simulate 	| arguments to be passed to the enzyme simulate function 	| array - [event: string, value: any] 	| A 	| A - yes <br> B - no 	| `['change', { target: { value: 20 } }]` 	|
| values*** 	| array of values to be used to trigger the same event multiple times with different values 	| array - any 	| B 	| no 	| [<br> { target: { value: 20 } },<br> { target: { value: 40 } },<br>  { target: { value: 60 }<br> }] 	|
| expectFunc*** 	| to be passed as the function after jest's `expect` ex: `expect(expectParam)[expectFunc]` (default = "toHaveBeenCalledWith") 	| array - string 	| B 	| no 	| <br>  `['toHaveBeenCalledWith', 'toHaveBeenCalledWith', 'toHaveBeenCalledWith']` <br> <br> (As a side note, this wouldn't really be required as `'toHaveBeenCalledWith'` is the default value, <br> however, if the test in question requires a different method for even a single index,<br>  it will it will be required to list each needed test method) 	|
| expected*** 	| to be passed to the `expectFunc` ex: `expect(expectParam)[expectFunc](expected)` - mapped 1 to 1 with the index/indices from the array of  `values` and `expectParam` 	| array - any 	| B 	| no 	| `[20, 40, 60]` 	|


*** if `values` is to be used, then `expectParam`, `expectFunc` and `expected` are also required


<br>
<br>
<br>

## Examples

There are many examples for reference inside of the `examples/` folder to see different scenarios but also please feel free to use the below as a reference

<details>
  <summary>Example using <code>simulate</code></summary>
  
```js
import Ultima from '@develemit/ultima';
import { Button } from 'axp-base';
import RemoveBandModal from './RemoveBandModal';

const setMessage = jest.fn();
const setShowRemoveModal = jest.fn();
const updateBand = jest.fn();

const defaultProps = {
  bandSelected: { acntNumb: 'aa11', tokenId: '11aa' },
  showRemoveModal: false,
  setMessage,
  setShowRemoveModal,
  updateBand,
  updateBandCall: jest.fn(),
  },
};

const { ultima } = new Ultima({
  Component: RemoveBandModal,
  defaultProps,
});

const tests = [
  {
    title: 'Buttons',
    find: Button,
    props: { updateBand },
    changes: [
      {
        title: 'remove_modal_submit false',
        props: {
          updateBandCall: jest.fn(() => 'banding!'),
        },
        at: 0,
        simulate: ['click'],
      },
      {
        title: 'remove_modal_submit error',
        props: { updateBand: null },
        at: 0,
        simulate: ['click'],
      },
      {
        title: 'remove_modal_submit true',
        at: 0,
        simulate: ['click'],
      },
      {
        title: 'remove_modal_cancel',
        at: 1,
        simulate: ['click'],
      },
    ],
    expectParam: [setMessage, setMessage, setMessage, setShowRemoveModal],
    expected: ['REMOVE_FAILURE', 'REMOVE_FAILURE', 'REMOVE', false],
  },
];

ultima(tests);

```
</details>


<details>
  <summary>Example using <code>values</code></summary>

```js
import Ultima from '@develemit/ultima';
import Authentication from '.';

const successCallBack = jest.fn();
const failureCallBack = jest.fn();

const defaultProps = {
  id: '',
  successCallBack,
  failureCallBack,
  locale: '',
};

const { ultima } = new Ultima({
  Component: Authentication,
  defaultProps,
});

const tests = [
  {
    title: 'successCallBack',
    changes: [
      {
        title: 'status',
        event: 'onSuccess',
        values: [{ status: 1 }, { status: 1 }, { status: 2 }],
        expectParam: [successCallBack, successCallBack, failureCallBack],
        // expectFunc: 'toHaveBeenCalledWith', -> not needed, as we wanted 'toHaveBeenCalledWith' to be used with each test.
        expected: [1, 1, 2]
      },
    ],
  },
];

ultima(tests);

```
</details>

<details>
  <summary>Example using <code>render</code></summary>

```js
import React, { useState } from 'react';
import Ultima from '@develemit/ultima';
import BandWearables from '.';
import BandItem from './BandItem';
import { resetAction } from './ActionApiCalls';

let mockUseEffectDependencyArray = '';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn((initial) => [initial, jest.fn()]),
  useEffect: jest.fn((fn, dep) => {
    if (mockUseEffectDependencyArray !== JSON.stringify(dep)) {
      mockUseEffectDependencyArray = JSON.stringify(dep);
      return fn();
    }
    return null;
  }),
}));

jest.mock('./ActionApiCalls', () => ({
  ...jest.requireActual('./ActionApiCalls'),
  resetAction: jest.fn(),
}));

const actions = ['RESET', 'ACTIVATE', 'SUSPEND', 'RESUME', 'REMOVE'];
const bands = [
  {
    tokenId: 'string',
    validThru: '202403',
    actions,
    status: {
      code: 'ACTIVE',
      label: 'ACTIVE',
    },
  },
  {
    tokenId: 'string',
    validThru: '202403',
    actions,
    status: {
      code: 'ACTIVE',
      label: 'ACTIVE',
    },
  },
];

const defaultProps = {
  message: 'New Message',
  bands,
  bandSelected: false,
  locale: 'en-US',
  setBands: jest.fn(),
  setBandSelected: jest.fn(),
  setMessage: jest.fn(),
  setView: jest.fn(),
  updateApiCallOne: jest.fn(() => ({
    promise: Promise.resolve([{}]),
  })),
  updateApiCallTwo: jest.fn(() => ({
    promise: Promise.resolve({ status: 200, body: {} }),
  })),
};

const { ultima } = new Ultima({
  Component: BandWearables,
  defaultProps,
  useState, // Ultima needs context for your "useState" function, don't forget to pass it here!
});

const tests = [
  {
    title: 'All actions trigger',
    find: BandItem,
    render: ({ comp }) => { // render returns an object in this shape { comp, main, raw}.
      // The "comp" is either the component in question baseed on the "find" prop (as above, "comp" in this casee is the "BandItem" component), or the primary component for the test cases, "BandWearables" in this case, rendered as a shallow copy.

      // The "main" is always the component provided to the Ultima function, ("BandWearables" in this case) rendered as a shallow copy.

      // Lastly, "raw" is the base provided component ("BandWearables") which is not shallow rendered.w Ideally you shouldn't need "raw" but it may prove useful for certain edge cases in your testing scenarios
      const { actionsFunctions } = comp.at(0).props();
      jest.spyOn(actionsFunctions, 'RESET');
      jest.spyOn(actionsFunctions, 'ACTIVATE');
      jest.spyOn(actionsFunctions, 'SUSPEND');
      jest.spyOn(actionsFunctions, 'RESUME');
      jest.spyOn(actionsFunctions, 'REMOVE');
      actions.map((action, i) => {
        actionsFunctions[action](bands[i % 2 === 0 ? 0 : 1]);
        return expect(actionsFunctions[action]).toHaveBeenCalled();
      });
    },
  },
  {
    title: 'Reset - Error',
    find: BandItem,
    props: { updateApiCallOne: undefined },
    render: ({ comp }) => {
      const { actionsFunctions } = comp.at(0).props();
      jest.spyOn(actionsFunctions, 'RESET');
      actionsFunctions.RESET();
      return expect(actionsFunctions.RESET).toHaveBeenCalled();
    },
  },
  {
    title: 'Reset - Failure',
    find: BandItem,
    props: {
      updateApiCallOne: jest.fn(() => ({
        promise: Promise.resolve([{}]),
      })),
    },
    render: ({ comp }) => {
      const { actionsFunctions } = comp.at(0).props();
      jest.spyOn(actionsFunctions, 'RESET');
      actionsFunctions.RESET();
      return expect(actionsFunctions.RESET).toHaveBeenCalled();
    },
  },
  {
    title: 'Suspend - Error',
    find: BandItem,
    props: { updateApiCallTwo: undefined },
    render: ({ comp }) => {
      const { actionsFunctions } = comp.at(0).props();
      jest.spyOn(actionsFunctions, 'SUSPEND');
      actionsFunctions.SUSPEND();
      return expect(actionsFunctions.SUSPEND).toHaveBeenCalled();
    },
  },
  {
    title: 'Suspend - Failure',
    find: BandItem,
    props: {
      updateApiCallTwo: jest.fn(),
      message: 'SUSPEND_FAILURE',
    },
    render: ({ comp }) => {
      const { actionsFunctions } = comp.at(0).props();
      jest.spyOn(actionsFunctions, 'SUSPEND');
      actionsFunctions.SUSPEND();
      return expect(actionsFunctions.SUSPEND).toHaveBeenCalled();
    },
  },
  {
    title: 'Mobile Coverage',
    props: {
      bands: [
        {
          tokenId: 'string',
          accountToken: 'HPLKTU2AM8SICIT',
          validThru: '202403',
          actions,
          status: 'INACTIVE',
        },
        {
          tokenId: 'string',
          accountToken: 'GGJKTU2AM8SICIT',
          validThru: '202403',
          actions,
          status: 'ACTIVE',
        },
      ],
    },
    expectFunc: 'toBeTruthy',
  },
];

ultima(tests);

```
</details>

<details>
  <summary>Example using <code>Context</code></summary>

```js
import Ultima from '@develemit/ultima';
import { useStore } from 'hooks/useStore'; // Be Sure to import your hook to get your context values
import App from '.';

const setName = jest.fn();
const setAge = jest.fn();

const mockContextValues = {
  name: 'bobo',
  setName,
  setAge,
};

// You have to mock the context hook with your mockContext object prior to using it as setContext in new Ultima()
jest.mock('hooks/useStore', () => ({
  useStore: jest.fn().mockImplementation(() => mockContextValues),
}));

const { ultima } = new Ultima({
  Component: App,
  mockContextValues,
  setContext: useStore, // again... make sure this value is the mocked as above
  config: {
    expectParam: setName,
  },
});

const tests = [
  {
    title: 'name input',
    id: 'name', // the # is prepended to the value
    changes: [
      { title: 'changed to bob', event: 'onChange', value: { target: { value: 'bob' } } },
      { title: 'changed to blah', event: 'onChange', value: { target: { value: 'blah' } } },
    ],
    // expectParam: setName, // Not needed as the config object in the constructor has already applied setName as the default value for expectParam for all tests
    expected: ['bob', 'blah'],
  },
  {
    title: 'age input',
    find: '#age', // different option for finding if you need to be more specific than id (in this case you need to provide the # with the value as with querySelector)
    changes: [
      {
        title: 'to 40',
        value: { target: { value: 40 } },
      },
    ],
    expectParam: setAge,
    expected: 40,
  },
  {
    title: 'exports a function by default',
    expectParam: App,
    expectFunc: 'toBeInstanceOf',
    expected: Function,
  },
];
ultima(tests);

```
</details>

#### Beyond React Component Testing
For future releases, I would like to expand Ultima React further with an option for redux testing.

## Contributing

We welcome Your interest in the American Express Open Source Community on Github. Any Contributor to
any Open Source Project managed by the American Express Open Source Community must accept and sign
an Agreement indicating agreement to the terms below. Except for the rights granted in this 
Agreement to American Express and to recipients of software distributed by American Express, You
reserve all right, title, and interest, if any, in and to Your Contributions. Please
[fill out the Agreement](https://cla-assistant.io/americanexpress/@develemit/ultima).

## License

Any contributions made under this project will be governed by the
[Apache License 2.0](./LICENSE.txt).

## Code of Conduct

This project adheres to the [American Express Community Guidelines](./CODE_OF_CONDUCT.md). By
participating, you are expected to honor these guidelines.