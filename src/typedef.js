/**
 * @typedef {object} NPMPackageData
 *
 * @property {string}   name -
 * @property {string}   version -
 * @property {string}   type -
 * @property {string}   description -
 * @property {string}   homepage -
 * @property {string}   license -
 * @property {{url: string}}   repository -
 * @property {{url: string}}   bugs -
 * @property {string}   formattedMessage -
 */

/**
 * @typedef {object} PackageObjData
 *
 * @property {object|undefined}  packageObj - Loaded `package.json` object.
 * @property {string|undefined}  packagePath - Path of loaded `package.json` object.
 * @property {Error|undefined}   error - An error instance.
 */

