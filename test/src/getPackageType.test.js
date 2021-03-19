import { assert }          from 'chai';

import { getPackageType }  from '../../src/index.js';

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
});

/**
 * Test all checks defined above.
 */
describe(`getPackageType (all checks)`, () =>
{
   for (const directory of Object.keys(checks))
   {
      describe(`getPackageType (${directory})`, () =>
      {
         for (const [filePath, type] of Object.entries(checks[directory]))
         {
            it(`${filePath} -> ${type}`, () =>
            {
               assert.strictEqual(getPackageType(filePath), type);
            });
         }
      });
   }
});
