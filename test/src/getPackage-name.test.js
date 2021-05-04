import path             from 'path';

import { assert }       from 'chai';

import { getPackage }   from '../../src/functions.js';

import test             from '../util/test.js';

if (test.getPackage_name)
{
   /**
    * Tests all of the API errors regarding invoking better errors as an external consumer.
    */
   describe(`getPackage`, () =>
   {
      it(`malformed-package`, () =>
      {
         const result = getPackage({ filepath: './test/fixtures/packages/name/malformed-package-json/test.js' });
         assert.strictEqual(result, void 0);
      });

      it(`malformed-package (directory)`, () =>
      {
         const result = getPackage({ filepath: './test/fixtures/packages/name/malformed-package-json' });
         assert.strictEqual(result, void 0);
      });

      it(`name-good`, () =>
      {
         const result = getPackage({ filepath: './test/fixtures/packages/name/name-good/test.js' });
         assert.strictEqual(result.name, 'good');
      });

      it(`name-good (directory)`, () =>
      {
         const result = getPackage({ filepath: './test/fixtures/packages/name/name-good' });
         assert.strictEqual(result.name, 'good');
      });

      it(`name-missing`, () =>
      {
         const result = getPackage({ filepath: './test/fixtures/packages/name/name-missing/test.js' });
         assert.deepEqual(result, {});
      });

      it(`name-missing (directory)`, () =>
      {
         const result = getPackage({ filepath: './test/fixtures/packages/name/name-missing/' });
         assert.deepEqual(result, {});
      });

      it(`name-parent->child->missing`, () =>
      {
         const result = getPackage(
            { filepath: './test/fixtures/packages/name/name-parent/name-child/no-package-json/test.js' });
         assert.strictEqual(result.name, 'child');
      });

      it(`name-parent->child->missing (directory)`, () =>
      {
         const result = getPackage(
            { filepath: './test/fixtures/packages/name/name-parent/name-child/no-package-json' });
         assert.strictEqual(result.name, 'child');
      });

      it(`no-package-json`, () =>
      {
         const result = getPackage({ filepath: './test/fixtures/packages/name/no-package-json/test.js' });
         assert.strictEqual(result.name, 'base');
      });

      it(`no-package-json w/ basepath`, () =>
      {
         const result = getPackage({
            filepath: './test/fixtures/packages/name/no-package-json/test.js',
            basepath: './test/fixtures/packages/name/no-package-json/'
         });
         assert.strictEqual(result, void 0);
      });

      it(`no-package-json w/ basepath defined as file path`, () =>
      {
         const result = getPackage({
            filepath: './test/fixtures/packages/name/no-package-json/test.js',
            basepath: './test/fixtures/packages/name/no-package-json/test.js'
         });
         assert.strictEqual(result, void 0);
      });

      it(`no-package-json (directory) w/ basepath`, () =>
      {
         const result = getPackage({
            filepath: './test/fixtures/packages/name/no-package-json',
            basepath: './test/fixtures/packages/name/no-package-json'
         });
         assert.strictEqual(result, void 0);
      });

      it(`import.meta.url`, () =>
      {
         const result = getPackage({ filepath: import.meta.url });
         assert.strictEqual(result.name, '@typhonjs-utils/package-json');
      });

      it(`Dummy near root`, () =>
      {
         const result = getPackage({ filepath: `${path.sep}dummy-dir${path.sep}dummy-file.js` });
         assert.strictEqual(result, void 0);
      });
   });
}
