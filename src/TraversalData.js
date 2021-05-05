import url  from 'url';
import fs   from 'fs';
import path from 'path';

/**
 * Stores the data tracked over traversing the starting directory. And provides a few internal utility methods.
 */
export default class TraversalData
{
   constructor()
   {
      /**
       * Stores any base directory defined or the root path.
       *
       * @type {string}
       */
      this.baseDir = void 0;

      /**
       * Stores the base directory as a unix path.
       *
       * @type {string}
       * @private
       */
      this._baseDirUnix = void 0;

      /**
       * Stores the number of times a package is processed; useful in callbacks.
       *
       * @type {number}
       */
      this.cntr = 0;

      /**
       * Current directory of traversal.
       *
       * @type {string}
       */
      this.currentDir = void 0;

      /**
       * Current loaded `package.json` object.
       *
       * @type {object}
       */
      this.packageObj = void 0;

      /**
       * Path of current loaded `package.json` object
       *
       * @type {string}
       */
      this.packagePath = void 0;

      /**
       * The root path to stop traversal; determined from starting directory path.
       *
       * @type {string}
       */
      this.rootPath = void 0;

      /**
       * Stores the root path as a unix path.
       *
       * @type {string}
       * @private
       */
      this._rootPathUnix = void 0;

      /**
       * Stores the traversal callback function.
       *
       * @type {Function}
       */
      this.callback = void 0;
   }

   /**
    * Parses the options object passed into the various getPackage functions.
    *
    * @param {TraversalData}  data - A TraversalData instance.
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
    * @returns {TraversalData} Returns the parsed TraversalData instance.
    */
   static parse(data, { filepath, basepath = void 0, callback } = {})
   {
      if (typeof filepath !== 'string' && !(filepath instanceof URL))
      {
         throw new TypeError(`'filepath' is not a string or file URL`);
      }

      if (basepath !== void 0 && typeof basepath !== 'string' && !(basepath instanceof URL))
      {
         throw new TypeError(`'basepath' is not a string or file URL`);
      }

      if (callback !== void 0 && typeof callback !== 'function')
      {
         throw new TypeError(`'callback' is not a function`);
      }

      // Convert basepath if an URL to a file path
      if (basepath !== void 0 && (basepath instanceof URL || basepath.startsWith('file:/')))
      {
         basepath = url.fileURLToPath(basepath);
      }

      // Convert any URL or string file URL to path.
      if (filepath instanceof URL || filepath.startsWith('file:/'))
      {
         filepath = url.fileURLToPath(filepath);
      }

      // Handle `filepath` as a directory or get directory of path with file name.
      data.currentDir = fs.existsSync(filepath) && fs.lstatSync(filepath).isDirectory() ?
       path.resolve(filepath) : path.resolve(path.dirname(filepath));

      // Convert basepath to root of resolved file path if not a string.
      if (typeof basepath !== 'string')
      {
         basepath = path.parse(data.currentDir).root;
      }

      // Handle `basepath` as a directory or convert a path with file name to a directory.
      data.baseDir = fs.existsSync(basepath) && fs.lstatSync(basepath).isDirectory() ? path.resolve(basepath) :
       path.resolve(path.dirname(basepath));

      // If the resolved paths do not exist then return null.
      if (!fs.existsSync(data.baseDir) || !fs.existsSync(data.currentDir))
      {
         throw new Error(`Could not resolve 'filepath' or 'basepath'`);
      }

      // Ensure we track the root of the current directory path to stop iteration.
      data.rootPath = path.parse(data.currentDir).root;

      // Store unix path conversion of base and root paths.
      data._baseDirUnix = s_TO_UNIX_PATH(data.baseDir);
      data._rootPathUnix = s_TO_UNIX_PATH(data.rootPath);

      data.callback = callback;

      return data;
   }

   /**
    * Converts the current state of TraversalData to Unix styled paths to pass to any traversal callback
    * function defined.
    *
    * @returns {TraversalDataObj} The data object to pass to any traversal callback function defined.
    */
   toUnixPaths()
   {
      return {
         baseDir: this._baseDirUnix,
         cntr: this.cntr,
         currentDir: s_TO_UNIX_PATH(this.currentDir),
         packageObj: this.packageObj,
         packagePath: s_TO_UNIX_PATH(this.packagePath),
         relativeDir: s_TO_UNIX_PATH(path.relative(process.cwd(), this.currentDir)),
         rootPath: this._rootPathUnix
      };
   }
}

/**
 * Convert a file / dir path to a Unix styled path.
 *
 * @param {string} p - A file / dir path.
 *
 * @returns {string} Unix styled path; on Windows swap `\` and `\\` for `/`.
 */
function s_TO_UNIX_PATH(p)
{
   return p.replace(/\\/g, '/').replace(/(?<!^)\/+/g, '/');
}
