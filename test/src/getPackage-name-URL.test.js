import path       from 'path';
import url        from 'url';

import { assert } from 'chai';

import { getPackage }   from '../../src/index.js';

describe(`getPackage as string URL`, () =>
{
   before(() => { getPackage.clearCache(); });

   it(`name-good w/ filePath as URL`, () =>
   {
      const result = getPackage(
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/name-good/test.js')).toString());
      assert.strictEqual(result.name, 'good');
   });

   it(`name-good (directory) w/ filePath as URL`, () =>
   {
      const result = getPackage(
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/name-good')).toString());
      assert.strictEqual(result.name, 'good');
   });

   it(`no-package-json w/ filePath & basePath as file URL`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/no-package-json',
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json/')).toString());
      assert.strictEqual(result, null);
   });

   it(`no-package-json (directory) w/ filePath & basePath as file URL`, () =>
   {
      const result = getPackage(
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')).toString(),
        url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')).toString());
      assert.strictEqual(result, null);
   });

   it(`no-package-json w/ basePath as file URL`, () =>
   {
      const result = getPackage(
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')).toString(),
        url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json/')).toString());
      assert.strictEqual(result, null);
   });

   it(`no-package-json (directory) w/ basePath as file URL`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/no-package-json',
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')).toString());
      assert.strictEqual(result, null);
   });
});

describe(`getPackage as string URL (from cache)`, () =>
{
   it(`name-good w/ filePath as URL`, () =>
   {
      const result = getPackage(
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/name-good/test.js')).toString());
      assert.strictEqual(result.name, 'good');
   });

   it(`name-good (directory) w/ filePath as URL`, () =>
   {
      const result = getPackage(
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/name-good')).toString());
      assert.strictEqual(result.name, 'good');
   });

   it(`no-package-json w/ filePath & basePath as file URL`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/no-package-json',
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json/')).toString());
      assert.strictEqual(result, null);
   });

   it(`no-package-json (directory) w/ filePath & basePath as file URL`, () =>
   {
      const result = getPackage(
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')).toString(),
        url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')).toString());
      assert.strictEqual(result, null);
   });

   it(`no-package-json w/ basePath as file URL`, () =>
   {
      const result = getPackage(
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')).toString(),
        url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json/')).toString());
      assert.strictEqual(result, null);
   });

   it(`no-package-json (directory) w/ basePath as file URL`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/no-package-json',
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')).toString());
      assert.strictEqual(result, null);
   });
});

describe(`getPackage URL`, () =>
{
   before(() => { getPackage.clearCache(); });

   it(`name-good w/ filePath as URL`, () =>
   {
      const result = getPackage(url.pathToFileURL(path.resolve('./test/fixtures/packages/name/name-good/test.js')));
      assert.strictEqual(result.name, 'good');
   });

   it(`name-good (directory) w/ filePath as URL`, () =>
   {
      const result = getPackage(url.pathToFileURL(path.resolve('./test/fixtures/packages/name/name-good')));
      assert.strictEqual(result.name, 'good');
   });

   it(`no-package-json w/ filePath & basePath as file URL`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/no-package-json',
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json/')));
      assert.strictEqual(result, null);
   });

   it(`no-package-json (directory) w/ filePath & basePath as file URL`, () =>
   {
      const result = getPackage(url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')),
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')));
      assert.strictEqual(result, null);
   });

   it(`no-package-json w/ basePath as file URL`, () =>
   {
      const result = getPackage(url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')),
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json/')));
      assert.strictEqual(result, null);
   });

   it(`no-package-json (directory) w/ basePath as file URL`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/no-package-json',
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')));
      assert.strictEqual(result, null);
   });
});

describe(`getPackage URL (from cache)`, () =>
{
   it(`name-good w/ filePath as URL`, () =>
   {
      const result = getPackage(url.pathToFileURL(path.resolve('./test/fixtures/packages/name/name-good/test.js')));
      assert.strictEqual(result.name, 'good');
   });

   it(`name-good (directory) w/ filePath as URL`, () =>
   {
      const result = getPackage(url.pathToFileURL(path.resolve('./test/fixtures/packages/name/name-good')));
      assert.strictEqual(result.name, 'good');
   });

   it(`no-package-json w/ filePath & basePath as file URL`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/no-package-json',
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json/')));
      assert.strictEqual(result, null);
   });

   it(`no-package-json (directory) w/ filePath & basePath as file URL`, () =>
   {
      const result = getPackage(url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')),
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')));
      assert.strictEqual(result, null);
   });

   it(`no-package-json w/ basePath as file URL`, () =>
   {
      const result = getPackage(url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')),
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json/')));
      assert.strictEqual(result, null);
   });

   it(`no-package-json (directory) w/ basePath as file URL`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/no-package-json',
       url.pathToFileURL(path.resolve('./test/fixtures/packages/name/no-package-json')));
      assert.strictEqual(result, null);
   });
});
