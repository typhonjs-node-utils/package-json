import { assert }          from 'chai';

import { getPackageType }  from '../../src/index.js';

/**
 * Test bad data input.
 */
describe(`getPackageType - API error / bad data`, () =>
{
   it(`bad-data (boolean)`, () =>
   {
      const result = getPackageType(false);

      assert.strictEqual(result, 'commonjs');
   });

   it(`bad-data (boolean)`, () =>
   {
      const result = getPackageType({ filepath: false });

      assert.strictEqual(result, 'commonjs');
   });
});
