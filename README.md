![@typhonjs-utils/package-json](https://i.imgur.com/C8LtPVY.png)

[![NPM](https://img.shields.io/npm/v/@typhonjs-utils/package-json.svg?label=npm)](https://www.npmjs.com/package/@typhonjs-utils/package-json)
[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MPLv2-yellowgreen.svg?style=flat)](https://github.com/typhonjs-node-utils/package-json/blob/main/LICENSE)

[![Build Status](https://github.com/typhonjs-node-utils/package-json/workflows/CI/CD/badge.svg)](#)
[![Coverage](https://img.shields.io/codecov/c/github/typhonjs-node-utils/package-json.svg)](https://codecov.io/github/typhonjs-node-utils/package-json)
[![Dependency Status](https://david-dm.org/typhonjs-node-utils/package-json.svg)](https://david-dm.org/typhonjs-node-utils/package-json)

Provides an ES Module with several utility functions for working with and retrieving `package.json` along with a 
TyphonJS plugin for `Node.js v12.0+`.

### Why:

When developing in an ES Module environment on Node these functions make it easy to retrieve any local `package.json` 
file through the use of a file path or file URL including `import.meta.url`. There are a few variations on specific 
information retrieved from the located `package.json` file such as the module type which is accomplished with 
`getPackageType`. There is additional flexibility in finding a specific `package.json` as well through the use of an
optional callback function that is invoked during traversal of the file system as each `package.json` file is located.

### Installation:

`npm install @typhonjs-utils/package-json` or include `@typhonjs-utils/package-json` in `dependencies`.

### Highlights:

There are five functions available as named exports:

| name                | description                                                     |
| ------------------- | --------------------------------------------------------------- |
| formatPackage       | Accepts a loaded package object and normalizes the data.        | 
| getPackage          | Retrieves the package object specified by the query.            |
| getPackageAndFormat | Retrieves the package object then returns the formatted result. |
| getPackageType      | Retrieves the package object then returns the `type` field.     |
| getPackageWithPath  | Retrieves the package object and returns it with the path.      |

### Package query object:
While `formatPackage` accepts a loaded `package.json` object all other functions require a query object containing the 
following data:

| name       | type         | description                                                                                                                           |
| ---------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| filepath   | string / URL | Initial file or directory path to search for `package.json`.                                                                          | 
| [basepath] | string / URL | Optional: Base path to stop traversing. Set to the root path of `filepath` if not provided.                                           |
| [callback] | Function     | Optional: A function that evaluates any loaded package.json object that returns a truthy value that stops or continues the traversal. |

`filepath` is required. It should be noted that if the path references a file that this file does not need to exist, but
the containing directory does need to exist. Likewise, the same condition applies to any optional `basepath` supplied.

### Package resolution:
By default `Node.js` will load the nearest `package.json` in a given file structure. This is important to realize when
dealing with the `type` field as intermediary `package.json` files above the module root path will be resolved to 
determine the type of source for `*.js` files. If the intermediary `package.json` file does not contain a type field 
then `commonjs` is assumed by default. To match this behavior `getPackageType` by default stops traversal at the first 
`package.json` file found from a given query. 

### Traversal callback function / data object:

If a callback function is included in the query object it will be invoked with a TraversalData object as the only
function parameter. The data available in the traversal object:

| name             | type   | description                                                               |
| ---------------- | ------ | ------------------------------------------------------------------------- |
| baseDirectory    | string | Stores any base directory defined or the root path.                       | 
| cntr             | number | Stores the number of times a `package.json` file has been processed.      |
| currentDirectory | string | Current directory path of traversal.                                      |
| packageObj       | object | Current loaded `package.json` object.                                     |
| packagePath      | string | File path of current loaded `package.json` object                         |
| rootPath         | string | The root path to stop traversal; determined from starting directory path. |

It should be noted that one should not modify this data and only use it for evaluating whether the currently loaded
`package.json` object is the target to be returned. 

### Examples:
```js
import { formatPackage } from '@typhonjs-utils/package-json';

const result = formatPackage(packageObj);

// Prints a consistent formatted message with the package info.
console.log(result.formattedMessage);
```

```js
import { getPackage } from '@typhonjs-utils/package-json';

// Loads first encountered `package.json` from current source directory.
const packageObj = getPackage({ filepath: import.meta.url }); 
```

```js
import { getPackageType } from '@typhonjs-utils/package-json';

// Type is 'module' or 'commonjs' based on first encountered package.json from current source directory. 
const type = getPackageType({ filepath: import.meta.url }); 
```

```js
import { getPackage } from '@typhonjs-utils/package-json';

// Loads specific `package.json` with name field matching 'target-package' from current source directory.
const packageObj = getPackage({ 
   filepath: import.meta.url, 
   callback: (data) => data.packageObj.name === 'target-package' 
});
```
### formatPackage / getPackageAndFormat / PackageObjFormatted:

`formatPackage` is useful to normalize essential data found in a loaded `package.json` object. `getPackageAndFormat` 
will first load a `package.json` object then return the formatted result. The resulting object is guaranteed to have
these fields defined and empty strings for any fields not defined in the given `package.json` object. In TyphonJS
modules `formatPackage` is primarily used to print a consistent message in error reporting about any offending module.

| name             | type   | description                                                                                                                 |
| ---------------- | ------ | ------------------------------------------------------------------------- |
| name             | string | Name field                                                                | 
| version          | string | Version field                                                             |
| type             | string | `module` or `commonjs` regardless if target package object defines it.    |
| description      | string | Description field.                                                        |
| homepage         | string | Homepage field                                                            |
| license          | string | License field                                                             |
| repository       | string | The URL or unparsed repository string.                                    |
| bugsURL          | string | URL from bugs field.                                                      |
| bugsEmail        | object | Email from bugs field.                                                    |
| formattedMessage | string | A consistently formatted message describing the package.                  |


------

### TyphonJS plugin:

For Node v12.17+ there is a specific export for the TyphonJS plugin via the exports field:
`@typhonjs-utils/package-json/plugin`. 

This plugin works with [@typhonjs-plugin/manager](https://www.npmjs.com/package/@typhonjs-plugin/manager) and simply 
registers the functions above on the plugin manager eventbus under the following event names:

- 'typhonjs:utils:package:json:format' - formatPackage
- 'typhonjs:utils:package:json:format:get' - getPackageAndFormat
- 'typhonjs:utils:package:json:get' - getPackage
- 'typhonjs:utils:package:json:path:get' - getPackageWithPath
- 'typhonjs:utils:package:json:type:get' - getPackageType

An abbreviated example of loading and using the plugin follows:
```js
import PluginManager from '@typhonjs-plugin/manager';

const pluginManager = new PluginManager();
const eventbus = pluginManager.getEventbus();

await pluginManager.add({ name: '@typhonjs-utils/package-json/plugin' });

const packageObj = eventbus.triggerSync('typhonjs:utils:package:json:get', { filepath: import.meta.url });
```

Please refer to the @typhonjs-plugin/manager documentation for more details.
