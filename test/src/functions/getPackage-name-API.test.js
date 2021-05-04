import { assert }       from 'chai';

import { getPackage }   from '../../../src/functions.js';

import test             from '../../util/test.js';

if (test.getPackage_name_API)
{
   /**
    * Tests all of the API errors regarding invoking better errors as an external consumer.
    */
   describe(`getPackage (API Tests)`, () =>
   {
      it(`void 0`, () =>
      {
         const result = getPackage({ filepath: void 0 });
         assert.strictEqual(result, void 0);
      });

      it(`not object (boolean)`, () =>
      {
         const result = getPackage(false);
         assert.strictEqual(result, void 0);
      });

      it(`not object (string has null)`, () =>
      {
         const result = getPackage('SJ}::|?/\0///\\');
         assert.strictEqual(result, void 0);
      });

      it(`bad-data (boolean)`, () =>
      {
         const result = getPackage({ filepath: false });
         assert.strictEqual(result, void 0);
      });

      it(`bad-path (string has null)`, () =>
      {
         const result = getPackage({ filepath: 'SJ}::|?/\0///\\' });
         assert.strictEqual(result, void 0);
      });
   });
}
