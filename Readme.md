# nixconfig
<a id="nixconfig"></a>

*nixconfig* is a configuration loader. It loads configuration from a set of
well defined, traditional, paths. On non-win32 platforms the paths are:

+ `/etc/`
+ `/etc/appname/`
+ `~/`
+ `~/.appname/`
+ `~/.config/appname`
+ `~/Application Support/Preferences/appname` (only on the Darwin platform)

On win32 platforms, the paths are:

+ `~/AppData/Local/appname`

Where `appname` is the name within your application's
`package.json` file.

On all platforms, it is possible to append a path by setting a
`nixconfig_config_home` environment variable, e.g.
`nixconfig_config_home=/tmp/testing node app.js`.

## Example

```js
const nixconfig = require('nixconfig')()
console.log(nixconfig.get('foo')) // "bar" for {foo: 'bar'}
console.log(nixconfig.get('foo.bar')) // "baz" for {foo: {bar: 'baz'}}
```

## Config Loading
<a id="loading"></a>

When an instance of *nixconfig* is created, it will iterate the list of paths
noted in [the introduction](#nixconfig) in order from top to bottom. Within each
path it will run a set of configured [loaders](#loaders) to load the files
within that path. For example, for an application named "foobar" the JSON loader
will attempt to load `/etc/foobar.json` and `/etc/foobar/foobar.json` and so on.
The values within `/etc/foobar/foobar.json` will overwrite the same values
loaded from `/etc/foobar.json`.

**Important:** this depends on your `package.json` containing a `name` property.

## Loaders
<a id="loaders"></a>

*nixconfig* ships with three loader types:

+ JavaScript
+ JSON
+ Environment

A loader is merely a function that returns a standard JavaScript object. Loaders
are named by the extension they match or an artibtrary name if they do not
process files. Thus, the default set of loaders is defined:

```js
const loaders = {
  '.js': require,
  '.json': require,
  '~env': () => {}
}
```

Notice that loaders which do not process files are prefixed with a `~`.

Loaders are processed in the order they are defined. Thus, without adding any
other loaders, the default processing order for *nixconfig* is to load JavaScript
files first, JSON second, and environment variables last.

It is possible to add custom loaders:

```js
const nixconfig = require('nixconfig')({
  loaders: [
    {ext: '.yaml', method: (file) => {
      // the full path to the file to load is supplied, e.g.
      // `file = '/etc/foobar.yaml'`
    }},
    {ext: '~notAFile', method: () => {
      // no parameter is passed
    }}
  ]
})
```

Custom loaders will be appended to the standard set of loaders. All file
loaders are processed prior to all non-file loaders.

### Environment Loader

The environment loader looks for environment variables prefixed with either
`nixconfig_` or the value of `nixconfigPrefix` with the application's
`package.json`. Thus, the environment variable `nixconfig_foo=bar` would
result in `console.log( nixconfig.get('foo') ) // 'bar'`.

The environment loader also supports setting deeply nested variables. To do so,
simply separate the object path properties with `__`. For example,
`nixconfig_foo__bar=foobar` would result in
`console.log( nixconfig.get('foo.bar') ) // 'foobar'`.

## API
<a id="api"></a>

The full API is documented in the [API document](api.md).

### Configuration

For the environment loader, you must set `nixconfigPrefix` in your `package.json`.
For example:

```json
{
  "name": "cool-app",
  "nixconfigPrefix": "coolapp_"
}
```

Otherwise the prefix will be `nixconfig_`.

For general configuration, an object may be supplied to the exported
factory function:

```js
{
  delim: '.', // String path delimeter for the `get` and `set` methods.
  logger: {}, // A log4j API compliant logger like https://npm.im/pino (null logger by default).
  loaders: [], // An array of loader objects: `{ext: '.foo', method: (file) => {}}`.
  initialConfig: {} // Defaults to use if no configuration files are found.
}
```

The `loaders` property may also be an object wherein the keys are the extensions
and the values are the associated methods.

## License

[MIT License](http://jsumners.mit-license.org/)
