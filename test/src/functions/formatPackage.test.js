import { assert }          from 'chai';

import { formatPackage }   from '../../../src/functions.js';
import { getPackage }      from '../../../src/functions.js';

import test                from '../../util/test.js';

import verifyFormatted     from '../../util/verifyFormatted.js';

if (test.formatPackage)
{
   describe('formatPackage:', () =>
   {
      it('getPackage / format', () =>
      {
         const packageObj = getPackage({ filepath: import.meta.url });
         const data = formatPackage(packageObj);

         assert.deepEqual(data, verifyFormatted(data.version));
      });

      it('formatPackage - bugs', () =>
      {
         const data = formatPackage({ bugs: 'test' });

         assert.deepEqual(data, {
            name: '',
            version: '',
            description: '',
            type: 'commonjs',
            homepage: '',
            license: '',
            repository: '',
            bugsURL: 'test',
            bugsEmail: '',
            formattedMessage: '\nbugs / issues: test'
         });
      });

      it('formatPackage - repository.url', () =>
      {
         const data = formatPackage({ repository: { url: 'test' } });

         assert.deepEqual(data, {
            name: '',
            version: '',
            description: '',
            type: 'commonjs',
            homepage: '',
            license: '',
            repository: 'test',
            bugsURL: '',
            bugsEmail: '',
            formattedMessage: '\nrepository: test'
         });
      });

      it('formatPackage - repository', () =>
      {
         const data = formatPackage({ repository: 'test' });

         assert.deepEqual(data, {
            name: '',
            version: '',
            description: '',
            type: 'commonjs',
            homepage: '',
            license: '',
            repository: 'test',
            bugsURL: '',
            bugsEmail: '',
            formattedMessage: '\nrepository: test'
         });
      });

      it('formatPackage - name no version', () =>
      {
         const data = formatPackage({ name: 'a-name' });

         assert.deepEqual(data, {
            name: 'a-name',
            version: '',
            description: '',
            type: 'commonjs',
            homepage: '',
            license: '',
            repository: '',
            bugsURL: '',
            bugsEmail: '',
            formattedMessage: 'name: a-name'
         });
      });
   });
}
