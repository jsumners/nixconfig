## Objects

<dl>
<dt><a href="#nixconfig">nixconfig</a> : <code>object</code></dt>
<dd><p>A simple tool for reading configuration files from standard storage paths
and the environment.</p>
<p>Internally, all of the loaded configuration is merged into a standard
JavaScript object. The properties of this object can be accessed via the
<code>.get</code> method using a path string like <code>foo.bar</code> to access <code>bar</code> of
<code>{foo: { bar: {} }}</code>. The <code>.set</code> method also accepts such paths.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#nixconfigFactory">nixconfigFactory(options)</a> ⇒ <code><a href="#nixconfig">nixconfig</a></code></dt>
<dd><p>Build a nixconfig instance.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#NixconfigOptions">NixconfigOptions</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="nixconfig"></a>

## nixconfig : <code>object</code>
A simple tool for reading configuration files from standard storage paths
and the environment.

Internally, all of the loaded configuration is merged into a standard
JavaScript object. The properties of this object can be accessed via the
`.get` method using a path string like `foo.bar` to access `bar` of
`{foo: { bar: {} }}`. The `.set` method also accepts such paths.

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| delim | <code>string</code> | The delimiter used to separate path accessors in keys passed to `.set` and `.get`. Default: `.`. |
| config | <code>object</code> | The internal object that represents all of the loaded configuration. This object has two special properties: `Symbol.for('nixconfig.errors')` and `Symbol.for('nixconfig.notFound')`. The `nixconfig.errors` property is a list of `Error` objects generated when trying to load a given configuration file (e.g. when a `foo.js` throws an error during loading). Each of these errors has a `targetFile` property indicating which configuration file generated the error. The `nixconfig.notFound` property is a list of files that have been attempted to load but could not be found on the file system, e.g. `/etc/foo.json` when `/etc/foo.json` does not exist. |
| lookupPaths | <code>Array</code> | The list of paths, in order of ascending precedence, that *nixconfig* will look in for config files. |


* [nixconfig](#nixconfig) : <code>object</code>
    * [.addLoader(ext, method)](#nixconfig.addLoader) ⇒ <code>object</code>
    * [.get(key)](#nixconfig.get) ⇒ <code>\*</code> \| <code>undefined</code>
    * [.set(key)](#nixconfig.set) ⇒ [<code>nixconfig</code>](#nixconfig)

<a name="nixconfig.addLoader"></a>

### nixconfig.addLoader(ext, method) ⇒ <code>object</code>
Add a method to load a specific configuration file format. The method
must return a standard JavaScript object. If the method throws, then the
error will be ignored.

**Kind**: static method of [<code>nixconfig</code>](#nixconfig)  
**Returns**: <code>object</code> - The current *nixconfig* instance.  
**Throws**:

- <code>Error</code> When the given extension does not start with a leading `.`
or the `method` is not a function.


| Param | Type | Description |
| --- | --- | --- |
| ext | <code>string</code> | The file extension for the loader method, e.g. `'.foo'`. If the extension leads with a '.' then the loader will be used for parsing files on the file system. If it begins with a '~' then it will simply be invoked after all files have been processed. |
| method | <code>function</code> | The function that will be used to process files with the specified extension. |

<a name="nixconfig.get"></a>

### nixconfig.get(key) ⇒ <code>\*</code> \| <code>undefined</code>
Retrieve values from the loaded configuration.

**Kind**: static method of [<code>nixconfig</code>](#nixconfig)  
**Returns**: <code>\*</code> \| <code>undefined</code> - The retrieved value, or `undefined` if it could
not be found.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The name of the value to retrieve. This can be a path, separated by the `nixconfig.delim` value. For example, `foo.bar` to access `bar` of `{foo: { bar: {} }}`. |

<a name="nixconfig.set"></a>

### nixconfig.set(key) ⇒ [<code>nixconfig</code>](#nixconfig)
Set a value in the internal configuration. Paths may be used just as is
described in `.get`.

**Kind**: static method of [<code>nixconfig</code>](#nixconfig)  
**Returns**: [<code>nixconfig</code>](#nixconfig) - The current nixconfig instance.  
**Throws**:

- <code>Error</code> When a supplied path cannot be reached.

**See**: [get](#nixconfig.get) for details on pathing.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The name of the value to set. |

<a name="nixconfigFactory"></a>

## nixconfigFactory(options) ⇒ [<code>nixconfig</code>](#nixconfig)
Build a nixconfig instance.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>NixconfigOptions</code>](#NixconfigOptions) | Configuration options object for the returned instance. |

<a name="NixconfigOptions"></a>

## NixconfigOptions : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [initialConfig] | <code>object</code> | A default config object in case no configuration files are available. Default: `{}`. |
| [parentName] | <code>string</code> | The name of the application. If not supplied, this will be determined by traversing the directory tree up to the first directory with a `node_modules` directory and a `package.json` that is *not* the `nixconfig` module directory and using the value of `name` within the found `package.json`. If this is set, then the `parentPath` option must also be set. Default: `undefined`. |
| [parentPath] | <code>string</code> | The absolute path to the application's root directory. This must be set if `parentName` is set. If not set, the path will be determined in the same fashion as `parentName`. Default: `undefined`. |
| [delim] | <code>string</code> | Set the delimiter to use in path based operations like [get](#nixconfig.get). Default: `.`. |
| [loaders] | <code>array</code> \| <code>object</code> | Define a set of additional configuration loaders. If passing an array, the array should be a list of objects like `{ext: '.foo', method: () => {}}`. If passing an object, the keys should be the extension and the values the methods, e.g. `{ '.foo': () => {} }`. |
| logger | <code>object</code> | A logger instance that conforms to the log4j API. For example, [https://npm.im/pino](https://npm.im/pino). |

