import { assert }          from 'chai';

import { formatPackage }   from '../../src/functions.js';
import { getPackage }      from '../../src/functions.js';

import test                from '../util/test.js';

const s_VERIFY_DATA = (version) => `{"name":"@typhonjs-utils/package-json","version":"${version}","type":"module","description":"Provides several utility methods for working with \`package.json\`.","homepage":"https://github.com/typhonjs-node-utils/package-json","license":"MPL-2.0","repository":{"url":"github:typhonjs-node-utils/package-json"},"bugs":{"email":"support@typhonjs.io","url":"https://github.com/typhonjs-node-utils/package-json/issues"},"formattedMessage":"name: @typhonjs-utils/package-json (${version})\\ndescription: Provides several utility methods for working with \`package.json\`.\\nhomepage: https://github.com/typhonjs-node-utils/package-json\\nrepository: github:typhonjs-node-utils/package-json\\nbugs / issues: https://github.com/typhonjs-node-utils/package-json/issues\\nbugs / email: support@typhonjs.io"}`;

if (test.formatPackage)
{
   describe('formatPackage', () =>
   {
      it('getPackage / format:', () =>
      {
         const packageObj = getPackage({ filepath: import.meta.url });
         const data = formatPackage(packageObj);

         assert.strictEqual(JSON.stringify(data), s_VERIFY_DATA(data.version));
      });

      it('formatPackage - repository.url:', () =>
      {
         const data = formatPackage({ repository: { url: 'test' } });

         assert.strictEqual(JSON.stringify(data),
          '{"type":"commonjs","repository":{"url":"test"},"bugs":{},"formattedMessage":"\\nrepository: test"}');
      });

      it('formatPackage - name no version:', () =>
      {
         const data = formatPackage({ name: 'a name' });

         assert.strictEqual(JSON.stringify(data),
          '{"name":"a name","type":"commonjs","repository":{},"bugs":{},"formattedMessage":"name: a name"}');
      });
   });
}
