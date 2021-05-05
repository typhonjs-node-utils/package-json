import './typedef';

/**
 * Get essential info for the given package object consistently formatted.
 *
 * @param {object} packageObj - A loaded `package.json` object.
 *
 * @returns {PackageObjFormatted|undefined} The formatted package object or undefined.
 */
export function formatPackage(packageObj: object): PackageObjFormatted | undefined;
/**
 * Attempts to traverse from `filepath` to `basepath` attempting to load `package.json`.
 *
 * Note: If malformed data is presented the result will undefined. Also note that a file may be specified that
 * does not exist and the directory will be resolved. If that directory exists then resolution will continue.
 *
 * @param {PackageQueryOptions} options - The package query options.
 *
 * @returns {object|undefined} Loaded `package.json` or undefined if an error has occurred or basepath or root
 *                             directory has been reached.
 */
export function getPackage(options: PackageQueryOptions): object | undefined;
/**
 * Attempts to find the nearest package.json via `getPackage` then passes the results to `formatPackage`.
 *
 * @param {PackageQueryOptions} options - The package query options.
 *
 * @returns {PackageObjFormatted|undefined} Formatted package.json or undefined.
 */
export function getPackageAndFormat(options: PackageQueryOptions): PackageObjFormatted | undefined;
/**
 * Attempts to traverse from `filepath` to `basepath` attempting to load `package.json` along with the package path.
 *
 * Note: If malformed data is presented the result will undefined along with a possible error included in the returned
 * object / `PackageObjData`. Also note that a file may be specified that does not exist and the directory will be
 * resolved. If that directory exists then resolution will continue.
 *
 * @param {PackageQueryOptions} options - The package query options.
 *
 * @returns {PackageObjData} Loaded package.json / path or potentially an error.
 */
export function getPackageWithPath(options: PackageQueryOptions): PackageObjData;
/**
 * Attempts to traverse from `filepath` to `basepath` attempting to access `type` field of `package.json`. The type
 * is returned if it is set in the found `package.json` otherwise `commonjs` is returned.
 *
 * Note: With only `filepath` set this function only reliably returns a positive result when there are no
 * intermediary `package.json` files in between a supposed root and path. If provided with malformed
 * data or there is any error / edge case triggered then 'commonjs' by default will be returned.
 *
 * Traversal stops at the first valid `package.json` file as this is how Node works. If the first found `package.json`
 * does not have a `type` field then `commonjs` is returned.
 *
 * @param {PackageQueryOptions} options - The package query options.
 *
 * @returns {string} Type of package - 'module' for ESM otherwise 'commonjs'.
 */
export function getPackageType(options: PackageQueryOptions): string;
