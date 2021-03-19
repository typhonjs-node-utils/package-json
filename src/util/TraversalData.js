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
      this.baseDirectory = void 0;

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
      this.currentDirectory = void 0;

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
       * Stores a callback function.
       *
       * @type {Function}
       * @private
       */
      this._callback = void 0;
   }

   /**
    * Returns true if basedir has been set comparing the starting directory against the base directory to
    * determine if the base directory is a parent path intentionally stopping traversal.
    *
    * @returns {boolean} Whether basedir is set and a parent of the starting directory.
    */
   isBaseParent()
   {
      // If basepath is not configured it is set to root path.
      if (this.baseDirectory === this.rootPath) { return false; }

      const relative = path.relative(this.baseDirectory, this.currentDirectory);
      return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
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
         throw new TypeError(`'filepath' is not a 'string' or file 'URL'`);
      }

      if (basepath !== void 0 && typeof basepath !== 'string' && !(basepath instanceof URL))
      {
         throw new TypeError(`'basepath' is not a 'string' or file 'URL'`);
      }

      if (callback !== void 0 && typeof callback !== 'function')
      {
         throw new TypeError(`'callback' is not a 'function'`);
      }

      // Convert basepath if an URL to a file path
      if (basepath instanceof URL)
      {
         basepath = url.fileURLToPath(basepath);
      }

      // Convert any URL or string file URL to path.
      if (filepath instanceof URL || filepath.startsWith('file:/'))
      {
         filepath = url.fileURLToPath(filepath);
      }

      // Handle `filepath` as a directory or get directory of path with file name.
      data.currentDirectory = fs.existsSync(filepath) && fs.lstatSync(filepath).isDirectory() ?
       path.resolve(filepath) : path.resolve(path.dirname(filepath));

      // Convert basepath to root of resolved file path if not a string.
      if (typeof basepath !== 'string')
      {
         basepath = path.parse(data.currentDirectory).root;
      }

      // Convert string file URL to path.
      if (basepath.startsWith('file:/'))
      {
         basepath = url.fileURLToPath(basepath);
      }

      // Handle `basepath` as a directory or convert a path with file name to a directory.
      data.baseDirectory = fs.existsSync(basepath) && fs.lstatSync(basepath).isDirectory() ? path.resolve(basepath) :
       path.resolve(path.dirname(basepath));

      // If the resolved paths do not exist then return null.
      if (!fs.existsSync(data.baseDirectory) || !fs.existsSync(data.currentDirectory))
      {
         throw new Error(`Could not resolve 'filepath' or 'basepath'`);
      }

      // Ensure we track the root of the current directory path to stop iteration.
      data.rootPath = path.parse(data.currentDirectory).root;

      data._callback = callback;

      return data;
   }
}
