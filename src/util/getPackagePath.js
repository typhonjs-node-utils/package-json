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
 * Attempts to traverse from `filePath` to `basePath` attempting to load `package.json` along with the package path.
 *
 * Note: If malformed data is presented the result will be silently null. Also note that a file may be specified that
 * does not exist and the directory will be resolved. If that directory exists then resolution will continue.
 *
 * @param {string|URL}   filePath - Initial file or directory path to search for `package.json`.
 *
 * @param {string|URL}   [basePath] - Base path to stop traversing. Set to the root path of `filePath` if not provided.
 *
 * @returns {PackageObjData} Loaded package.json / path or potentially an error.
 */
export default function getPackagePath(filePath, basePath = void 0)
{
   if (typeof filePath !== 'string' && !(filePath instanceof URL))
   {
      return { error: new TypeError(`'filePath' is not a 'string' or file 'URL'.`) };
   }

   if (basePath !== void 0 && typeof basePath !== 'string' && !(basePath instanceof URL))
   {
      return { error: new TypeError(`'basePath' is not a 'string' or file 'URL'.`) };
   }

   // packagePath stores the attempted loaded package.json file.
   let packagePath;

   try
   {
      // Convert basePath if an URL to a file path
      if (basePath instanceof URL)
      {
         basePath = url.fileURLToPath(basePath);
      }

      // Convert any URL or string file URL to path.
      if (filePath instanceof URL || filePath.startsWith('file:/'))
      {
         filePath = url.fileURLToPath(filePath);
      }

      // Handle `filePath` as a directory or get directory of path with file name.
      let currentDirectory = fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory() ?
       path.resolve(filePath) : path.resolve(path.dirname(filePath));

      // Convert basePath to root of resolved file path if not a string.
      if (typeof basePath !== 'string')
      {
         basePath = path.parse(currentDirectory).root;
      }

      // Convert string file URL to path.
      if (basePath.startsWith('file:/'))
      {
         basePath = url.fileURLToPath(basePath);
      }

      // Handle `basePath` as a directory or convert a path with file name to a directory.
      const baseDirectory = fs.existsSync(basePath) && fs.lstatSync(basePath).isDirectory() ? path.resolve(basePath) :
       path.resolve(path.dirname(basePath));

      // If the resolved paths do not exist then return null.
      if (!fs.existsSync(baseDirectory) || !fs.existsSync(currentDirectory))
      {
         return { error: new Error(`Could not resolve 'filePath' or 'basePath'`) };
      }

      // Ensure we track the root of the resolved file path to stop recursion.
      const rootPath = path.parse(currentDirectory).root;

      // Below is an iterative loop that stops at any base directory provided or the root directory of the provided
      // file path. `packagePath` stores the load attempt for `package.json` resolved at the current directory as
      // each iteration pops off a subdirectory.

      do
      {
         packagePath = path.resolve(currentDirectory, 'package.json');

         if (fs.existsSync(packagePath))
         {
            return {
               packageObj: JSON.parse(fs.readFileSync(packagePath, 'utf-8')),
               packagePath
            };
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
