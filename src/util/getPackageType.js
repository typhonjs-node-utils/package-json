import getPackagePath from './getPackagePath.js';
import TraversalData  from './TraversalData.js';

/**
 * Attempts to traverse from `filepath` to `basepath` attempting to access `type` field of `package.json`. The type
 * is returned if it is set in the found `package.json` otherwise `commonjs` is returned.
 *
 * Note: With only `filepath` set this function only reliably returns a positive result when there are no
 * intermediary `package.json` files in between a supposed root and path. If provided with malformed
 * data or there is any error / edge case triggered then 'commonjs' by default will be returned.
 *
 * Another edge case is that traversal stops at the first valid `package.json` file and this may not contain a `type`
 * property whereas a `package.json` file in the root of the module may define it.
 *
 * However if you provide a `filepath` and a `basepath` that is a parent path giving a firm stopping point then a
 * proper resolution callback, `s_RESOLVE_TYPE`, is automatically added. Intermediary `package.json` files that
 * do not have an explicit `type` attribute set do not prevent traversal which continues until the `basepath` is
 * reached which is how Node.js actually resolves the `type` attribute.
 *
 * @param {object}      options - An object.
 *
 * @param {string|URL}  options.filepath - Initial file or directory path to search for `package.json`.
 *
 * @param {string|URL}  [options.basepath] - Base path to stop traversing. Set to the root path of `filepath` if not
 *                                           provided.
 *
 * @param {Function}    [options.callback] - A function that evaluates any loaded package.json object that passes back a
 *                                           truthy value that stops or continues the traversal.
 *
 * @returns {string} Type of package - 'module' for ESM otherwise 'commonjs'.
 */
export default function getPackageType(options)
{
   try
   {
      const data = TraversalData.parse(new TraversalData(), options);

      // Base directory is set and there is no callback set so add a proper resolution callback for package type.
      if (data.isBaseParent() && data._callback === void 0)
      {
         data._callback = s_RESOLVE_TYPE;
      }

      const result = getPackagePath(data);

      return typeof result.packageObj === 'object' ?
       result.packageObj.type === 'module' ? 'module' : 'commonjs' :
        'commonjs';
   }
   catch (error)
   {
      return 'commonjs';
   }
}

/**
 * Handles proper resolution of finding the parent `package.json` that has a type attribute set. You must set
 * `basepath` to provide a known stopping point.
 *
 * @param {TraversalData}  data - Current traversal state.
 *
 * @returns {boolean} If the package object contains a `type` attribute then stop traversal.
 */
const s_RESOLVE_TYPE = (data) => typeof data.packageObj.type === 'string';
