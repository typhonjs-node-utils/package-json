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
 * @property {string}   author -
 * @property {string}   homepage -
 * @property {string}   license -
 * @property {string}   main -
 * @property {{type: string, url: string}}   repository -
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
    * Note: If malformed data is presented the result will be silently null. Also note that a file may be specified that
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
    * Note: If malformed data is presented the result will be silently null. Also note that a file may be specified that
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
    * Note: If malformed data is presented the result will be silently null. Also note that a file may be specified that
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
    * Note: This only reliably returns a positive result. If provided with malformed data or there is any error / edge
    * case triggered then 'commonjs' by default will be returned.
    *
    * Another edge case is that traversal stops at the first valid `package.json` file and this may not contain a `type`
    * property whereas a `package.json` file in the root of the module may define it.
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
   static format(packageObj = {})
   {
      let bugsURL, repoURL, scmType;

      // Sanity case to create empty object.
      if (typeof packageObj !== 'object')
      {
         packageObj = {};
      }

      // Parse repository URL.
      if (packageObj.repository)
      {
         repoURL = s_PARSE_URL(packageObj.repository.url ? packageObj.repository.url : packageObj.repository);
         scmType = s_PARSE_URL_SCM_TYPE(repoURL);
      }

      // Parse bugs URL.
      if (packageObj.bugs)
      {
         bugsURL = s_PARSE_URL(packageObj.bugs.url ? packageObj.bugs.url : packageObj.bugs);
      }

      /**
       * Creates NPMPackageData result.
       *
       * @type {NPMPackageData}
       */
      const packageData =
      {
         name: packageObj.name,
         version: packageObj.version,
         type: packageObj.type === 'module' ? 'module' : 'commonjs',
         description: packageObj.description,
         author: packageObj.author,
         homepage: packageObj.homepage,
         license: packageObj.license,
         main: packageObj.main,
         repository: { type: scmType, url: repoURL },
         bugs: { url: bugsURL }
      };

      let formattedMessage = '';

      if (packageData.name)
      {
         formattedMessage += `name: ${packageData.name}${packageData.version ? ` (${packageData.version})` : ''}`;
      }

      if (packageData.description) { formattedMessage += `\ndescription: ${packageData.description}`; }
      if (packageData.bugs.url) { formattedMessage += `\nbugs / issues: ${packageData.bugs.url}`; }
      if (packageData.repository.url) { formattedMessage += `\nrepository: ${packageData.repository.url}`; }
      if (packageData.homepage) { formattedMessage += `\nhomepage: ${packageData.homepage}`; }

      packageData.formattedMessage = formattedMessage;

      // Index info.

      return packageData;
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

   eventbus.on('typhonjs:util:package:get', PackageUtil.getPackage, PackageUtil);
   eventbus.on('typhonjs:util:package:object:format:get', PackageUtil.getPackageAndFormat, PackageUtil);
   eventbus.on('typhonjs:util:package:path:get', PackageUtil.getPackagePath, PackageUtil);
   eventbus.on('typhonjs:util:package:type:get', PackageUtil.getPackageType, PackageUtil);
   eventbus.on('typhonjs:util:package:object:format', PackageUtil.format, PackageUtil);
}

// Module private ---------------------------------------------------------------------------------------------------

/**
 * Parses an URL for SCM link.
 *
 * @param {string}   parseURL - URL to parse.
 *
 * @returns {string} Parsed URL or empty string
 * @ignore
 */
const s_PARSE_URL = (parseURL) =>
{
   let url = null;

   if (typeof parseURL === 'string')
   {
      // Attempt to resolve public Github URL.
      url = s_PARSE_URL_GITHUB(parseURL);

      // Attempt to resolve public Gitlab URL.
      if (url === null) { url = s_PARSE_URL_GITLAB(parseURL); }

      // Didn't resolve a public github or gitlab URL so set to original.
      if (url === null) { url = parseURL; }
   }

   return url === null ? '' : url;
};

const s_PARSE_URL_GITHUB = (parseURL) =>
{
   let url = null;

   if (parseURL.indexOf('git@github.com:') === 0)
   {
      // url: git@github.com:foo/bar.git
      const matched = parseURL.match(/^git@github\.com:(.*)\.git$/);

      if (matched && matched[1])
      {
         url = `https://github.com/${matched[1]}`;
      }
   }
   else if (parseURL.match(/^[\w\d\-_]+\/[\w\d\-_]+$/))
   {
      // url: foo/bar
      url = `https://github.com/${parseURL}`;
   }
   else if (parseURL.match(/^git\+https:\/\/github.com\/.*\.git$/))
   {
      // git+https://github.com/foo/bar.git
      const matched = parseURL.match(/^git\+(https:\/\/github.com\/.*)\.git$/);

      url = matched[1];
   }
   else if (parseURL.match(/(https?:\/\/.*$)/))
   {
      // other url
      const matched = parseURL.match(/(https?:\/\/.*$)/);

      url = matched[1];
   }

   return url;
};

const s_PARSE_URL_GITLAB = (parseURL) =>
{
   let url = null;

   if (parseURL.indexOf('git@gitlab.com:') === 0)
   {
      // url: git@github.com:foo/bar.git
      const matched = parseURL.match(/^git@gitlab\.com:(.*)\.git$/);

      if (matched && matched[1])
      {
         url = `https://gitlab.com/${matched[1]}`;
      }
   }
   else if (parseURL.match(/^[\w\d\-_]+\/[\w\d\-_]+$/))
   {
      // url: foo/bar
      url = `https://gitlab.com/${parseURL}`;
   }
   else if (parseURL.match(/^git\+https:\/\/gitlab.com\/.*\.git$/))
   {
      // git+https://gitlab.com/foo/bar.git
      const matched = parseURL.match(/^git\+(https:\/\/gitlab.com\/.*)\.git$/);

      url = matched[1];
   }
   else if (parseURL.match(/(https?:\/\/.*$)/))
   {
      // other url
      const matched = parseURL.match(/(https?:\/\/.*$)/);

      url = matched[1];
   }

   return url;
};

/**
 * Parses an URL to determine SCM type; public Github / Gitlab supported.
 *
 * @param {string}   scmURL - URL to parse.
 *
 * @returns {string|undefined} SCM type
 * @ignore
 */
const s_PARSE_URL_SCM_TYPE = (scmURL) =>
{
   let scmType = 'unknown';

   if (scmURL.match(new RegExp('^https?://github.com/')))
   {
      scmType = 'github';
   }
   else if (scmURL.match(new RegExp('^https?://gitlab.com/')))
   {
      scmType = 'gitlab';
   }

   return scmType;
};
