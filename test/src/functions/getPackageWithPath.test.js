import fs                     from 'fs';
import path                   from 'path';

import { assert }             from 'chai';

import { getPackageWithPath } from '../../../src/functions.js';
import TraversalData          from '../../../src/TraversalData.js';

import test                   from '../../util/test.js';

if (test.getPackageWithPath)
{
   describe(`getPackageWithPath:`, () =>
   {
      it('module package.json', () =>
      {
         const data = getPackageWithPath({ filepath: import.meta.url });

         const filepath = `${path.resolve('.')}${path.sep}package.json`;

         assert.strictEqual(data.packageObj.name, '@typhonjs-utils/package-json');
         assert.strictEqual(data.filepath, filepath);
         assert.strictEqual(data.filepathUnix, TraversalData.toUnixPath(filepath));

         assert.isTrue(fs.existsSync(data.filepath));
         assert.isTrue(fs.existsSync(data.filepathUnix));
      });

      it('with callback function', () =>
      {
         const data = getPackageWithPath({
            filepath: './test/fixtures/packages/name/name-missing',
            callback: (data) => typeof data.packageObj.name === 'string'
         });

         const filepath = `${path.resolve('./test/fixtures/packages/name')}${path.sep}package.json`;

         assert.strictEqual(data.packageObj.name, 'base');
         assert.strictEqual(data.filepath, filepath);
         assert.strictEqual(data.filepathUnix, TraversalData.toUnixPath(filepath));

         assert.isTrue(fs.existsSync(data.filepath));
         assert.isTrue(fs.existsSync(data.filepathUnix));
      });

      it('with callback function (test if unix paths exist / verify relativeDir)', () =>
      {
         const checkRelativeDir = [
            'test/fixtures/packages/name/name-missing',
            'test/fixtures/packages/name'
         ];

         getPackageWithPath({
            filepath: './test/fixtures/packages/name/name-missing',
            callback: (data) =>
            {
               assert.isTrue(fs.existsSync(data.baseDir));
               assert.isTrue(fs.existsSync(data.currentDir));
               assert.isTrue(fs.existsSync(data.packagePath));
               assert.isTrue(fs.existsSync(data.relativeDir));
               assert.isTrue(fs.existsSync(data.rootPath));

               assert.strictEqual(data.relativeDir, checkRelativeDir[data.cntr]);

               return typeof data.packageObj.name === 'string';
            }
         });
      });
   });
}
