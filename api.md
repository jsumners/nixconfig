## Objects

<dl>
<dt><a href="#kvmesh">kvmesh</a> : <code>object</code></dt>
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
<dt><a href="#kvmeshFactory">kvmeshFactory(options)</a> ⇒ <code><a href="#kvmesh">kvmesh</a></code></dt>
<dd><p>Build a kvmesh instance.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#KvmeshOptions">KvmeshOptions</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="kvmesh"></a>

## kvmesh : <code>object</code>
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
| config | <code>object</code> | The internal object that represents all of the loaded configuration. |


* [kvmesh](#kvmesh) : <code>object</code>
    * [.addLoader(ext, method)](#kvmesh.addLoader) ⇒ <code>object</code>
    * [.get(key)](#kvmesh.get) ⇒ <code>\*</code> \| <code>undefined</code>
    * [.set(key)](#kvmesh.set) ⇒ [<code>kvmesh</code>](#kvmesh)

<a name="kvmesh.addLoader"></a>

### kvmesh.addLoader(ext, method) ⇒ <code>object</code>
Add a method to load a specific configuration file format. The method
must return a standard JavaScript object. If the method throws, then the
error will be ignored.

**Kind**: static method of [<code>kvmesh</code>](#kvmesh)  
**Returns**: <code>object</code> - The current *kvmesh* instance.  
**Throws**:

- <code>Error</code> When the given extension does not start with a leading `.`
or the `method` is not a function.


| Param | Type | Description |
| --- | --- | --- |
| ext | <code>string</code> | The file extension for the loader method, e.g. `'.foo'`. If the extension leads with a '.' then the loader will be used for parsing files on the file system. If it begins with a '~' then it will simply be invoked after all files have been processed. |
| method | <code>function</code> | The function that will be used to process files with the specified extension. |

<a name="kvmesh.get"></a>

### kvmesh.get(key) ⇒ <code>\*</code> \| <code>undefined</code>
Retrieve values from the loaded configuration.

**Kind**: static method of [<code>kvmesh</code>](#kvmesh)  
**Returns**: <code>\*</code> \| <code>undefined</code> - The retrieved value, or `undefined` if it could
not be found.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The name of the value to retrieve. This can be a path, separated by the `kvmesh.delim` value. For example, `foo.bar` to access `bar` of `{foo: { bar: {} }}`. |

<a name="kvmesh.set"></a>

### kvmesh.set(key) ⇒ [<code>kvmesh</code>](#kvmesh)
Set a value in the internal configuration. Paths may be used just as is
described in `.get`.

**Kind**: static method of [<code>kvmesh</code>](#kvmesh)  
**Returns**: [<code>kvmesh</code>](#kvmesh) - The current kvmesh instance.  
**Throws**:

- <code>Error</code> When a supplied path cannot be reached.

**See**: [get](#kvmesh.get) for details on pathing.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The name of the value to set. |

<a name="kvmeshFactory"></a>

## kvmeshFactory(options) ⇒ [<code>kvmesh</code>](#kvmesh)
Build a kvmesh instance.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>KvmeshOptions</code>](#KvmeshOptions) | Configuration options object for the returned instance. |

<a name="KvmeshOptions"></a>

## KvmeshOptions : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| initialConfig | <code>object</code> | A default config object in case no configuration files are available. Default: `{}`. |
| delim | <code>string</code> | Set the delimiter to use in path based operations like [get](#kvmesh.get). Default: `.`. |
| loaders | <code>array</code> \| <code>object</code> | Define a set of additional configuration loaders. If passing an array, the array should be a list of objects like `{ext: '.foo', method: () => {}}`. If passing an object, the keys should be the extension and the values the methods, e.g. `{ '.foo': () => {} }`. |
| logger | <code>object</code> | A logger instance that conforms to the log4j API. For example, [https://npm.im/pino](https://npm.im/pino). |

