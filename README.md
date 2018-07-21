# action-processor
Simple utility to run a series of functions over an initial state and return the end state.

Supports async functions which will be waited upon before the next action, to ensure actions are completed sequentially.

Supports ignoring failed actions .

## Installation
```
npm i -S action-processor
```

## Usage
`action-processor` exposes a simple API:
```
const {run} = require('action-processor');

const result = run(initialState, actions, opts);
```
Where:
- `initialState` is any value. It will be passed as the only argument to the first item in `actions`.
- `actions` is an array of functions or async functions (or a mixture). Each function should take one argument: `previousState` and return the next state to pass to the next action function (or be returned in the case of the last action).
- `opts` is an object with the following settings:
  - `continueOnFailure` (default: `false`): If set to true, any action invocation which throws an error will be skipped, and the chain will continue as if that action were not included.
