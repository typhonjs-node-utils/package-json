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
 * @typedef {object} TraversalData
 *
 * @property {string}   baseDirectory - Stores any base directory defined or the root path.
 * @property {number}   cntr - Stores the number of times a package is processed; useful in callbacks.
 * @property {string}   currentDirectory - Current directory of traversal.
 * @property {object}   packageObj -  Current loaded `package.json` object.
 * @property {string}   packagePath - Path of current loaded `package.json` object.
 * @property {string}   rootPath - The root path to stop traversal; determined from starting directory path.
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
      return { error: new TypeError(`'filepath' is not a 'string' or file 'URL'`) };
   }

   if (basepath !== void 0 && typeof basepath !== 'string' && !(basepath instanceof URL))
   {
      return { error: new TypeError(`'basepath' is not a 'string' or file 'URL'`) };
   }

   if (callback !== void 0 && typeof callback !== 'function')
   {
      return { error: new TypeError(`'callback' is not a 'function'`) };
   }

   /**
    * Stores the data tracked over traversing the starting directory.
    *
    * @type {TraversalData}
    */
   const data = {
      baseDirectory: void 0,     // Stores any base directory defined or the root path
      cntr: 0,                   // Stores the number of times a package is processed; useful in callbacks.
      currentDirectory: void 0,  // Current directory of traversal
      packageObj: void 0,        // Current loaded `package.json` object.
      packagePath: void 0,       // Path of current loaded `package.json` object
      rootPath: void 0           // The root path to stop traversal; determined from starting directory path.
   };

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
      data.currentDirectory = fs.existsSync(filepath) && fs.lstatSync(filepath).isDirectory() ?
       path.resolve(filepath) : path.resolve(path.dirname(filepath));

      // Convert basepath to root of resolved file path if not a string.
      if (typeof basepath !== 'string')
      {
         basepath = path.parse(data.currentDirectory).root;
      }

      // Convert string file URL to path.
      if (basepath.startsWith('file:/'))
      {
         basepath = url.fileURLToPath(basepath);
      }

      // Handle `basepath` as a directory or convert a path with file name to a directory.
      data.baseDirectory = fs.existsSync(basepath) && fs.lstatSync(basepath).isDirectory() ? path.resolve(basepath) :
       path.resolve(path.dirname(basepath));

      // If the resolved paths do not exist then return null.
      if (!fs.existsSync(data.baseDirectory) || !fs.existsSync(data.currentDirectory))
      {
         return { error: new Error(`Could not resolve 'filepath' or 'basepath'`) };
      }

      // Ensure we track the root of the current directory path to stop iteration.
      data.rootPath = path.parse(data.currentDirectory).root;

      // Below is an iterative loop that stops at any base directory provided or the root directory of the provided
      // file path. `packagePath` stores the load attempt for `package.json` resolved at the current directory as
      // each iteration pops off a subdirectory.

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
               if (typeof callback === 'function')
               {
                  if (callback.call(context, data))
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

         // If the current directory equals the base directory then stop the traversal.
         if (data.currentDirectory === data.baseDirectory) { break; }

      // If the current directory equals the root path then stop the traversal.
      } while ((data.currentDirectory = path.dirname(data.currentDirectory)) !== data.rootPath);
   }
   catch (error)
   {
      return { packagePath: data.packagePath, error };
   }

   return { error: new Error(`No 'package.json' located`) };
}
