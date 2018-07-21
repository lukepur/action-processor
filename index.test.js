const assert = require('assert');
const {describe, it} = require('mocha');

const {run} = require('./index');

describe('action-processor', async () => {
  describe('run', async () => {
    it('should throw an error if actions argument is not array', async () => {
      await assert.rejects(() => run({}, 'not an array'), Error);
    });

    it('should throw an error if actions argument contains non-function member', async () => {
      assert.rejects(() => run({}, ['not an array']), Error);
    });

    it('should return initial state if no actions provided', async () => {
      const result = await run({}, []);
      assert.deepEqual(result, {});
    });

    it('should result in correct state for single actions', async () => {
      const result = await run(0, [actionAdd1]);
      assert.equal(result, 1);
    });

    it('should result in correct state for multiple actions', async () => {
      const result = await run(0, [actionAdd1, actionAdd1]);
      assert.equal(result, 2);
    });

    it('should result in correct state for multiple action containing async behaviour', async () => {
      const result = await run(0, [actionAdd1, actionAsyncMultiplyBy10, actionAdd1]);
      assert.equal(result, 11);
    });

    it('should throw an error if any action throws an error', async () => {
      await assert.rejects(() => run(0, [actionAdd1, actionThrowsError, actionAdd1]), Error);
    });

    it('should continue processing if skipErrors is true', async () => {
      const result = await run(0, [actionAdd1, actionThrowsError, actionAdd1], {continueOnFailure: true});
      assert.equal(result, 2);
    });

    it('should continue processing if skipErrors is true and not be affected by failed action', async () => {
      const result = await run({val: 0}, [actionAdd1ToVal, actionModifiesStateThenErrors, actionAdd1ToVal], {continueOnFailure: true});
      assert.equal(result.val, 2);
    });
  });
});

// test actions
function actionAdd1(state) {
  return state + 1;
}

async function actionAsyncMultiplyBy10(state) {
  return state * 10;
}

function actionAdd1ToVal(state) {
  state.val += 1;
  return state;
}

function actionModifiesStateThenErrors(state) {
  state.val = 'should not show';
  throw new Error('Test error');
}

function actionThrowsError(state) {
  throw new Error('Test error');
}