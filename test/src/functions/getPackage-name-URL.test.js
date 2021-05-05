import path             from 'path';
import url              from 'url';

import { assert }       from 'chai';

import { getPackage }   from '../../../src/functions.js';

import test             from '../../util/test.js';

if (test.getPackage_name_URL)
{
   describe(`getPackage as file URL string:`, () =>
   {
      it(`name-good w/ filepath as URL`, () =>
      {
         const result = getPackage({
            filepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/name-good/test.js')).toString()
         });
         assert.strictEqual(result.name, 'good');
      });

      it(`name-good (directory) w/ filepath as URL`, () =>
      {
         const result = getPackage({
            filepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/name-good')).toString()
         });
         assert.strictEqual(result.name, 'good');
      });

      it(`no-package-json w/ filepath - basepath as URL`, () =>
      {
         const result = getPackage({
            filepath: './test/fixtures/packages/name/no-package-json',
            basepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json/')).toString()
         });
         assert.isUndefined(result);
      });

      it(`no-package-json (directory) w/ filepath & basepath as URL`, () =>
      {
         const result = getPackage({
            filepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')).toString(),
            basepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')).toString()
         });
         assert.isUndefined(result);
      });

      it(`no-package-json w/ filepath & basepath as URL`, () =>
      {
         const result = getPackage({
            filepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')).toString(),
            basepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json/')).toString()
         });
         assert.isUndefined(result);
      });

      it(`no-package-json (directory) w/ basepath as URL`, () =>
      {
         const result = getPackage({
            filepath: './test/fixtures/packages/name/no-package-json',
            basepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')).toString()
         });
         assert.isUndefined(result);
      });
   });

   describe(`getPackage file URL`, () =>
   {
      it(`name-good w/ filepath as URL`, () =>
      {
         const result = getPackage({
            filepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/name-good/test.js'))
         });
         assert.strictEqual(result.name, 'good');
      });

      it(`name-good (directory) w/ filepath as URL`, () =>
      {
         const result = getPackage({
            filepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/name-good'))
         });
         assert.strictEqual(result.name, 'good');
      });

      it(`no-package-json w/ filepath - basepath as URL`, () =>
      {
         const result = getPackage({
            filepath: './test/fixtures/packages/name/no-package-json',
            basepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json/'))
         });
         assert.isUndefined(result);
      });

      it(`no-package-json (directory) w/ filepath & basepath as URL`, () =>
      {
         const result = getPackage({
            filepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')),
            basepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json'))
         });
         assert.isUndefined(result);
      });

      it(`no-package-json w/ filepath & basepath as URL`, () =>
      {
         const result = getPackage({
            filepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')),
            basepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json/'))
         });
         assert.isUndefined(result);
      });

      it(`no-package-json (directory) w/ filepath - basepath as URL`, () =>
      {
         const result = getPackage({
            filepath: './test/fixtures/packages/name/no-package-json',
            basepath: url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json'))
         });
         assert.isUndefined(result);
      });
   });
}
