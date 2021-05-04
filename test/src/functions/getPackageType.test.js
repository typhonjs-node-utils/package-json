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
   ...pathInfo('.', 'module'),
   ...pathInfo('./test', 'module'),
   ...pathInfo('./test/fixtures/packages/type', 'commonjs'),
   ...pathInfo('./test/fixtures/packages/type/malformed-package-json', 'commonjs'),
   ...pathInfo('./test/fixtures/packages/type/no-type', 'commonjs'),
   ...pathInfo('./test/fixtures/packages/type/no-package-json', 'commonjs'),
   ...pathInfo('./test/fixtures/packages/type/type-commonjs', 'commonjs'),
   ...pathInfo('./test/fixtures/packages/type/type-module', 'module'),
   ...pathInfo('./test/fixtures/packages/type/type-module/subdir', 'commonjs'),
   ...pathInfo('', 'commonjs'),
   ...pathInfo('SJ}::|?/\0///\\', 'commonjs')
};

if (test.getPackageType)
{
   /**
    * Test all checks defined above.
    */
   describe(`getPackageType (all checks)`, () =>
   {
      for (const directory of Object.keys(checks))
      {
         describe(`getPackageType (${directory})`, () =>
         {
            for (const [filepath, type] of Object.entries(checks[directory]))
            {
               it(`${filepath} -> ${type}`, () =>
               {
                  assert.strictEqual(getPackageType({ filepath }), type);
               });
            }
         });
      }
   });
}
