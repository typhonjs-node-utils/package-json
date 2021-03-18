import getPackage       from '../util/getPackage.js';
import getPackagePath   from '../util/getPackagePath.js';

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
 * @property {object}   repository -
 * @property {object}   bugs -
 * @property {string}   formattedMessage -
 */

/**
 * @typedef {object} NPMPackageObject
 * @see https://docs.npmjs.com/files/package.json
 */

/**
 * Provides several utility methods for working with `package.json`.
 */
export default class PackageUtil
{
   static getPackage(filePath, basePath)
   {
      return getPackage(filePath, basePath);
   }

   static getPackagePath(filePath, basePath)
   {
      return getPackagePath(filePath, basePath);
   }

   /**
    * Get essential info for the given package object consistently formatted.
    *
    * @param {NPMPackageObject} packageObj - A loaded `package.json` object.
    *
    * @returns {NPMPackageData} The formatted package object.
    */
   static format(packageObj = {})
   {
      let bugsURL, repoURL, scmType;

      // Sanity case to create empty object.
      if (packageObj === null || typeof packageObj === 'undefined')
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
 * @param {PluginEvent}    ev - An event proxy for the main eventbus.
 */
export function onPluginLoad(ev)
{
   const eventbus = ev.eventbus;

   eventbus.on('typhonjs:util:package:get', PackageUtil.getPackage, PackageUtil);
   eventbus.on('typhonjs:util:package:path:get', PackageUtil.getPackagePath, PackageUtil);
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
      url = s_PARSE_URL_GITHUB(parseURL);

      if (url === null) { url = s_PARSE_URL_GITLAB(parseURL); }
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
 * Parses an URL to determine SCM type; Github / Gitlab supported.
 *
 * @param {string}   scmURL - URL to parse.
 *
 * @returns {string|undefined} SCM type
 * @ignore
 */
const s_PARSE_URL_SCM_TYPE = (scmURL) =>
{
   let scmType;

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
