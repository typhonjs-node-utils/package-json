import { assert }                from 'chai';

import { getPackageAndFormat }   from '../../../src/functions.js';

import test                      from '../../util/test.js';

import verifyFormatted           from '../../util/verifyFormatted.js';

if (test.getPackageAndFormat)
{
   describe('getPackageAndFormat:', () =>
   {
      it('module package.json:', () =>
      {
         const data = getPackageAndFormat({ filepath: import.meta.url });

         assert.deepEqual(data, verifyFormatted(data.version));
      });
   });
}
