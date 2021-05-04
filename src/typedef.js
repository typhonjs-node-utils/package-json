/**
 * The returned data object from a `getPackagePath` query.
 *
 * @typedef {object} PackageObjData
 *
 * @property {object|undefined}  packageObj - Loaded `package.json` object.
 * @property {string|undefined}  packagePath - Path of loaded `package.json` object.
 * @property {Error|undefined}   error - An error instance.
 */

/**
 * The returned data object from formatting a `package.json` object.
 *
 * @typedef {object} PackageObjFormatted
 *
 * @property {string}                        name - Name field
 * @property {string}                        version - Version field
 * @property {string}                        type - `module` or `commonjs`
 * @property {string}                        description - Description field.
 * @property {string}                        homepage - Homepage field
 * @property {string}                        license - License field
 * @property {{url: string}}                 repository - The unparsed URL or repository string.
 * @property {{email: string, url: string}}  bugs - Email / URL from bugs field.
 * @property {string}                        formattedMessage - A formatted message describing the package.
 */

/**
 * Defines the data object passed to the functions to perform a `package.json` query.
 *
 * @typedef {object} PackageOptions
 *
 * @property {string|URL}  filepath - Initial file or directory path to search for `package.json`.
 *
 * @property {string|URL}  [basepath] - Base path to stop traversing. Set to the root path of `filepath` if not
 *                                      provided.
 *
 * @property {Function}    [callback] - A function that evaluates any loaded package.json object that passes
 *                                      back a truthy value that stops or continues the traversal.
 */
