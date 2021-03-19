import fs            from 'fs';
import path          from 'path';

import TraversalData from './TraversalData.js';

/**
 * @typedef {object} PackageObjData
 *
 * @property {object|undefined}  packageObj - Loaded `package.json` object.
 * @property {string|undefined}  packagePath - Path of loaded `package.json` object.
 * @property {Error|undefined}   error - An error instance.
 */

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
 * @param {Function}    [options.callback] - A function that evaluates any loaded package.json object that passes back a
 *                                           truthy value that stops or continues the traversal.
 *
 * @returns {PackageObjData} Loaded package.json / path or potentially an error.
 */
export default function getPackagePath(options)
{
   const data = options instanceof TraversalData ? options : new TraversalData();

   try
   {
      if (!(options instanceof TraversalData))
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
