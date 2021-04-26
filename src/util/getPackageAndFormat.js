import formatPackage from './formatPackage.js';
import getPackage    from './getPackage.js';

/**
 * Attempts to find the nearest package.json via `getPackage` then passes the results to `formatPackage`.
 *
 * Note: If malformed data is presented the result will undefined. Also note that a file may be specified that
 * does not exist and the directory will be resolved. If that directory exists then resolution will continue.
 *
 * @param {object}      options - An object.
 *
 * @param {string|URL}  options.filepath - Initial file or directory path to search for `package.json`.
 *
 * @param {string|URL}  [options.basepath] - Base path to stop traversing. Set to the root path of `filepath` if not
 *                                           provided.
 *
 * @param {Function}    [options.callback] - A function that evaluates any loaded package.json object that passes
 *                                           back a truthy value that stops or continues the traversal.
 *
 * @returns {object} Formatted package.json or empty object if an error has occurred.
 */
export default function(options)
{
   return formatPackage(getPackage(options));
}
