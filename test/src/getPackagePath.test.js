import path                from 'path';

import { assert }          from 'chai';

import { getPackagePath }  from '../../src/index.js';

/**
 * Tests all of the API errors regarding invoking better errors as an external consumer.
 */
describe(`getPackagePath - destructure bad data`, () =>
{
   it(`bad filepath`, () =>
   {
      const { packageObj, packagePath, error } = getPackagePath(false);

      assert.strictEqual(packageObj, void 0);
      assert.strictEqual(packagePath, void 0);
      assert.strictEqual(error.toString(), `TypeError: 'filepath' is not a 'string' or file 'URL'.`);
   });

   it(`bad basepath`, () =>
   {
      const { packageObj, packagePath, error } = getPackagePath({ filepath: '.', basepath: false });

      assert.strictEqual(packageObj, void 0);
      assert.strictEqual(packagePath, void 0);
      assert.strictEqual(error.toString(), `TypeError: 'basepath' is not a 'string' or file 'URL'.`);
   });

   it(`nothing found`, () =>
   {
      const rootPath = path.parse(path.resolve('.')).root;

      const { packageObj, packagePath, error } = getPackagePath({ filepath: rootPath });

      assert.strictEqual(packageObj, void 0);
      assert.strictEqual(packagePath, void 0);
      assert.strictEqual(error.toString(), `Error: No 'package.json' located`);
   });
});
