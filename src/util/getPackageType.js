import getPackagePath   from './getPackagePath.js';

/**
 * Attempts to traverse from `filepath` to `basepath` attempting to access `type` field of `package.json`. The type
 * is returned if it is set in the found `package.json` otherwise `commonjs` is returned.
 *
 * Note: This only reliably returns a positive result. If provided with malformed data or there is any error / edge case
 * triggered then 'commonjs' by default will be returned.
 *
 * Another edge case is that traversal stops at the first valid `package.json` file and this may not contain a `type`
 * property whereas a `package.json` file in the root of the module may define it.
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
 * @returns {string} Type of package - 'module' for ESM otherwise 'commonjs'.
 */
export default function getPackageType(options)
{
   const result = getPackagePath(options);

   return typeof result.packageObj === 'object' ?
    result.packageObj.type === 'module' ? 'module' : 'commonjs' :
     'commonjs';
}
