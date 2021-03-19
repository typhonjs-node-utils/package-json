import getPackagePath   from './getPackagePath.js';

/**
 * Attempts to traverse from `filepath` to `basepath` attempting to load `package.json`.
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
 * @returns {object|undefined} Loaded `package.json` or undefined if an error has occurred or basepath or root
 *                             directory has been reached.
 */
export default function getPackage(options)
{
   const result = getPackagePath(options);

   return typeof result.packageObj === 'object' ? result.packageObj : void 0;
}
