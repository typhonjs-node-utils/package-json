import fs                     from 'fs';
import path                   from 'path';

import { assert }             from 'chai';

import { getPackageWithPath } from '../../../src/functions.js';

import test                   from '../../util/test.js';

if (test.getPackageWithPath)
{
   describe(`getPackagePath`, () =>
   {
      it('module package.json', () =>
      {
         const data = getPackageWithPath({ filepath: import.meta.url });

         assert.strictEqual(data.packageObj.name, '@typhonjs-utils/package-json');
         assert.strictEqual(data.packagePath, `${path.resolve('.')}${path.sep}package.json`);
      });

      it('with callback function', () =>
      {
         const data = getPackageWithPath({
            filepath: './test/fixtures/packages/name/name-missing',
            callback: (data) => typeof data.packageObj.name === 'string'
         });

         assert.strictEqual(data.packageObj.name, 'base');
         assert.strictEqual(data.packagePath,
          `${path.resolve('./test/fixtures/packages/name')}${path.sep}package.json`);
      });

      it('with callback function (test if unix paths exist)', () =>
      {
         getPackageWithPath({
            filepath: './test/fixtures/packages/name/name-missing',
            callback: (data) =>
            {
               assert.isTrue(fs.existsSync(data.baseDir));
               assert.isTrue(fs.existsSync(data.currentDir));
               assert.isTrue(fs.existsSync(data.packagePath));
               assert.isTrue(fs.existsSync(data.relativeDir));
               assert.isTrue(fs.existsSync(data.rootPath));

               return typeof data.packageObj.name === 'string';
            }
         });
      });
   });
}
