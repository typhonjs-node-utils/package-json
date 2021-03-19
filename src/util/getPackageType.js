import getPackagePath   from './getPackagePath.js';

/**
 * Attempts to traverse from `filePath` to `basePath` attempting to access `type` field of `package.json`. The type
 * is returned if it is set in the found `package.json` otherwise `commonjs` is returned.
 *
 * Note: This only reliably returns a positive result. If provided with malformed data or there is any error / edge case
 * triggered then 'commonjs' by default will be returned.
 *
 * Another edge case is that traversal stops at the first valid `package.json` file and this may not contain a `type`
 * property whereas a `package.json` file in the root of the module may define it.
 *
 * @param {string|URL}   filePath - Initial file or directory path to search for `package.json`.
 *
 * @param {string|URL}   [basePath] - Base path to stop traversing. Set to the root path of `filePath` if not provided.
 *
 * @returns {string} Type of package - 'module' for ESM otherwise 'commonjs'.
 */
function getPackageType(filePath, basePath = void 0)
{
   const result = getPackagePath(filePath, basePath);

   return result !== null ? result.packageObj.type === 'module' ? 'module' : 'commonjs' : 'commonjs';
}

getPackageType.clearCache = () => getPackagePath.clearCache();

export default getPackageType;
