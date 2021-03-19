import { assert }    from 'chai';

import PackageUtil   from '../../src/index.js';

const s_VERIFY_DATA = (version) => `{"name":"@typhonjs-node-utils/package-util","version":"${version}","type":"module","description":"Provides several utility methods for working with \`package.json\`.","author":"typhonrt","homepage":"https://github.com/typhonjs-node-utils/package-util","license":"MPL-2.0","main":"src/index.js","repository":{"type":"github","url":"https://github.com/typhonjs-node-utils/package-util"},"bugs":{"url":"https://github.com/typhonjs-node-utils/package-util/issues"},"formattedMessage":"name: @typhonjs-node-utils/package-util (${version})\\ndescription: Provides several utility methods for working with \`package.json\`.\\nbugs / issues: https://github.com/typhonjs-node-utils/package-util/issues\\nrepository: https://github.com/typhonjs-node-utils/package-util\\nhomepage: https://github.com/typhonjs-node-utils/package-util"}`;

describe('PackageUtil:', () =>
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
