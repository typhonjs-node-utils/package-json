import fs   from 'fs';
import path from 'path';
import url  from 'url';

const resultsCache = new Map();

/**
 * Attempt to load `package.json` at `directory`.
 *
 * @param {string}   directory - Current directory to find `package.json`.
 *
 * @param {string}   basePath - Base path to stop traversing.
 *
 * @param {string}   rootPath - The absolute root path to stop traversing.
 *
 * @returns {object|null} Loaded directory or null if basePath has been reached. Recursive call.
 */
function getDirectoryActual(directory, basePath, rootPath)
{
   const packagePath = path.resolve(directory, 'package.json');

   if (fs.existsSync(packagePath))
   {
      try
      {
         return {
            packageObj: JSON.parse(fs.readFileSync(packagePath, 'utf-8')),
            path: packagePath
         };
      }
      catch (_)
      {
         // Return null if failed to load `package.json`; assume it is malformed and stop resolution.
         return null;
      }
   }

   if (directory === basePath || directory === rootPath) { return null; }

   const parent = path.dirname(directory);

   return getDirectory(parent, basePath, rootPath);
}

/**
 * Attempt to load from cache or invoke `getDirectoryActual`.
 *
 * @param {string}   directory - Current directory to find `package.json`.
 *
 * @param {string}   basePath - Base path to stop traversing.
 *
 * @param {string}   rootPath - The absolute root path to stop traversing.
 *
 * @returns {{package: object, path: string}|null} Loaded package.json or null.
 */
function getDirectory(directory, basePath, rootPath)
{
   const key = `${directory}:${basePath}`;

   if (resultsCache.has(key)) { return resultsCache.get(key); }

   const result = getDirectoryActual(directory, basePath, rootPath);

   resultsCache.set(key, result);

   return result;
}

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
 * @returns {{package: object, path: string}|null} Loaded package.json and path or null if basePath or root
 * directory has been reached.
 */
function getPackagePath(filePath, basePath = void 0)
{
   let resolvedBasePath, resolvedFilePath, rootFilePath;

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

      // Handle `filePath` as a directory or path with file name.
      resolvedFilePath = fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory() ?
       path.resolve(filePath) : path.resolve(path.dirname(filePath));

      // Convert basePath to root of resolved file path if not a string.
      if (typeof basePath !== 'string')
      {
         basePath = path.parse(resolvedFilePath).root;
      }

      // Convert string file URL to path.
      if (basePath.startsWith('file:/'))
      {
         basePath = url.fileURLToPath(basePath);
      }

      // Handle `basePath` as a directory or path with file name.
      resolvedBasePath = fs.existsSync(basePath) && fs.lstatSync(basePath).isDirectory() ? path.resolve(basePath) :
       path.resolve(path.dirname(basePath));

      // If the resolved paths do not exist then return null.
      if (!fs.existsSync(resolvedBasePath) || !fs.existsSync(resolvedFilePath))
      {
         return null;
      }

      // Ensure we track the root of the resolved file path to stop recursion.
      rootFilePath = path.parse(resolvedFilePath).root;
   }
   catch (err)
   {
      return null;
   }

   return getDirectory(resolvedFilePath, resolvedBasePath, rootFilePath);
}

getPackagePath.clearCache = () => resultsCache.clear();

export default getPackagePath;
