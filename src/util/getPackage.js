import getPackagePath   from './getPackagePath.js';

/**
 * Attempts to traverse from `filePath` to `basePath` attempting to load `package.json`.
 *
 * Note: If malformed data is presented the result will be silently null. Also note that a file may be specified that
 * does not exist and the directory will be resolved. If that directory exists then resolution will continue.
 *
 * @param {string|URL}   filePath - Initial file or directory path to search for `package.json`.
 *
 * @param {string|URL}   [basePath] - Base path to stop traversing. Set to the root path of `filePath` if not provided.
 *
 * @returns {object|undefined} Loaded `package.json` or undefined if an error has occurred or basePath or root
 *                             directory has been reached.
 */
export default function getPackage(filePath, basePath = void 0)
{
   const result = getPackagePath(filePath, basePath);

   return typeof result.packageObj === 'object' ? result.packageObj : void 0;
}
