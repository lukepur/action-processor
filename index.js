const {find, cloneDeep} = require('lodash');

module.exports = {
  run
};

async function run(initialState, actions, opts = {continueOnFailure: false}) {
  const invalidActionsMsg = validateActionsArgument(actions);
  if (invalidActionsMsg) {
    throw new Error(invalidActionsMsg);
  }
  let state = cloneDeep(initialState);
  for (let i = 0; i < actions.length; i++) {
    try {
      state = await actions[i](cloneDeep(state));
    } catch (e) {
      const msg = `Exception occurred in action ${i}. ${e}`;
      console.warn(msg);
      if (!opts.continueOnFailure) {
        throw new Error(msg);
      }
    }
  }
  return state;
}

function validateActionsArgument(actions) {
  const msg = '`actions` must be an array of functions or promises';
  if (!Array.isArray(actions)) {
    return msg;
  }
  const doesActionsContainNonFunction = find(actions, action => typeof action !== 'function');
  if (doesActionsContainNonFunction) {
    return msg;
  }
  return null;
}
