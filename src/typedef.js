/**
 * The returned data object from a `getPackageWithPath` query.
 *
 * @typedef {object} PackageObjData
 *
 * @property {object|undefined}  packageObj - Loaded `package.json` object.
 * @property {string|undefined}  filepath - File path of loaded `package.json` object.
 * @property {string|undefined}  filepathUnix - File path of loaded `package.json` object as Unix styled path.
 * @property {Error|undefined}   error - A possible error instance.
 */

/**
 * The returned data object from formatting a `package.json` object.
 *
 * @typedef {object} PackageObjFormatted
 *
 * @property {string}   name - Name property.
 * @property {string}   version - Version property.
 * @property {string}   type - `module` or `commonjs`.
 * @property {string}   description - Description property.
 * @property {string}   homepage - Homepage property.
 * @property {string}   license - License property.
 * @property {string}   repository - The repository URL or unparsed repository string.
 * @property {string}   bugsURL - URL from bugs property.
 * @property {string}   bugsEmail - Email from bugs property.
 * @property {string}   formattedMessage - A formatted message describing the package.
 */

/**
 * Defines the data object passed to the functions to perform a `package.json` query.
 *
 * @typedef {object} PackageQueryOptions
 *
 * @property {string|URL}  filepath - Initial file or directory path to search for `package.json`.
 *
 * @property {string|URL}  [basepath] - Base path to stop traversing. Set to the root path of `filepath` if not
 *                                      provided.
 *
 * @property {Function}    [callback] - A function that evaluates any loaded package.json object that returns a truthy
 *                                      value that stops or continues the traversal.
 */

/**
 * Defines the data object passed to any traversal callback function. All paths are converted to Unix style paths,
 * so for instance on Windows `\` and `\\` are replaced with `/`.
 *
 * @typedef {object} TraversalDataObj
 *
 * @property {string}   baseDir - Stores the `basepath` directory as a Unix styled path.
 * @property {number}   cntr - Stores the number of times a `package.json` has been processed.
 * @property {string}   currentDir - Current directory of traversal as a Unix styled path.
 * @property {object}   packageObj - Current loaded `package.json` object.
 * @property {string}   packagePath - Current loaded `package.json` object path as a Unix styled path.
 * @property {string}   relativeDir - Current directory of traversal as a relative Unix styled path from `process.cwd`.
 * @property {string}   rootPath - The root path to stop traversal as a Unix styled path.
 */
