import fs            from 'fs';
import path          from 'path';

import TraversalData from './TraversalData.js';

/**
 * Get essential info for the given package object consistently formatted.
 *
 * @param {object} packageObj - A loaded `package.json` object.
 *
 * @returns {PackageObjFormatted} The formatted package object.
 */
export function formatPackage(packageObj = {})
{
   let bugsEmail, bugsURL, repoURL;

   // Sanity case to create empty object.
   if (typeof packageObj !== 'object')
   {
      packageObj = {};
   }

   // Parse bugs email.
   if (packageObj.bugs)
   {
      bugsEmail = packageObj.bugs.email ? packageObj.bugs.email : void 0;

      if (typeof bugsEmail !== 'string') { bugsEmail = void 0; }
   }

   // Parse bugs URL.
   if (packageObj.bugs)
   {
      bugsURL = packageObj.bugs.url ? packageObj.bugs.url : packageObj.bugs;

      if (typeof bugsURL !== 'string') { bugsURL = void 0; }
   }

   // Parse repository URL.
   if (packageObj.repository)
   {
      repoURL = packageObj.repository.url ? packageObj.repository.url : packageObj.repository;

      if (typeof repoURL !== 'string') { repoURL = void 0; }
   }

   /**
    * Creates the PackageObjFormatted result.
    *
    * @type {PackageObjFormatted}
    */
   const packageData = {
      name: packageObj.name,
      version: packageObj.version,
      type: packageObj.type === 'module' ? 'module' : 'commonjs',
      description: packageObj.description,
      homepage: packageObj.homepage,
      license: packageObj.license,
      repository: { url: repoURL },
      bugs: { email: bugsEmail, url: bugsURL }
   };

   let formattedMessage = '';

   if (packageData.name)
   {
      formattedMessage += `name: ${packageData.name}${packageData.version ? ` (${packageData.version})` : ''}`;
   }

   if (packageData.description) { formattedMessage += `\ndescription: ${packageData.description}`; }
   if (packageData.homepage) { formattedMessage += `\nhomepage: ${packageData.homepage}`; }
   if (packageData.repository.url) { formattedMessage += `\nrepository: ${packageData.repository.url}`; }
   if (packageData.bugs.url) { formattedMessage += `\nbugs / issues: ${packageData.bugs.url}`; }
   if (packageData.bugs.email) { formattedMessage += `\nbugs / email: ${packageData.bugs.email}`; }

   packageData.formattedMessage = formattedMessage;

   return packageData;
}

/**
 * Attempts to traverse from `filepath` to `basepath` attempting to load `package.json`.
 *
 * Note: If malformed data is presented the result will undefined. Also note that a file may be specified that
 * does not exist and the directory will be resolved. If that directory exists then resolution will continue.
 *
 * @param {PackageOptions} options - The package options.
 *
 * @returns {object|undefined} Loaded `package.json` or undefined if an error has occurred or basepath or root
 *                             directory has been reached.
 */
export function getPackage(options)
{
   const result = getPackagePath(options);

   return typeof result.packageObj === 'object' ? result.packageObj : void 0;
}


/**
 * Attempts to find the nearest package.json via `getPackage` then passes the results to `formatPackage`.
 *
 * Note: If malformed data is presented the result will undefined. Also note that a file may be specified that
 * does not exist and the directory will be resolved. If that directory exists then resolution will continue.
 *
 * @param {PackageOptions} options - The package options.
 *
 * @returns {object} Formatted package.json or empty object if an error has occurred.
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
 * @param {PackageOptions} options - The package options.
 *
 * @returns {PackageObjData} Loaded package.json / path or potentially an error.
 */
export function getPackagePath(options)
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
         data.packagePath = path.resolve(data.currentDirectory, 'package.json');

         // If there is a `package.json` path attempt to load it.
         if (fs.existsSync(data.packagePath))
         {
            data.packageObj = JSON.parse(fs.readFileSync(data.packagePath, 'utf-8'));

            // If it is a valid object then process it.
            if (typeof data.packageObj === 'object')
            {
               // If there is a provided callback then invoke it with the traversal data and if a truthy value is
               // returned then return the data; otherwise immediately return the loaded `package.json` object & path.
               if (typeof data._callback === 'function')
               {
                  if (data._callback.call(context, data))
                  {
                     return { packageObj: data.packageObj, packagePath: data.packagePath };
                  }
               }
               else
               {
                  return { packageObj: data.packageObj, packagePath: data.packagePath };
               }

               data.cntr++;
            }
         }

         // If the current directory equals the base directory then stop traversal.
         if (data.currentDirectory === data.baseDirectory) { break; }

      // If the current directory equals the root path then stop traversal.
      } while ((data.currentDirectory = path.dirname(data.currentDirectory)) !== data.rootPath);
   }
   catch (error)
   {
      return { packagePath: data.packagePath, error };
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
 * @param {PackageOptions} options - The package options.
 *
 * @returns {string} Type of package - 'module' for ESM otherwise 'commonjs'.
 */
export function getPackageType(options)
{
   const result = getPackagePath(options);

   return typeof result.packageObj === 'object' ?
    result.packageObj.type === 'module' ? 'module' : 'commonjs' : 'commonjs';
}
