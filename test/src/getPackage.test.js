import { assert } from 'chai';

import { getPackage }   from '../../src/index.js';

/**
 * Tests all of the API errors regarding invoking better errors as an external consumer.
 */
describe(`getPackage`, () =>
{
   it(`name-good`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name-good/test.js');
      assert.strictEqual(result.name, 'good');
   });

   it(`name-good (directory)`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name-good');
      assert.strictEqual(result.name, 'good');
   });

   it(`name-missing`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name-missing/test.js');
      assert.deepEqual(result, {});
   });

   it(`name-missing (directory)`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name-missing/');
      assert.deepEqual(result, {});
   });

   it(`name-parent->child->missing`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name-parent/name-child/no-package-json/test.js');
      assert.strictEqual(result.name, 'child');
   });

   it(`name-parent->child->missing (directory)`, () =>
   {
      const result = getPackage('./test/fixtures/packages/name-parent/name-child/no-package-json');
      assert.strictEqual(result.name, 'child');
   });

   it(`no-package-json`, () =>
   {
      const result = getPackage('./test/fixtures/packages/no-package-json/test.js');
      assert.strictEqual(result.name, 'base');
   });

   it(`no-package-json w/ basePath`, () =>
   {
      const result = getPackage('./test/fixtures/packages/no-package-json/test.js',
       './test/fixtures/packages/no-package-json/');
      assert.strictEqual(result, null);
   });

   it(`no-package-json (directory) w/ basePath`, () =>
   {
      const result = getPackage('./test/fixtures/packages/no-package-json',
       './test/fixtures/packages/no-package-json');
      assert.strictEqual(result, null);
   });
});
