import path                from 'path';

import { assert }          from 'chai';

import { getPackagePath }  from '../../../src/functions.js';

import test                from '../../util/test.js';

if (test.getPackagePath)
{
   describe(`getPackagePath`, () =>
   {
      it('module package.json', () =>
      {
         const data = getPackagePath({ filepath: import.meta.url });

         assert.strictEqual(data.packageObj.name, '@typhonjs-utils/package-json');
         assert.strictEqual(data.packagePath, `${path.resolve('.')}${path.sep}package.json`);
      });

      it('with callback function', () =>
      {
         const data = getPackagePath({ filepath: './test/fixtures/packages/name/name-missing',
          callback: (data) => typeof data.packageObj.name === 'string' });

         assert.strictEqual(data.packageObj.name, 'base');
         assert.strictEqual(data.packagePath,
          `${path.resolve('./test/fixtures/packages/name')}${path.sep}package.json`);
      });
   });
}
