import fs            from 'node:fs';
import path          from 'node:path';

import TraversalData from './TraversalData.js';

/**
 * Get essential info for the given package object consistently formatted.
 *
 * @param {object} packageObj - A loaded `package.json` object.
 *
 * @returns {PackageObjFormatted|undefined} The formatted package object or undefined.
 */
export function formatPackage(packageObj)
{
   // Sanity case to exit early.
   if (typeof packageObj !== 'object') { return void 0; }

   let bugsURL, repository;

   const description = typeof packageObj.description === 'string' ? packageObj.description : '';

   // Parse bugs email.
   const bugsEmail = typeof packageObj.bugs === 'object' ? typeof packageObj.bugs.email === 'string' ?
    packageObj.bugs.email : '' : '';

   // Parse bugs url.
   if (typeof packageObj.bugs === 'object')
   {
      bugsURL = typeof packageObj.bugs.url === 'string' ? packageObj.bugs.url : '';
   }
   else
   {
      bugsURL = typeof packageObj.bugs === 'string' ? packageObj.bugs : '';
   }

   const homepage = typeof packageObj.homepage === 'string' ? packageObj.homepage : '';

   const license = typeof packageObj.license === 'string' ? packageObj.license : '';

   const name = typeof packageObj.name === 'string' ? packageObj.name : '';

   // Parse repository.
   if (typeof packageObj.repository === 'object')
   {
      repository = typeof packageObj.repository.url === 'string' ? packageObj.repository.url : '';
   }
   else
   {
      repository = typeof packageObj.repository === 'string' ? packageObj.repository : '';
   }

   const type = packageObj.type === 'module' ? 'module' : 'commonjs';

   const version = typeof packageObj.version === 'string' ? packageObj.version : '';

   /**
    * Creates the PackageObjFormatted result.
    *
    * @type {PackageObjFormatted}
    */
   const packageData = {
      name,
      version,
      description,
      type,
      homepage,
      license,
      repository,
      bugsURL,
      bugsEmail,
      formattedMessage: ''
   };

   if (name !== '') { packageData.formattedMessage += `name: ${name}${version !== '' ? ` (${version})` : ''}`; }
   if (description !== '') { packageData.formattedMessage += `\ndescription: ${description}`; }
   if (homepage !== '') { packageData.formattedMessage += `\nhomepage: ${homepage}`; }
   if (repository !== '') { packageData.formattedMessage += `\nrepository: ${repository}`; }
   if (bugsURL !== '') { packageData.formattedMessage += `\nbugs / issues: ${bugsURL}`; }
   if (bugsEmail !== '') { packageData.formattedMessage += `\nbugs / email: ${bugsEmail}`; }

   return packageData;
}

/**
 * Attempts to traverse from `filepath` to `basepath` attempting to load `package.json`.
 *
 * Note: If malformed data is presented the result will undefined. Also note that a file may be specified that
 * does not exist and the directory will be resolved. If that directory exists then resolution will continue.
 *
 * @param {PackageQueryOptions} options - The package query options.
 *
 * @returns {object|undefined} Loaded `package.json` or undefined if an error has occurred or basepath or root
 *                             directory has been reached.
 */
export function getPackage(options)
{
   const result = getPackageWithPath(options);

   return typeof result.packageObj === 'object' ? result.packageObj : void 0;
}


/**
 * Attempts to find the nearest package.json via `getPackage` then passes the results to `formatPackage`.
 *
 * @param {PackageQueryOptions} options - The package query options.
 *
 * @returns {PackageObjFormatted|undefined} Formatted package.json or undefined.
 */
export function getPackageAndFormat(options)
{
   return formatPackage(getPackage(options));
}

/**
 * Attempts to traverse from `filepath` to `basepath` attempting to load `package.json` along with the package path.
 *
 * Note: If malformed data is presented the result will undefined along with a possible error included in the returned
 * object / `PackageObjData`. Also note that a file may be specified that does not exist and the directory will be
 * resolved. If that directory exists then resolution will continue.
 *
 * @param {PackageQueryOptions} options - The package query options.
 *
 * @returns {PackageObjData} Loaded package.json / path or potentially an error.
 */
