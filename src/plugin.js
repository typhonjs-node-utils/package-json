import * as PU from './functions.js';

/**
 * Provides a TyphonJS plugin binding all functions to the eventbus.
 *
 * @param {object}    ev - PluginInvokeEvent with an event proxy for the main eventbus.
 */
export function onPluginLoad(ev)
{
   const eventbus = ev.eventbus;

   const options = { guard: true, type: 'sync' };

   eventbus.on('typhonjs:utils:package:json:format', PU.formatPackage, void 0, options);
   eventbus.on('typhonjs:utils:package:json:format:get', PU.getPackageAndFormat, void 0, options);
   eventbus.on('typhonjs:utils:package:json:get', PU.getPackage, void 0, options);
   eventbus.on('typhonjs:utils:package:json:path:get', PU.getPackageWithPath, void 0, options);
   eventbus.on('typhonjs:utils:package:json:type:get', PU.getPackageType, void 0, options);
}
