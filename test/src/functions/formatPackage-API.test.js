import { assert }          from 'chai';

import test                from '../../util/test.js';

import { formatPackage }   from '../../../src/functions.js';

const s_EMPTY_FORMATTED = {
   name: '',
   version: '',
   description: '',
   type: 'commonjs',
   homepage: '',
   license: '',
   repository: '',
   bugsURL: '',
   bugsEmail: '',
   formattedMessage: ''
};

if (test.formatPackage_API)
{
   /**
    * Pass bad data to formatPackage.
    */
   describe('formatPackage API', () =>
   {
      it('package object not an object', () =>
      {
         const result = formatPackage(false);

         assert.deepEqual(result, s_EMPTY_FORMATTED);
      });

      it('package object bugs email not a string', () =>
      {
         const result = formatPackage({ bugs: { email: true } });

         assert.deepEqual(result, s_EMPTY_FORMATTED);
      });

      it('package object bugs URL not a string', () =>
      {
         const result = formatPackage({ bugs: true });

         assert.deepEqual(result, s_EMPTY_FORMATTED);
      });

      it('package object repo URL not a string', () =>
      {
         const result = formatPackage({ repository: true });

         assert.deepEqual(result, s_EMPTY_FORMATTED);
      });

      it('package object repo URL not a string', () =>
      {
         const result = formatPackage({ repository: { url: true } });

         assert.deepEqual(result, s_EMPTY_FORMATTED);
      });
   });
}
