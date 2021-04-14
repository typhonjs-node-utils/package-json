import formatPackage    from '../util/formatPackage.js';
import getPackage       from '../util/getPackage.js';
import getPackagePath   from '../util/getPackagePath.js';
import getPackageType   from '../util/getPackageType.js';

/**
 * @typedef {object} PackageObjData
 *
 * @property {object|undefined}  packageObj - Loaded `package.json` object.
 * @property {string|undefined}  packagePath - Path of loaded `package.json` object.
 * @property {Error|undefined}   error - An error instance.
 */

/**
 * @typedef {object} NPMPackageData
 *
 * @property {string}   name -
 * @property {string}   version -
 * @property {string}   type -
 * @property {string}   description -
 * @property {string}   homepage -
 * @property {string}   license -
 * @property {{url: string}}   repository -
 * @property {{url: string}}   bugs -
 * @property {string}   formattedMessage -
 */

/**
 * Provides several utility methods for working with `package.json`.
 */
export default class PackageUtil
{
   /**
    * Attempts to traverse from `filepath` to `basepath` attempting to load `package.json`.
    *
    * Note: If malformed data is presented the result will undefined. Also note that a file may be specified that
    * does not exist and the directory will be resolved. If that directory exists then resolution will continue.
    *
    * @param {object}      options - An object.
    *
    * @param {string|URL}  options.filepath - Initial file or directory path to search for `package.json`.
    *
    * @param {string|URL}  [options.basepath] - Base path to stop traversing. Set to the root path of `filepath` if not
    *                                           provided.
    *
    * @param {Function}    [options.callback] - A function that evaluates any loaded package.json object that passes
    *                                           back a truthy value that stops or continues the traversal.
    *
    * @returns {object|undefined} Loaded `package.json` or undefined if an error has occurred or basepath or root
    *                             directory has been reached.
    */
   static getPackage(options)
   {
      return getPackage(options);
   }

   /**
    * Attempts to find the nearest package.json via `getPackage` then passes the results to `PackageUtil.format`.
    *
    * Note: If malformed data is presented the result will undefined. Also note that a file may be specified that
    * does not exist and the directory will be resolved. If that directory exists then resolution will continue.
    *
    * @param {object}      options - An object.
    *
    * @param {string|URL}  options.filepath - Initial file or directory path to search for `package.json`.
    *
    * @param {string|URL}  [options.basepath] - Base path to stop traversing. Set to the root path of `filepath` if not
    *                                           provided.
    *
    * @param {Function}    [options.callback] - A function that evaluates any loaded package.json object that passes
    *                                           back a truthy value that stops or continues the traversal.
    *
    * @returns {object} Formatted package.json or empty object if an error has occurred.
    */
   static getPackageAndFormat(options)
   {
      return PackageUtil.format(getPackage(options));
   }

   /**
    * Attempts to traverse from `filepath` to `basepath` attempting to load `package.json` along with the package path.
    *
    * Note: If malformed data is presented the result will undefined along with a possible error included in the
    * returned object / `PackageObjData`. Also note that a file may be specified that does not exist and the
    * directory will be resolved. If that directory exists then resolution will continue.
    *
    * @param {object}      options - An object.
    *
    * @param {string|URL}  options.filepath - Initial file or directory path to search for `package.json`.
    *
    * @param {string|URL}  [options.basepath] - Base path to stop traversing. Set to the root path of `filepath` if not
    *                                           provided.
    *
    * @param {Function}    [options.callback] - A function that evaluates any loaded package.json object that passes
    *                                           back a truthy value that stops or continues the traversal.
    *
    * @returns {PackageObjData} Loaded package.json / path or potentially an error.
    */
   static getPackagePath(options)
   {
      return getPackagePath(options);
   }

   /**
    * Attempts to traverse from `filepath` to `basepath` attempting to access `type` field of `package.json`. The type
    * is returned if it is set in the found `package.json` otherwise `commonjs` is returned.
    *
    * Note: With only `filepath` set this function only reliably returns a positive result when there are no
    * intermediary `package.json` files in between a supposed root and path. If provided with malformed
    * data or there is any error / edge case triggered then 'commonjs' by default will be returned.
    *
    * Another edge case is that traversal stops at the first valid `package.json` file and this may not contain a `type`
    * property whereas a `package.json` file in the root of the module may define it.
    *
    * However if you provide a `filepath` and a `basepath` that is a parent path giving a firm stopping point then a
    * proper resolution callback, `s_RESOLVE_TYPE`, is automatically added. Intermediary `package.json` files that
    * do not have an explicit `type` attribute set do not prevent traversal which continues until the `basepath` is
    * reached which is how Node.js actually resolves the `type` attribute.
    *
    * @param {object}      options - An object.
    *
    * @param {string|URL}  options.filepath - Initial file or directory path to search for `package.json`.
    *
    * @param {string|URL}  [options.basepath] - Base path to stop traversing. Set to the root path of `filepath` if not
    *                                           provided.
    *
    * @param {Function}    [options.callback] - A function that evaluates any loaded package.json object that passes
    *                                           back a truthy value that stops or continues the traversal.
    *
    * @returns {string} Type of package - 'module' for ESM otherwise 'commonjs'.
    */
   static getPackageType(options)
   {
      return getPackageType(options);
   }

   /**
    * Get essential info for the given package object consistently formatted.
    *
    * @param {object} packageObj - A loaded `package.json` object.
    *
    * @returns {NPMPackageData} The formatted package object.
    */
   static format(packageObj)
   {
      return formatPackage(packageObj);
   }
}

/**
 * Creates several general utility methods bound to the eventbus.
 *
 * @param {object}    ev - PluginEvent with an event proxy for the main eventbus.
 */
export function onPluginLoad(ev)
{
   const eventbus = ev.eventbus;

   eventbus.on('typhonjs:utils:package:json:get', PackageUtil.getPackage, PackageUtil);
   eventbus.on('typhonjs:utils:package:json:format:get', PackageUtil.getPackageAndFormat, PackageUtil);
   eventbus.on('typhonjs:utils:package:json:path:get', PackageUtil.getPackagePath, PackageUtil);
   eventbus.on('typhonjs:utils:package:json:type:get', PackageUtil.getPackageType, PackageUtil);
   eventbus.on('typhonjs:utils:package:json:format', PackageUtil.format, PackageUtil);
}
