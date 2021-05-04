import { assert }                from 'chai';

import { getPackageAndFormat }   from '../../../src/functions.js';

import test                      from '../../util/test.js';

const s_VERIFY_DATA = (version) => `{"name":"@typhonjs-utils/package-json","version":"${version}","type":"module","description":"Provides several utility functions for working with and retrieving \`package.json\`.","homepage":"https://github.com/typhonjs-node-utils/package-json","license":"MPL-2.0","repository":{"url":"github:typhonjs-node-utils/package-json"},"bugs":{"email":"support@typhonjs.io","url":"https://github.com/typhonjs-node-utils/package-json/issues"},"formattedMessage":"name: @typhonjs-utils/package-json (${version})\\ndescription: Provides several utility functions for working with and retrieving \`package.json\`.\\nhomepage: https://github.com/typhonjs-node-utils/package-json\\nrepository: github:typhonjs-node-utils/package-json\\nbugs / issues: https://github.com/typhonjs-node-utils/package-json/issues\\nbugs / email: support@typhonjs.io"}`;

if (test.getPackageAndFormat)
{
   describe('getPackageAndFormat', () =>
   {
      it('module package.json:', () =>
      {
         const data = getPackageAndFormat({ filepath: import.meta.url });

         assert.strictEqual(JSON.stringify(data), s_VERIFY_DATA(data.version));
      });
   });
}
