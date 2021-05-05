/**
 * @param {string} version - Local version string for this module.
 *
 * @returns {object} The formatted package for this module w/ version number substitution.
 */
export default function(version)
{
   return {
      name: '@typhonjs-utils/package-json',
      version: `${version}`,
      description: 'Provides several utility functions for working with and retrieving `package.json`.',
      type: 'module',
      homepage: 'https://github.com/typhonjs-node-utils/package-json#readme',
      license: 'MPL-2.0',
      repository: "github:typhonjs-node-utils/package-json",
      bugsURL: 'https://github.com/typhonjs-node-utils/package-json/issues',
      bugsEmail: 'support@typhonjs.io',
      formattedMessage: `name: @typhonjs-utils/package-json (${version})\ndescription: Provides several utility functions for working with and retrieving \`package.json\`.\nhomepage: https://github.com/typhonjs-node-utils/package-json#readme\nrepository: github:typhonjs-node-utils/package-json\nbugs / issues: https://github.com/typhonjs-node-utils/package-json/issues\nbugs / email: support@typhonjs.io`
   };
}
