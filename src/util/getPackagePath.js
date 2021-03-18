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
 * @returns {object|null} Loaded directory or null if basePath has been reached. Recursive call.
 */
function getDirectoryActual(directory, basePath)
{
   try
   {
      const packagePath = path.resolve(directory, 'package.json');

      if (fs.existsSync(packagePath))
      {
         return packagePath;
      }
   }
   catch (_) { /**/ }

   if (directory === basePath || directory === path.sep) { return null; }

   const parent = path.dirname(directory);

   return getDirectory(parent, basePath);
}

/**
 * Attempt to load from cache or invoke `getDirectoryActual`.
 *
 * @param {string}   directory - Current directory to find `package.json`.
 *
 * @param {string}   basePath - Base path to stop traversing.
 *
 * @returns {object|null} Loaded package.json or null.
 */
function getDirectory(directory, basePath)
{
   const key = `${directory}:${basePath}`;

   if (resultsCache.has(key)) { return resultsCache.get(key); }

   const result = getDirectoryActual(directory, basePath);

   resultsCache.set(key, result);

   return result;
}

/**
 * Attempts to traverse from `filePath` to `basePath` attempting to load `package.json`.
 *
 * @param {string}   filePath - Initial file or directory path to search for `package.json`.
 *
 * @param {string}   basePath - Base path to stop traversing.
 *
 * @returns {object|null} Loaded package.json or null.
 */
export default function getPackagePath(filePath, basePath = process.cwd())
{
   // Convert file URL to path
   if (filePath.startsWith('file:/'))
   {
      filePath = url.fileURLToPath(filePath);
   }

   // Convert file URL to path
   if (basePath.startsWith('file:/'))
   {
      basePath = url.fileURLToPath(basePath);
   }

   const resolvedFilePath = fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory() ? path.resolve(filePath) :
    path.resolve(path.dirname(filePath));

   const resolvedBasePath = fs.existsSync(basePath) && fs.lstatSync(basePath).isDirectory() ? path.resolve(basePath) :
    path.resolve(path.dirname(basePath));

   return getDirectory(resolvedFilePath, resolvedBasePath);
}
