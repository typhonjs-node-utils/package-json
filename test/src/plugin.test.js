import path                from 'node:path';

import { assert }          from 'chai';

import { PluginManager }   from '@typhonjs-plugin/manager';

import TraversalData       from '../../src/TraversalData.js';
import test                from '../util/test.js';

// PluginManager requires Node 12.2+ so it is separated from the functions tests.
if (test.plugin)
{
   describe(`PluginManager:`, () =>
   {
      it('plugin / getPackagePath', async () =>
      {
         const pluginManager = new PluginManager();
         const eventbus = pluginManager.getEventbus();

         await pluginManager.add({ name: '@typhonjs-utils/package-json', target: './src/plugin.js' });

         const data = eventbus.triggerSync('typhonjs:utils:package:json:path:get', { filepath: import.meta.url });

         const filepath = `${path.resolve('.')}${path.sep}package.json`;

         assert.strictEqual(data.packageObj.name, '@typhonjs-utils/package-json');
         assert.strictEqual(data.filepath, filepath);
         assert.strictEqual(data.filepathUnix, TraversalData.toUnixPath(filepath));
      });
   });
}
