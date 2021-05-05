import path                from 'path';

import { assert }          from 'chai';

import { getPackageWithPath }  from '../../../src/functions.js';

import test                from '../../util/test.js';

if (test.getPackageWithPath_API)
{
   /**
    * Tests all of the API errors regarding invoking better errors as an external consumer.
    */
   describe(`getPackagePath - destructure bad data`, () =>
   {
      it(`bad options`, () =>
      {
         const { packageObj, packagePath, error } = getPackageWithPath(false);

         assert.strictEqual(packageObj, void 0);
         assert.strictEqual(packagePath, void 0);
         assert.strictEqual(error.toString(), `TypeError: 'options' is not an object`);
      });

      it(`bad filepath`, () =>
      {
         const { packageObj, packagePath, error } = getPackageWithPath({ filepath: false });

         assert.strictEqual(packageObj, void 0);
         assert.strictEqual(packagePath, void 0);
         assert.strictEqual(error.toString(), `TypeError: 'filepath' is not a string or file URL`);
      });

      it(`bad basepath`, () =>
      {
         const { packageObj, packagePath, error } = getPackageWithPath({ filepath: '.', basepath: false });

         assert.strictEqual(packageObj, void 0);
         assert.strictEqual(packagePath, void 0);
         assert.strictEqual(error.toString(), `TypeError: 'basepath' is not a string or file URL`);
      });

      it(`bad callback`, () =>
      {
         const { packageObj, packagePath, error } = getPackageWithPath({
            filepath: '.',
            basepath: '.',
            callback: false
         });

         assert.strictEqual(packageObj, void 0);
         assert.strictEqual(packagePath, void 0);
         assert.strictEqual(error.toString(), `TypeError: 'callback' is not a function`);
      });

      it(`nothing found`, () =>
      {
         const rootPath = path.parse(path.resolve('.')).root;

         const { packageObj, packagePath, error } = getPackageWithPath({ filepath: rootPath });

         assert.strictEqual(packageObj, void 0);
         assert.strictEqual(packagePath, void 0);
         assert.strictEqual(error.toString(), `Error: No 'package.json' located`);
      });

      it(`filepath as http URL`, () =>
      {
         const { packageObj, packagePath, error } = getPackageWithPath({ filepath: new URL('http://www.bad.com/') });

         assert.strictEqual(packageObj, void 0);
         assert.strictEqual(packagePath, void 0);
         assert.strictEqual(error.toString(), `TypeError [ERR_INVALID_URL_SCHEME]: The URL must be of scheme file`);
      });

      it(`basepath as http URL`, () =>
      {
         const { packageObj, packagePath, error } = getPackageWithPath({
            filepath: './test',
            basepath: new URL('http://www.bad.com/')
         });

         assert.strictEqual(packageObj, void 0);
         assert.strictEqual(packagePath, void 0);
         assert.strictEqual(error.toString(), `TypeError [ERR_INVALID_URL_SCHEME]: The URL must be of scheme file`);
      });
   });
}
