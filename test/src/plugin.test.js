import path                from 'path';

import { assert }          from 'chai';

import PluginManager       from '@typhonjs-plugin/manager';

import test                from '../util/test.js';

const isNode12_0_0 =  process.version === 'v12.0.0';

// PluginManager requires Node 12.2+
if (test.plugin && !isNode12_0_0)
{
   describe(`PluginManager`, () =>
   {
      it('plugin / getPackagePath', async () =>
      {
         const pluginManager = new PluginManager();
         const eventbus = pluginManager.getEventbus();

         await pluginManager.add({ name: '@typhonjs-utils/package-json', target: './src/plugin.js' });

         const data = eventbus.triggerSync('typhonjs:utils:package:json:path:get', { filepath: import.meta.url });

         assert.strictEqual(data.packageObj.name, '@typhonjs-utils/package-json');
         assert.strictEqual(data.packagePath, `${path.resolve('.')}${path.sep}package.json`);
      });
   });
}
