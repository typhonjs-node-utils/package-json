import fs                     from 'node:fs';
import path                   from 'node:path';

import { assert }             from 'chai';

import { getPackageWithPath } from '../../../src/functions.js';

import TraversalData from '../../../src/TraversalData.js';
import test          from '../../util/test.js';

if (test.getPackageWithPath_API)
{
   /**
    * Tests all of the API errors regarding invoking better errors as an external consumer.
    */
   describe(`getPackageWithPath - API Errors:`, () =>
   {
      it(`bad options`, () =>
      {
         const { packageObj, filepath, filepathUnix, error } = getPackageWithPath(false);

         assert.isUndefined(packageObj);
         assert.isUndefined(filepath);
         assert.isUndefined(filepathUnix);
         assert.strictEqual(error.toString(), `TypeError: 'options' is not an object`);
      });

      it(`bad filepath`, () =>
      {
         const { packageObj, filepath, filepathUnix, error } = getPackageWithPath({ filepath: false });

         assert.isUndefined(packageObj);
         assert.isUndefined(filepath);
         assert.isUndefined(filepathUnix);
         assert.strictEqual(error.toString(), `TypeError: 'filepath' is not a string or file URL`);
      });

      it(`bad basepath`, () =>
      {
         const { packageObj, filepath, filepathUnix, error } = getPackageWithPath({
            filepath: '.',
            basepath: false
         });

         assert.isUndefined(packageObj);
         assert.isUndefined(filepath);
         assert.isUndefined(filepathUnix);
         assert.strictEqual(error.toString(), `TypeError: 'basepath' is not a string or file URL`);
      });

      it(`bad callback`, () =>
      {
         const { packageObj, filepath, filepathUnix, error } = getPackageWithPath({
            filepath: '.',
            basepath: '.',
            callback: false
         });

         assert.isUndefined(packageObj);
         assert.isUndefined(filepath);
         assert.isUndefined(filepathUnix);
         assert.strictEqual(error.toString(), `TypeError: 'callback' is not a function`);
      });

      it(`nothing found`, () =>
      {
         const rootPath = path.parse(path.resolve('.')).root;

         const { packageObj, filepath, filepathUnix, error } = getPackageWithPath({ filepath: rootPath });

         assert.isUndefined(packageObj);
         assert.isUndefined(filepath);
         assert.isUndefined(filepathUnix);
         assert.strictEqual(error.toString(), `Error: No 'package.json' located`);
      });

      it(`filepath as http URL`, () =>
      {
         const { packageObj, filepath, filepathUnix, error } = getPackageWithPath({
            filepath: new URL('http://www.bad.com/')
         });

         assert.isUndefined(packageObj);
         assert.isUndefined(filepath);
         assert.isUndefined(filepathUnix);
         assert.strictEqual(error.toString(), `TypeError [ERR_INVALID_URL_SCHEME]: The URL must be of scheme file`);
      });

      it(`basepath as http URL`, () =>
      {
         const { packageObj, filepath, filepathUnix, error } = getPackageWithPath({
            filepath: './test',
            basepath: new URL('http://www.bad.com/')
         });

         assert.isUndefined(packageObj);
         assert.isUndefined(filepath);
         assert.isUndefined(filepathUnix);
         assert.strictEqual(error.toString(), `TypeError [ERR_INVALID_URL_SCHEME]: The URL must be of scheme file`);
      });

      it(`malformed package.json - filepath / filepathUnix defined`, () =>
      {
         const { packageObj, filepath, filepathUnix, error } = getPackageWithPath({
            filepath: './test/fixtures/packages/name/malformed-package-json/test.js'
         });

         const testPath =
          `${path.resolve('./test/fixtures/packages/name/malformed-package-json')}${path.sep}package.json`;

         assert.isUndefined(packageObj);
         assert.strictEqual(filepath, testPath);
         assert.strictEqual(filepathUnix, TraversalData.toUnixPath(testPath));

         assert.isTrue(fs.existsSync(filepath));
         assert.isTrue(fs.existsSync(filepathUnix));

         // On Windows the character position for the error is different so just check the start of the error message.
         assert.isTrue(error.toString().startsWith(`SyntaxError: Expected property name or '}' in JSON at position`) ||
          // For older Node versions.
          error.toString().startsWith(`SyntaxError: Unexpected token B in JSON at position`));
      });
   });
}
