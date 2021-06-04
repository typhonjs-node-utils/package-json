import * as PU from './functions.js';

/**
 * Provides a TyphonJS plugin binding all functions to the eventbus.
 *
 * @param {object}    ev - PluginInvokeEvent with an event proxy for the main eventbus.
 */
export function onPluginLoad(ev)
{
   const eventbus = ev.eventbus;

   const options = ev.pluginOptions;

   let guard = true;

   // Apply any plugin options.
   if (typeof options === 'object')
   {
      /* c8 ignore next 1 */
      if (typeof options.guard === 'boolean') { guard = options.guard; }
   }

   eventbus.on('typhonjs:utils:package:json:format', PU.formatPackage, void 0, { guard });
   eventbus.on('typhonjs:utils:package:json:format:get', PU.getPackageAndFormat, void 0, { guard });
   eventbus.on('typhonjs:utils:package:json:get', PU.getPackage, void 0, { guard });
   eventbus.on('typhonjs:utils:package:json:path:get', PU.getPackageWithPath, void 0, { guard });
   eventbus.on('typhonjs:utils:package:json:type:get', PU.getPackageType, void 0, { guard });
}