export function getPackageWithPath(options)
{
   const isTraversalData = options instanceof TraversalData;

   if (!isTraversalData && typeof options !== 'object')
   {
      return { error: new TypeError(`'options' is not an object`) };
   }

   const data = !isTraversalData ? new TraversalData() /* c8 ignore next */ : options;

   try
   {
      if (!isTraversalData)
      {
         TraversalData.parse(data, options);
      }

      const context = {};

      do
      {
         data.packagePath = path.resolve(data.currentDir, 'package.json');

         // If there is a `package.json` path attempt to load it.
         if (fs.existsSync(data.packagePath))
         {
            data.packageObj = JSON.parse(fs.readFileSync(data.packagePath, 'utf-8'));

            // If it is a valid object then process it.
            if (typeof data.packageObj === 'object')
            {
               // If there is a provided callback then invoke it with the traversal data with paths converted to
               // Unix style paths. If a truthy value is returned then return the data immediately otherwise
               // the traversal continues.
               if (typeof data.callback === 'function')
               {
                  if (data.callback.call(context, data.toUnixPaths()))
                  {
                     return {
                        packageObj: data.packageObj,
                        filepath: data.packagePath,
                        filepathUnix: TraversalData.toUnixPath(data.packagePath)
                     };
                  }
               }
               else // If there is no callback function then return results with first found `package.json`.
               {
                  return {
                     packageObj: data.packageObj,
                     filepath: data.packagePath,
                     filepathUnix: TraversalData.toUnixPath(data.packagePath)
                  };
               }

               data.cntr++;
            }
         }

         // If the current directory equals the base directory then stop traversal.
         if (data.currentDir === data.baseDir) { break; }

      // If the current directory equals the root path then stop traversal.
      } while ((data.currentDir = path.dirname(data.currentDir)) !== data.rootPath);
   }
   catch (error)
   {
      return { filepath: data.packagePath, filepathUnix: TraversalData.toUnixPath(data.packagePath), error };
   }

   return { error: new Error(`No 'package.json' located`) };
}

/**
 * Attempts to traverse from `filepath` to `basepath` attempting to access `type` field of `package.json`. The type
 * is returned if it is set in the found `package.json` otherwise `commonjs` is returned.
 *
 * Note: With only `filepath` set this function only reliably returns a positive result when there are no
 * intermediary `package.json` files in between a supposed root and path. If provided with malformed
 * data or there is any error / edge case triggered then 'commonjs' by default will be returned.
 *
 * Traversal stops at the first valid `package.json` file as this is how Node works. If the first found `package.json`
 * does not have a `type` field then `commonjs` is returned.
 *
 * @param {PackageQueryOptions} options - The package query options.
 *
 * @returns {string} Type of package - 'module' for ESM otherwise 'commonjs'.
 */
export function getPackageType(options)
{
   const result = getPackageWithPath(options);

   return typeof result.packageObj === 'object' ?
    result.packageObj.type === 'module' ? 'module' : 'commonjs' : 'commonjs';
}

/**
 * The returned data object from a `getPackageWithPath` query.
 *
 * @typedef {object} PackageObjData
 *
 * @property {object|undefined}  [packageObj] - Loaded `package.json` object.
 *
 * @property {string|undefined}  [filepath] - File path of loaded `package.json` object.
 *
 * @property {string|undefined}  [filepathUnix] - File path of loaded `package.json` object as Unix styled path.
 *
 * @property {Error|undefined}   [error] - A potential error instance.
 */

/**
 * The returned data object from formatting a `package.json` object.
 *
 * @typedef {object} PackageObjFormatted
 *
 * @property {string}   name - Name property.
 *
 * @property {string}   version - Version property.
 *
 * @property {string}   type - `module` or `commonjs`.
 *
 * @property {string}   description - Description property.
 *
 * @property {string}   homepage - Homepage property.
 *
 * @property {string}   license - License property.
 *
 * @property {string}   repository - The repository URL or unparsed repository string.
 *
 * @property {string}   bugsURL - URL from bugs property.
 *
 * @property {string}   bugsEmail - Email from bugs property.
 *
 * @property {string}   formattedMessage - A formatted message describing the package.
 */

/**
 * Defines the data object passed to the functions to perform a `package.json` query.
 *
 * @typedef {object} PackageQueryOptions
 *
 * @property {string|URL}  filepath - Initial file or directory path to search for `package.json`.
 *
 * @property {string|URL}  [basepath] - Base path to stop traversing. Set to the root path of `filepath` if not
 *                                      provided.
 *
 * @property {TraversalCallback}  [callback] - A function that evaluates a loaded package.json object and
 *                                                 associated traversal data returning a truthy value to stops or
 *                                                 continue the traversal.
 */

/**
 * An optional callback function for {@link PackageQueryOptions} that evaluates a loaded package.json object and
 * associated traversal data returning a truthy value to stop or continue the traversal.
 *
 * @callback TraversalCallback
 *
 * @param {TraversalDataObj} data - The traversal data object.
 *
 * @returns {boolean} True to stop traversal / false to continue.
 */

/**
 * Defines the data object passed to any traversal callback function. All paths are converted to Unix style paths,
 * so for instance on Windows `\` and `\\` are replaced with `/`.
 *
 * @typedef {object} TraversalDataObj
 *
 * @property {string}   baseDir - Stores the `basepath` directory as a Unix styled path.
 *
 * @property {number}   cntr - Stores the number of times a `package.json` has been processed.
 *
 * @property {string}   currentDir - Current directory of traversal as a Unix styled path.
 *
 * @property {object}   packageObj - Current loaded `package.json` object.
 *
 * @property {string}   filepath - Current loaded `package.json` file path as a Unix styled path.
 *
 * @property {string}   relativeDir - Current directory of traversal as a relative Unix styled path from `process.cwd`.
 *
 * @property {string}   rootPath - The root path to stop traversal as a Unix styled path.
 */
