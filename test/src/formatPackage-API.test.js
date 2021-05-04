import { assert }          from 'chai';

import test                from '../util/test.js';

import { formatPackage }   from '../../src/functions.js';

if (test.formatPackage_API)
{
   describe('formatPackage API', () =>
   {
      it('package object not an object', () =>
      {
         const result = formatPackage(false);

         assert.strictEqual(JSON.stringify(result),
          '{"type":"commonjs","repository":{},"bugs":{},"formattedMessage":""}');
      });

      it('package object bugs email not a string', () =>
      {
         const result = formatPackage({ bugs: { email: true } });

         assert.strictEqual(JSON.stringify(result),
          '{"type":"commonjs","repository":{},"bugs":{},"formattedMessage":""}');
      });

      it('package object bugs URL not a string', () =>
      {
         const result = formatPackage({ bugs: true });

         assert.strictEqual(JSON.stringify(result),
          '{"type":"commonjs","repository":{},"bugs":{},"formattedMessage":""}');
      });

      it('package object repo URL not a string', () =>
      {
         const result = formatPackage({ repository: true });

         assert.strictEqual(JSON.stringify(result),
          '{"type":"commonjs","repository":{},"bugs":{},"formattedMessage":""}');
      });
   });
}
