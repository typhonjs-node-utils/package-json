import fs   from 'fs';
import path from 'path';
import url  from 'url';

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
export default function getPackagePath({ filepath, basepath = void 0, callback } = {})
{
   if (typeof filepath !== 'string' && !(filepath instanceof URL))
   {
      return { error: new TypeError(`'filepath' is not a 'string' or file 'URL'.`) };
   }

   if (basepath !== void 0 && typeof basepath !== 'string' && !(basepath instanceof URL))
   {
      return { error: new TypeError(`'basepath' is not a 'string' or file 'URL'.`) };
   }

   // packagePath stores the attempted loaded package.json file.
   let packagePath;

   try
   {
      // Convert basepath if an URL to a file path
      if (basepath instanceof URL)
      {
         basepath = url.fileURLToPath(basepath);
      }

      // Convert any URL or string file URL to path.
      if (filepath instanceof URL || filepath.startsWith('file:/'))
      {
         filepath = url.fileURLToPath(filepath);
      }

      // Handle `filepath` as a directory or get directory of path with file name.
      let currentDirectory = fs.existsSync(filepath) && fs.lstatSync(filepath).isDirectory() ?
       path.resolve(filepath) : path.resolve(path.dirname(filepath));

      // Convert basepath to root of resolved file path if not a string.
      if (typeof basepath !== 'string')
      {
         basepath = path.parse(currentDirectory).root;
      }

      // Convert string file URL to path.
      if (basepath.startsWith('file:/'))
      {
         basepath = url.fileURLToPath(basepath);
      }

      // Handle `basepath` as a directory or convert a path with file name to a directory.
      const baseDirectory = fs.existsSync(basepath) && fs.lstatSync(basepath).isDirectory() ? path.resolve(basepath) :
       path.resolve(path.dirname(basepath));

      // If the resolved paths do not exist then return null.
      if (!fs.existsSync(baseDirectory) || !fs.existsSync(currentDirectory))
      {
         return { error: new Error(`Could not resolve 'filepath' or 'basepath'`) };
      }

      // Ensure we track the root of the current directory path to stop iteration.
      const rootPath = path.parse(currentDirectory).root;

      // Below is an iterative loop that stops at any base directory provided or the root directory of the provided
      // file path. `packagePath` stores the load attempt for `package.json` resolved at the current directory as
      // each iteration pops off a subdirectory.

      let cntr = 0;

      do
      {
         packagePath = path.resolve(currentDirectory, 'package.json');

         if (fs.existsSync(packagePath))
         {
            const packageObj = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

            if (typeof callback === 'function')
            {
               if (callback.call({ baseDirectory, cntr, currentDirectory, packageObj, packagePath, rootPath }))
               {
                  return { packageObj, packagePath };
               }
            }
            else
            {
               return { packageObj, packagePath };
            }

            cntr++;
         }

         if (currentDirectory === baseDirectory) { break; }

      } while ((currentDirectory = path.dirname(currentDirectory)) !== rootPath);
   }
   catch (error)
   {
      return { packagePath, error };
   }

   return { error: new Error(`No 'package.json' located`) };
}
