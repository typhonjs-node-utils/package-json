import { assert }                from 'chai';

import { getPackageAndFormat }   from '../../../src/functions.js';

import test                      from '../../util/test.js';

if (test.getPackageAndFormat_API)
{
   describe('getPackageAndFormat - API Errors:', () =>
   {
      it('bad package query object - wrong data', () =>
      {
         const data = getPackageAndFormat(false);

         assert.isUndefined(data);
      });

      it('bad package query object - no filepath', () =>
      {
         const data = getPackageAndFormat({});

         assert.isUndefined(data);
      });

      it('bad package query object - bad path', () =>
      {
         const data = getPackageAndFormat({ filepath: 'dir1/dir2' });

         assert.isUndefined(data);
      });


      it(`malformed package.json`, () =>
      {
         const data = getPackageAndFormat({
            filepath: './test/fixtures/packages/name/malformed-package-json/test.js'
         });

         assert.isUndefined(data);
      });
   });
}
