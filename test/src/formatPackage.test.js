import { assert }          from 'chai';

import { formatPackage }   from '../../src/index.js';
import { getPackage }      from '../../src/index.js';

import test                from '../util/test.js';

const s_VERIFY_DATA = (version) => `{"name":"@typhonjs-node-utils/package-util","version":"${version}","type":"module","description":"Provides several utility methods for working with \`package.json\`.","author":"typhonrt","homepage":"https://github.com/typhonjs-node-utils/package-util","license":"MPL-2.0","main":"src/index.js","repository":{"type":"github","url":"https://github.com/typhonjs-node-utils/package-util"},"bugs":{"url":"https://github.com/typhonjs-node-utils/package-util/issues"},"formattedMessage":"name: @typhonjs-node-utils/package-util (${version})\\ndescription: Provides several utility methods for working with \`package.json\`.\\nbugs / issues: https://github.com/typhonjs-node-utils/package-util/issues\\nrepository: https://github.com/typhonjs-node-utils/package-util\\nhomepage: https://github.com/typhonjs-node-utils/package-util"}`;

if (test.categories.formatPackage)
{
   describe('formatPackage', () =>
   {
      it('getPackage / format:', () =>
      {
         const packageObj = getPackage({ filepath: import.meta.url });
         const data = formatPackage(packageObj);

         assert.strictEqual(JSON.stringify(data), s_VERIFY_DATA(data.version));
      });
   });
}
