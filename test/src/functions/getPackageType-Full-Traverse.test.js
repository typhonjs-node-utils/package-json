import { assert }          from 'chai';

import { getPackageType }  from '../../../src/functions.js';

import test                from '../../util/test.js';

const pathInfo = (directory, type) => ({
   [`${directory}`]: {
      [`${directory}/file.js`]: type,
      [`${directory}/file.cjs`]: type,
      [`${directory}/file.mjs`]: type,
      [`${directory}/`]: type
   }
});

const checks = {
   ...pathInfo('./test/fixtures/packages/type-full/module', 'module'),
   ...pathInfo('./test/fixtures/packages/type-full/module/commonjs', 'commonjs'),
   ...pathInfo('./test/fixtures/packages/type-full/module/commonjs/no-package', 'commonjs'),
   ...pathInfo('./test/fixtures/packages/type-full/module/commonjs/no-package/no-type', 'commonjs'),
   ...pathInfo('./test/fixtures/packages/type-full/module/no-type', 'commonjs'),
   ...pathInfo('./test/fixtures/packages/type-full/module/no-type/no-type', 'commonjs'),
   ...pathInfo('./test/fixtures/packages/type-full/module/no-type/no-type/no-package', 'commonjs')
};

if (test.getPackageType_Full_Traverse)
{
   /**
    * Test all checks defined above.
    */
   describe(`getPackageType - basepath set - make sure traversal stops early:`, () =>
   {
      for (const directory of Object.keys(checks))
      {
         describe(`getPackageType (${directory}):`, () =>
         {
            for (const [filepath, type] of Object.entries(checks[directory]))
            {
               it(`${filepath} -> ${type}`, () =>
               {
                  assert.strictEqual(getPackageType({
                     filepath,
                     basepath: './test/fixtures/packages/type-full'
                  }), type);
               });
            }
         });
      }
   });
}
