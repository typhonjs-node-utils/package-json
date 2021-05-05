![@typhonjs-utils/package-json](https://i.imgur.com/C8LtPVY.png)

[![NPM](https://img.shields.io/npm/v/@typhonjs-utils/package-json.svg?label=npm)](https://www.npmjs.com/package/@typhonjs-utils/package-json)
[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MPLv2-yellowgreen.svg?style=flat)](https://github.com/typhonjs-node-utils/package-json/blob/main/LICENSE)

[![Build Status](https://github.com/typhonjs-node-utils/package-json/workflows/CI/CD/badge.svg)](#)
[![Coverage](https://img.shields.io/codecov/c/github/typhonjs-node-utils/package-json.svg)](https://codecov.io/github/typhonjs-node-utils/package-json)
[![Dependency Status](https://david-dm.org/typhonjs-node-utils/package-json.svg)](https://david-dm.org/typhonjs-node-utils/package-json)

Provides an ES Module with several utility functions for working with and retrieving `package.json` along with a 
TyphonJS plugin for `Node.js v12.0+`. All of these functions are synchronous and there is no caching of results between
queries made. 

### Why:

When developing in an ES Module environment on Node these functions make it easy to retrieve any local `package.json` 
through the use of a file path or file URL including `import.meta.url`. There are a few variations on specific 
information retrieved from the located `package.json` such as the module type which is accomplished with 
`getPackageType`. There is additional flexibility in finding a specific `package.json` as well through the use of an
optional callback function that is invoked during traversal of the file system as each `package.json` is located.

### Installation:

`npm install @typhonjs-utils/package-json` or include `@typhonjs-utils/package-json` in `dependencies`.

### Highlights:

There are five functions available as named exports:

| Function Name       | Description                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------- |
| formatPackage       | Accepts a loaded package object and normalizes the data.                                      | 
| getPackage          | Retrieves the package object specified by the query.                                          |
| getPackageAndFormat | Retrieves the package object then returns the formatted result.                               |
| getPackageType      | Retrieves the package object then returns the `type` property; either `module` or `commonjs`. |
| getPackageWithPath  | Retrieves the package object and returns it with the path.                                    |

### Package query object:
While `formatPackage` accepts a loaded `package.json` object all other functions require a query object containing the 
following data:

| Property   | Type         | Description                                                                                                                           |
| ---------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| filepath   | string / URL | Initial file or directory path to traverse for `package.json`.                                                                        | 
| [basepath] | string / URL | Optional: Base path to stop traversing. Set to the root path of `filepath` if not provided.                                           |
| [callback] | Function     | Optional: A function that evaluates any loaded package.json object that returns a truthy value that stops or continues the traversal. |

`filepath` is required. It should be noted that if the path references a file that this file does not need to exist, but
the containing directory does need to exist. Likewise, the same condition applies to any optional `basepath` supplied.

### Package resolution:
By default `Node.js` will load the nearest `package.json` in a given file structure. This is important to realize when
dealing with the `type` property as intermediary `package.json` files above the module root path will be resolved to 
determine the type of source for `*.js` files at that directory level and lower. If the intermediary `package.json` does
not contain a type property then `commonjs` is assumed by default. To match this behavior `getPackageType` stops 
traversal at the first `package.json` found from a given query. 

### `getPackageWithPath` / PackageObjData:

All functions besides `formatPackage` rely on `getPackageWithPath`. `getPackageWithPath` will not throw on any errors
encountered and will always return a PackageObjData object. If an error occurs the `error` property will contain the 
error thrown and `packageObj` will be undefined and `packagePath` may be defined if the error occurred loading a 
specific `package.json`. Likewise, if traversal completes without locating `package.json` then error will 
contain a message indicating this failure. On success both `packageObj` and `packagePath` are defined and error is 
undefined.

| Property      | Type               | Description                           |
| ------------- | ------------------ | ------------------------------------- |
| [packageObj]  | object / undefined | Loaded `package.json` object.         | 
| [packagePath] | string / undefined | Path of loaded `package.json` object. |
| [error]       | Error / undefined  | A potential error instance.           |

### `getPackageType`:

`getPackageType` always returns either `module` or `commonjs` depending on the `type` property of the located 
`package.json`; `module` is only returned if `"type": "module"` is set. By default, traversal stops at the first 
encountered `package.json`. Any error condition / malformed `package.json` or failure to locate `package.json`  will 
return `commonjs`.  

### Traversal callback function / data object:

If a callback function is included in the query object it will be invoked with a TraversalData object with all paths
converted to Unix styled paths as the only function parameter. On Windows any `\` and `\\` path separators are converted
to `/`. The data available in the traversal callback object:

| Property    | Type   | Description                                                                       |
| ----------- | ------ | --------------------------------------------------------------------------------- |
| baseDir     | string | Stores the `basepath` directory as a Unix styled path.                            | 
| cntr        | number | Stores the number of times a `package.json` has been processed.                   |
| currentDir  | string | Current directory of traversal as a Unix styled path.                             |
| packageObj  | object | Current loaded `package.json` object.                                             |
| packagePath | string | Current loaded `package.json` object path as a Unix styled path.                  |
| relativeDir | string | Current directory of traversal as a relative Unix styled path from `process.cwd`. |
| rootPath    | string | The root path to stop traversal as a Unix styled path.                            |

### Examples:
```js
import { formatPackage } from '@typhonjs-utils/package-json';

const result = formatPackage(packageObj);

// Prints a consistent formatted message with the package info.
console.log(result.formattedMessage);
```

```js
import { getPackageWithPath } from '@typhonjs-utils/package-json';

// Loads first encountered `package.json` from traversal from current source directory.
const { packageObj, packagePath } = getPackageWithPath({ filepath: import.meta.url }); 
```

```js
import { getPackage } from '@typhonjs-utils/package-json';

// Loads first encountered `package.json` from traversal from current source directory.
const packageObj = getPackage({ filepath: import.meta.url }); 
```

```js
import { getPackageType } from '@typhonjs-utils/package-json';

// Type is 'module' or 'commonjs' based on first encountered package.json from traversal from current source directory. 
const type = getPackageType({ filepath: import.meta.url }); 
```

```js
import { getPackage } from '@typhonjs-utils/package-json';

// Loads specific `package.json` with name property matching 'target-package' from traversal from current source directory.
const packageObj = getPackage({ 
   filepath: import.meta.url, 
   callback: (data) => data.packageObj.name === 'target-package' 
});
```
### `formatPackage` / `getPackageAndFormat` / PackageObjFormatted:

`formatPackage` is useful to normalize essential data found in a loaded `package.json` object. `getPackageAndFormat` 
will first attempt to load a `package.json` object then return the formatted result. The resulting object is guaranteed 
to have these properties defined and empty strings for any properties not defined in the given `package.json` object. If 
`formatPackage` does not receive an object then undefined is returned. 

| Property         | Type   | Description                                                                                                                 |
| ---------------- | ------ | ------------------------------------------------------------------------- |
| name             | string | Name property.                                                            | 
| version          | string | Version property.                                                         |
| type             | string | `module` or `commonjs` regardless if target package object defines it.    |
| description      | string | Description property.                                                     |
| homepage         | string | Homepage property.                                                        |
| license          | string | License property.                                                         |
| repository       | string | The URL or unparsed repository string.                                    |
| bugsURL          | string | URL from bugs property.                                                   |
| bugsEmail        | string | Email from bugs property.                                                 |
| formattedMessage | string | A consistently formatted message describing the package.                  |

In TyphonJS modules `getPackageAndFormat` is used in combination with
[@typhonjs-utils/error-parser](https://www.npmjs.com/package/@typhonjs-utils/error-parser) primarily to print / log a
consistent message in error reporting about any offending module.

------

### TyphonJS plugin:

For Node v12.17+ there is a specific export for the TyphonJS plugin via the exports property:
`@typhonjs-utils/package-json/plugin`. 

This plugin works with [@typhonjs-plugin/manager](https://www.npmjs.com/package/@typhonjs-plugin/manager) and simply 
registers the functions above on the plugin manager eventbus under the following event names:

| Event Name                               | Function Invoked    |
| ---------------------------------------- | ------------------- |
| `typhonjs:utils:package:json:format`     | formatPackage       | 
| `typhonjs:utils:package:json:format:get` | getPackageAndFormat |
| `typhonjs:utils:package:json:get`        | getPackage          |
| `typhonjs:utils:package:json:path:get`   | getPackageWithPath  |
| `typhonjs:utils:package:json:type:get`   | getPackageType      |

An abbreviated pseudocode example of loading and using the plugin follows:
```js
import PluginManager from '@typhonjs-plugin/manager';

const pluginManager = new PluginManager();
const eventbus = pluginManager.getEventbus();

await pluginManager.add({ name: '@typhonjs-utils/package-json/plugin' });

const packageObj = eventbus.triggerSync('typhonjs:utils:package:json:get', { filepath: import.meta.url });
```

Please refer to the @typhonjs-plugin/manager documentation for more details.
