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
