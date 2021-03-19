import path                from 'path';

import { assert }          from 'chai';

import { getPackagePath }  from '../../src/index.js';

/**
 * Tests all of the API errors regarding invoking better errors as an external consumer.
 */
describe(`getPackagePath - destructure bad data`, () =>
{
   it(`bad filePath`, () =>
   {
      const { packageObj, packagePath, error } = getPackagePath(false);
      assert.strictEqual(packageObj, void 0);
      assert.strictEqual(packagePath, void 0);
      assert.strictEqual(error.toString(), `TypeError: 'filePath' is not a 'string' or file 'URL'.`);
   });

   it(`bad basePath`, () =>
   {
      const { packageObj, packagePath, error } = getPackagePath('.', false);
      assert.strictEqual(packageObj, void 0);
      assert.strictEqual(packagePath, void 0);
      assert.strictEqual(error.toString(), `TypeError: 'basePath' is not a 'string' or file 'URL'.`);
   });

   it(`nothing found`, () =>
   {
      const rootPath = path.parse(path.resolve('.')).root;

      const { packageObj, packagePath, error } = getPackagePath(rootPath);
      assert.strictEqual(packageObj, void 0);
      assert.strictEqual(packagePath, void 0);
      assert.strictEqual(error.toString(), `Error: No 'package.json' located`);
   });
});
