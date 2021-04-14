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
 * Get essential info for the given package object consistently formatted.
 *
 * @param {object} packageObj - A loaded `package.json` object.
 *
 * @returns {NPMPackageData} The formatted package object.
 */
export default function format(packageObj = {})
{
   let bugsEmail, bugsURL, repoURL;

   // Sanity case to create empty object.
   if (typeof packageObj !== 'object')
   {
      packageObj = {};
   }

   // Parse bugs email.
   if (packageObj.bugs)
   {
      bugsEmail = packageObj.bugs.email ? packageObj.bugs.email : void 0;
   }

   // Parse bugs URL.
   if (packageObj.bugs)
   {
      bugsURL = packageObj.bugs.url ? packageObj.bugs.url : packageObj.bugs;
   }

   // Parse repository URL.
   if (packageObj.repository)
   {
      repoURL = packageObj.repository.url ? packageObj.repository.url : packageObj.repository;
   }

   /**
    * Creates NPMPackageData result.
    *
    * @type {NPMPackageData}
    */
   const packageData = {
      name: packageObj.name,
      version: packageObj.version,
      type: packageObj.type === 'module' ? 'module' : 'commonjs',
      description: packageObj.description,
      homepage: packageObj.homepage,
      license: packageObj.license,
      repository: { url: repoURL },
      bugs: { email: bugsEmail, url: bugsURL }
   };

   let formattedMessage = '';

   if (packageData.name)
   {
      formattedMessage += `name: ${packageData.name}${packageData.version ? ` (${packageData.version})` : ''}`;
   }

   if (packageData.description) { formattedMessage += `\ndescription: ${packageData.description}`; }
   if (packageData.homepage) { formattedMessage += `\nhomepage: ${packageData.homepage}`; }
   if (packageData.repository.url) { formattedMessage += `\nrepository: ${packageData.repository.url}`; }
   if (packageData.bugs.url) { formattedMessage += `\nbugs / issues: ${packageData.bugs.url}`; }
   if (packageData.bugs.email) { formattedMessage += `\nbugs / email: ${packageData.bugs.email}`; }

   packageData.formattedMessage = formattedMessage;

   return packageData;
}
