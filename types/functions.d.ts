declare module "functions" {
    /**
     * Get essential info for the given package object consistently formatted.
     *
     * @param {PackageJson} packageObj - A loaded `package.json` object.
     *
     * @returns {PackageObjFormatted|undefined} The formatted package object or undefined.
     */
    export function formatPackage(packageObj: any): PackageObjFormatted | undefined;
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
}
/**
 * The returned data object from a `getPackageWithPath` query.
 */
type PackageObjData = {
    /**
     * - Loaded `package.json` object.
     */
    packageObj?: object | undefined;
    /**
     * - File path of loaded `package.json` object.
     */
    filepath?: string | undefined;
    /**
     * - File path of loaded `package.json` object as Unix styled path.
     */
    filepathUnix?: string | undefined;
    /**
     * - A potential error instance.
     */
    error?: Error | undefined;
};
/**
 * The returned data object from formatting a `package.json` object.
 */
type PackageObjFormatted = {
    /**
     * - Name property.
     */
    name: string;
    /**
     * - Version property.
     */
    version: string;
    /**
     * - `module` or `commonjs`.
     */
    type: string;
    /**
     * - Description property.
     */
    description: string;
    /**
     * - Homepage property.
     */
    homepage: string;
    /**
     * - License property.
     */
    license: string;
    /**
     * - The repository URL or unparsed repository string.
     */
    repository: string;
    /**
     * - URL from bugs property.
     */
    bugsURL: string;
    /**
     * - Email from bugs property.
     */
    bugsEmail: string;
    /**
     * - A formatted message describing the package.
     */
    formattedMessage: string;
};
/**
 * Defines the data object passed to the functions to perform a `package.json` query.
 */
type PackageQueryOptions = {
    /**
     * - Initial file or directory path to search for `package.json`.
     */
    filepath: string | URL;
    /**
     * - Base path to stop traversing. Set to the root path of `filepath` if not
     *    provided.
     */
    basepath?: string | URL;
    /**
     * - A function that evaluates a loaded package.json object and associated
     *   traversal data returning a truthy value to stops or continue the
     *   traversal.
     */
    callback?: TraversalCallback;
};
/**
 * An optional callback function for {@link PackageQueryOptions} that evaluates a loaded package.json object and
 * associated traversal data returning a truthy value to stops or continue the traversal.
 */
type TraversalCallback = (data: TraversalDataObj) => boolean;
/**
 * Defines the data object passed to any traversal callback function. All paths are converted to Unix style paths,
 * so for instance on Windows `\` and `\\` are replaced with `/`.
 */
type TraversalDataObj = {
    /**
     * - Stores the `basepath` directory as a Unix styled path.
     */
    baseDir: string;
    /**
     * - Stores the number of times a `package.json` has been processed.
     */
    cntr: number;
    /**
     * - Current directory of traversal as a Unix styled path.
     */
    currentDir: string;
    /**
     * - Current loaded `package.json` object.
     */
    packageObj: object;
    /**
     * - Current loaded `package.json` file path as a Unix styled path.
     */
    filepath: string;
    /**
     * - Current directory of traversal as a relative Unix styled path from `process.cwd`.
     */
    relativeDir: string;
    /**
     * - The root path to stop traversal as a Unix styled path.
     */
    rootPath: string;
};
