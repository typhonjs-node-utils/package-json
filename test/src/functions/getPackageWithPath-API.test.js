import path                   from 'path';

import { assert }             from 'chai';

import { getPackageWithPath } from '../../../src/functions.js';

import TraversalData          from '../../../src/TraversalData.js';
import test                   from '../../util/test.js';

if (test.getPackageWithPath_API)
{
   /**
    * Tests all of the API errors regarding invoking better errors as an external consumer.
    */
   describe(`getPackageWithPath - API Errors:`, () =>
   {
      it(`bad options`, () =>
      {
         const { packageObj, packagePath, packagePathUnix, error } = getPackageWithPath(false);

         assert.isUndefined(packageObj);
         assert.isUndefined(packagePath);
         assert.isUndefined(packagePathUnix);
         assert.strictEqual(error.toString(), `TypeError: 'options' is not an object`);
      });

      it(`bad filepath`, () =>
      {
         const { packageObj, packagePath, packagePathUnix, error } = getPackageWithPath({ filepath: false });

         assert.isUndefined(packageObj);
         assert.isUndefined(packagePath);
         assert.isUndefined(packagePathUnix);
         assert.strictEqual(error.toString(), `TypeError: 'filepath' is not a string or file URL`);
      });

      it(`bad basepath`, () =>
      {
         const { packageObj, packagePath, packagePathUnix, error } = getPackageWithPath({
            filepath: '.',
            basepath: false
         });

         assert.isUndefined(packageObj);
         assert.isUndefined(packagePath);
         assert.isUndefined(packagePathUnix);
         assert.strictEqual(error.toString(), `TypeError: 'basepath' is not a string or file URL`);
      });

      it(`bad callback`, () =>
      {
         const { packageObj, packagePath, packagePathUnix, error } = getPackageWithPath({
            filepath: '.',
            basepath: '.',
            callback: false
         });

         assert.isUndefined(packageObj);
         assert.isUndefined(packagePath);
         assert.isUndefined(packagePathUnix);
         assert.strictEqual(error.toString(), `TypeError: 'callback' is not a function`);
      });

      it(`nothing found`, () =>
      {
         const rootPath = path.parse(path.resolve('.')).root;

         const { packageObj, packagePath, packagePathUnix, error } = getPackageWithPath({ filepath: rootPath });

         assert.isUndefined(packageObj);
         assert.isUndefined(packagePath);
         assert.isUndefined(packagePathUnix);
         assert.strictEqual(error.toString(), `Error: No 'package.json' located`);
      });

      it(`filepath as http URL`, () =>
      {
         const { packageObj, packagePath, packagePathUnix, error } = getPackageWithPath({
            filepath: new URL('http://www.bad.com/')
         });

         assert.isUndefined(packageObj);
         assert.isUndefined(packagePath);
         assert.isUndefined(packagePathUnix);
         assert.strictEqual(error.toString(), `TypeError [ERR_INVALID_URL_SCHEME]: The URL must be of scheme file`);
      });

      it(`basepath as http URL`, () =>
      {
         const { packageObj, packagePath, packagePathUnix, error } = getPackageWithPath({
            filepath: './test',
            basepath: new URL('http://www.bad.com/')
         });

         assert.isUndefined(packageObj);
         assert.isUndefined(packagePath);
         assert.isUndefined(packagePathUnix);
         assert.strictEqual(error.toString(), `TypeError [ERR_INVALID_URL_SCHEME]: The URL must be of scheme file`);
      });

      it(`malformed package.json - packagePath / packagePathUnix defined`, () =>
      {
         const { packageObj, packagePath, packagePathUnix, error } = getPackageWithPath({
            filepath: './test/fixtures/packages/name/malformed-package-json/test.js'
         });

         const testPath =
          `${path.resolve('./test/fixtures/packages/name/malformed-package-json')}${path.sep}package.json`;

         assert.isUndefined(packageObj);
         assert.strictEqual(packagePath, testPath);
         assert.strictEqual(packagePathUnix, TraversalData.toUnixPath(testPath));

         // On Windows the character position for the error is different so just check the start of the error message.
         assert.isTrue(error.toString().startsWith('SyntaxError: Unexpected token B in JSON at position'));
      });
   });
}
