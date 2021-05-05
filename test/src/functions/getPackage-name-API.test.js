import { assert }       from 'chai';

import { getPackage }   from '../../../src/functions.js';

import test             from '../../util/test.js';

if (test.getPackage_name_API)
{
   /**
    * Tests all of the API errors regarding invoking better errors as an external consumer.
    */
   describe(`getPackage (API Error):`, () =>
   {
      it(`void 0`, () =>
      {
         const result = getPackage({ filepath: void 0 });
         assert.isUndefined(result);
      });

      it(`not object (boolean)`, () =>
      {
         const result = getPackage(false);
         assert.isUndefined(result);
      });

      it(`not object (string has null)`, () =>
      {
         const result = getPackage('SJ}::|?/\0///\\');
         assert.isUndefined(result);
      });

      it(`bad-data (boolean)`, () =>
      {
         const result = getPackage({ filepath: false });
         assert.isUndefined(result);
      });

      it(`bad-path (string has null)`, () =>
      {
         const result = getPackage({ filepath: 'SJ}::|?/\0///\\' });
         assert.isUndefined(result);
      });
   });
}
