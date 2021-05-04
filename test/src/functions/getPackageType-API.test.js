import { assert }          from 'chai';

import { getPackageType }  from '../../../src/functions.js';

import test                from '../../util/test.js';

if (test.getPackageType_API)
{
   /**
    * Test bad data input.
    */
   describe(`getPackageType - API error / bad data`, () =>
   {
      it(`test `, () =>
      {
         const result = getPackageType({
            filepath: './test/fixtures/packages/type/type-module/subdir/'
         });

         assert.strictEqual(result, 'commonjs');
      });

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
}
