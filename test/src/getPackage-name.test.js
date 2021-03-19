import path       from 'path';

import { assert } from 'chai';

import { getPackage }   from '../../src/index.js';

/**
 * Tests all of the API errors regarding invoking better errors as an external consumer.
 */
describe(`getPackage`, () =>
{
   before(() => { getPackage.clearCache(); });

   it(`bad-data (boolean)`, () =>
   {
      const result = getPackage(false);
      assert.strictEqual(result, null);
   });

   it(`bad-path (string)`, () =>
   {
      const result = getPackage('SJ}::|?////\\');
      assert.strictEqual(result, null);
   });

   it(`malformed-package`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/malformed-package-json/test.js');
      assert.strictEqual(result, null);
   });

   it(`malformed-package (directory)`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/malformed-package-json');
      assert.strictEqual(result, null);
   });

   it(`name-good`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/name-good/test.js');
      assert.strictEqual(result.name, 'good');
   });

   it(`name-good (directory)`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/name-good');
      assert.strictEqual(result.name, 'good');
   });

   it(`name-missing`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/name-missing/test.js');
      assert.deepEqual(result, {});
   });

   it(`name-missing (directory)`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/name-missing/');
      assert.deepEqual(result, {});
   });

   it(`name-parent->child->missing`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/name-parent/name-child/no-package-json/test.js');
      assert.strictEqual(result.name, 'child');
   });

   it(`name-parent->child->missing (directory)`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/name-parent/name-child/no-package-json');
      assert.strictEqual(result.name, 'child');
   });

   it(`no-package-json`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/no-package-json/test.js');
      assert.strictEqual(result.name, 'base');
   });

   it(`no-package-json w/ basePath`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/no-package-json/test.js',
       './test/fixtures/packages/name/no-package-json/');
      assert.strictEqual(result, null);
   });

   it(`no-package-json (directory) w/ basePath`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/no-package-json',
       './test/fixtures/packages/name/no-package-json');
      assert.strictEqual(result, null);
   });

   it(`import.meta.url`, () =>
   {
      const result = getPackage(import.meta.url);
      assert.strictEqual(result.name, '@typhonjs-node-utils/package-util');
   });

   it(`Dummy near root`, () =>
   {
      const result = getPackage(`${path.sep}dummy-dir${path.sep}dummy-file.js`);
      assert.strictEqual(result, null);
   });

   it(`void 0`, () =>
   {
      const result = getPackage(void 0);
      assert.strictEqual(result, null);
   });
});

/**
 * Tests all of the API errors regarding invoking better errors as an external consumer.
 */
describe(`getPackage (from cache)`, () =>
{
   it(`bad-data (boolean)`, () =>
   {
      const result = getPackage(false);
      assert.strictEqual(result, null);
   });

   it(`bad-path (string)`, () =>
   {
      const result = getPackage('SJ}::|?////\\');
      assert.strictEqual(result, null);
   });

   it(`malformed-package`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/malformed-package-json/test.js');
      assert.strictEqual(result, null);
   });

   it(`malformed-package (directory)`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/malformed-package-json');
      assert.strictEqual(result, null);
   });

   it(`name-good`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/name-good/test.js');
      assert.strictEqual(result.name, 'good');
   });

   it(`name-good (directory)`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/name-good');
      assert.strictEqual(result.name, 'good');
   });

   it(`name-missing`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/name-missing/test.js');
      assert.deepEqual(result, {});
   });

   it(`name-missing (directory)`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/name-missing/');
      assert.deepEqual(result, {});
   });

   it(`name-parent->child->missing`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/name-parent/name-child/no-package-json/test.js');
      assert.strictEqual(result.name, 'child');
   });

   it(`name-parent->child->missing (directory)`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/name-parent/name-child/no-package-json');
      assert.strictEqual(result.name, 'child');
   });

   it(`no-package-json`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/no-package-json/test.js');
      assert.strictEqual(result.name, 'base');
   });

   it(`no-package-json w/ basePath`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/no-package-json/test.js',
       './test/fixtures/packages/name/no-package-json/');
      assert.strictEqual(result, null);
   });

   it(`no-package-json (directory) w/ basePath`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name/no-package-json',
       './test/fixtures/packages/name/no-package-json');
      assert.strictEqual(result, null);
   });

   it(`import.meta.url`, () =>
   {
      const result = getPackage(import.meta.url);
      assert.strictEqual(result.name, '@typhonjs-node-utils/package-util');
   });

   it(`Dummy near root`, () =>
   {
      const result = getPackage(`${path.sep}dummy-dir${path.sep}dummy-file.js`);
      assert.strictEqual(result, null);
   });

   it(`void 0`, () =>
   {
      const result = getPackage(void 0);
      assert.strictEqual(result, null);
   });
});
