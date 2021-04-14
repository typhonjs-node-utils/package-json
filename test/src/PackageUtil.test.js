import { assert }    from 'chai';

import PackageUtil   from '../../src/index.js';

import test          from '../util/test.js';

const s_VERIFY_DATA = (version) => `{"name":"@typhonjs-utils/package-json","version":"${version}","type":"module","description":"Provides several utility methods for working with \`package.json\`.","homepage":"https://github.com/typhonjs-node-utils/package-json","license":"MPL-2.0","repository":{"url":"github:typhonjs-node-utils/package-json"},"bugs":{"email":"support@typhonjs.io","url":"https://github.com/typhonjs-node-utils/package-json/issues"},"formattedMessage":"name: @typhonjs-utils/package-json (${version})\\ndescription: Provides several utility methods for working with \`package.json\`.\\nhomepage: https://github.com/typhonjs-node-utils/package-json\\nrepository: github:typhonjs-node-utils/package-json\\nbugs / issues: https://github.com/typhonjs-node-utils/package-json/issues\\nbugs / email: support@typhonjs.io"}`;

if (test.categories.PackageUtil)
{
   describe('PackageUtil', () =>
   {
      it('getPackage / format:', () =>
      {
         const packageObj = PackageUtil.getPackage({ filepath: import.meta.url });
         const data = PackageUtil.format(packageObj);

         assert.strictEqual(JSON.stringify(data), s_VERIFY_DATA(data.version));
      });

      it('getPackageAndFormat:', () =>
      {
         const data = PackageUtil.getPackageAndFormat({ filepath: import.meta.url });
         assert.strictEqual(JSON.stringify(data), s_VERIFY_DATA(data.version));
      });
   });
}
