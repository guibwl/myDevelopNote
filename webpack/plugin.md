### Plugin 学习笔记

##### 问题：
1. 生命周期？
2. 作用及职责？
3. 如何写一个插件？

##### 概念：
webpack itself is built on the same plugin system. 'loaders' transform certain types of modules, 'plugins' can be leveraged to perform a wider range of tasks(bundle optimization, asset management, injection environment variables, and more...).

##### 使用：
`require()` it and add it to the plugins array. plugins can be customizable through options. create an instance of it by calling it with the new operator.

示例：
webpack.config.js
```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```
`html-webpack-plugin` generates an HTML file and injecting all bundles.

- [Plugin list](https://webpack.js.org/plugins/)
- [Use cases](https://webpack.js.org/concepts/plugins/)

> 兼容性：
supports all browsers that are ES5-compliant (IE8 and below are not supported). webpack needs Promise for import() and require.ensure().
below will need to load a [polyfill](https://webpack.js.org/guides/shimming/) before using these expressions.

> 运行环境：
webpack runs on Node.js version 8.x and higher.

### Plugin 剖析
Plugin is JS object has apply method. Apply method called by webpack compiler, giving access to entire compilation lifecycle.

简单示例：

ConsoleLogOnBuildWebpackPlugin.js

```js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, compilation => {
      console.log('The webpack build process is starting!!!');
    });
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

The first parameter of the tap method should be a camelized version of the plugin name.

使用 Node API：

Pass plugins via the plugins property in the configuration.


```js
const webpack = require('webpack'); //to access webpack runtime
const configuration = require('./webpack.config.js');

let compiler = webpack(configuration);

new webpack.ProgressPlugin().apply(compiler);

compiler.run(function(err, stats) {
  // ...
});
```

### Compiler Hooks

Compiler module is engine creates compilation. It extends the Tapable class in order to register and call plugins.

To learn each hook. search for `hooks.<hook name>.call` across the webpack source.

#### Watching
The Compiler supports monitors files and recompiles files change. Compiler will emit events such as watchRun, watchClose, and invalid. This is typically used in development, usually under the hood of tools like webpack-dev-server.Watch mode can also be entered via the CLI.

#### Hooks
 Lifecycle hooks exposed by compiler, like below:
```js
compiler.hooks.someHook.tap('MyPlugin', (params) => {
  /* ... */
});
```

Depending on the hook type, tapAsync and tapPromise may also be available.
For the description of hook types, see [the Tapable docs](https://github.com/webpack/tapable#tapable).


##### entryOption
`SyncBailHook`
Called after the entry configuration from webpack options has been processed.

```js
compiler.hooks.entryOption.tap('MyPlugin', (context, entry) => {
  /* ... */
});
```
parameters:
* `context` absolute path from entry.
* `entry`  where to start the application bundling process.

##### afterPlugins
`SyncBailHook`
Called after setting up initial set of internal plugins.
Parameters: `compiler`

##### afterResolvers
`SyncBailHook`
Triggered after resolver setup is complete.
Parameters: `compiler`

##### environment
`SyncBailHook`
Called while preparing the compiler environment, right after initializing the plugins.

##### afterEnvironment
`SyncBailHook`
Compiler environment setup is complete.

##### beforeRun
`AsyncSeriesHook`
Adds a hook right before running the compiler.
Parameters: `compiler`

##### additionalPass
`AsyncSeriesHook`
Do one more additional pass of the build.

##### run
`AsyncSeriesHook`
Hook into the compiler before it begins reading records.
Parameters: `compiler`

##### watchRun
`AsyncSeriesHook`
Executes a plugin during watch mode after a new compilation is triggered but before the compilation is actually started.
Parameters: `compiler`

##### normalModuleFactory
`SyncBailHook`
Called after a NormalModuleFactory is created.
Parameters: `normalModuleFactory`

##### contextModuleFactory
`SyncBailHook`
Runs a plugin after a ContextModuleFactory is created.
Parameters: `contextModuleFactory`

##### initialize
`SyncBailHook`
Called when a compiler object is initialized.

##### beforeCompile
`AsyncSeriesHook`
Executes a plugin after compilation parameters are created.
Parameters: `compilationParams`

```js
compilationParams = {
  normalModuleFactory,
  contextModuleFactory,
};
```
This hook can be used to add/modify the compilation parameters:

```js
compiler.hooks.beforeCompile.tapAsync('MyPlugin', (params, callback) => {
  params['MyPlugin - data'] = 'important stuff my plugin will use later';
  callback();
});
```

##### compile
`SyncBailHook`
After beforeCompile, before a new compilation is created.
Parameters: `compilationParams`

##### thisCompilation
`SyncBailHook`
initializing compilation, before emitting compilation event.
Parameters: `compilation`, `compilationParams`

##### compilation
`SyncBailHook`
Runs a plugin after a compilation has been created.
Parameters: `compilation`, `compilationParams`

##### make
`AsyncParallelHook`
Executed before finishing the compilation.
Parameters: `compilation`

##### afterCompile
`AsyncSeriesHook`
Called after finishing and sealing the compilation.
Parameters: `compilation`

##### shouldEmit
`SyncBailHook`
Before emitting assets. Should return a boolean telling whether to emit.
Parameters: `compilation`
```js
compiler.hooks.shouldEmit.tap('MyPlugin', (compilation) => {
  // return true to emit the output, otherwise false
  return true;
});
```

##### emit
`AsyncSeriesHook`
Before emitting assets output.
Parameters: `compilation`

##### afterEmit
`AsyncSeriesHook`
After emitting assets output.
Parameters: `compilation`

##### assetEmitted
`AsyncSeriesHook`
Provides access to information about the emitted asset, such as its output path and byte content.
Parameters: `file`, `info`
```js
compiler.hooks.assetEmitted.tap(
  'MyPlugin',
  (file, { content, source, outputPath, compilation, targetPath }) => {
    console.log(content); // <Buffer 66 6f 6f 62 61 72>
  }
);
```

##### done
`AsyncSeriesHook`
Compilation completed.
Parameters: `stats`

##### failed
`SyncHook`
Compilation fails.
Parameters: error

##### invalid
`SyncHook`
Executed when a watching compilation has been invalidated.
Parameters: `fileName`, `changeTime`

##### watchClose
`SyncHook`
watching compilation has stopped.

##### infrastructureLog
`SyncBailHook`
Allows to use infrastructure logging when enabled in the configuration via infrastructureLogging option.
Parameters: `name`, `type`, `args`

##### log
`SyncBailHook`
Allows to log into stats when enabled, see stats.logging, stats.loggingDebug and stats.loggingTrace options.
Parameters: `origin`, `logEntry`

### Compilation Hooks

The Compilation module is used by the Compiler to create new compilations (or builds). A compilation instance has access to all modules and their dependencies (most of which are circular references). It is the literal compilation of all the modules in the dependency graph of an application. During the compilation phase, modules are loaded, sealed, optimized, chunked, hashed and restored.

The Compilation class also extends Tapable and provides the following lifecycle hooks. They can be tapped the same way as compiler hooks.

##### buildModule
`SyncHook`
Triggered before a module build has started, can be used to modify the module.
Parameters: `module`
```js
compilation.hooks.buildModule.tap('SourceMapDevToolModuleOptionsPlugin',
  module => {
    module.useSourceMap = true;
  }
);
```

##### rebuildModule
`SyncHook`
Fired before rebuilding a module.
Parameters: `module`

##### failedModule
`SyncHook`
Run when a module build has failed.
Parameters: `module` `error`

##### succeedModule
`SyncHook`
Module built successfully.
Parameters: `module`

##### finishModules
`AsyncSeriesHook`
All modules have been built without errors.
Parameters: `modules`

##### finishRebuildingModule
`SyncHook`
Executed when a module has been rebuilt, in case of both success or with errors.
Parameters: `module`

##### seal
`SyncHook`
Compilation stops accepting new modules.

##### unseal
`SyncHook`
Compilation begins accepting new modules.

##### optimizeDependencies
`SyncBailHook`
Beginning of dependency optimization.
Parameters: `modules`

##### afterOptimizeDependencies
`SyncHook`
After the dependency optimization.
Parameters: `modules`

##### optimize
`SyncHook`
Beginning of the optimization phase.

##### optimizeModules
`SyncBailHook`
Called at the beginning of the module optimization phase. A plugin can tap into this hook to perform optimizations on modules.
Parameters: `modules`

##### afterOptimizeModules
`SyncHook`
Called after modules optimization has completed.
Parameters: `modules`

##### optimizeChunks
`SyncBailHook`
Called at the beginning of the chunk optimization phase. A plugin can tap into this hook to perform optimizations on chunks.
Parameters: `chunks`

##### afterOptimizeChunks
`SyncHook`
After chunk optimization completed.
Parameters: `chunks`

##### optimizeTree
`AsyncSeriesHook`
Called before optimizing the dependency tree. A plugin can tap into this hook to perform a dependency tree optimization.
Parameters: `chunks` `modules`

##### afterOptimizeTree
`SyncHook`
Dependency tree optimization completed with success.
Parameters: `chunks` `modules`

##### optimizeChunkModules
`SyncBailHook`
Called after the tree optimization, at the beginning of the chunk modules optimization. A plugin can tap into this hook to perform optimizations of chunk modules.
Parameters: `chunks` `modules`

##### afterOptimizeChunkModules
`SyncHook`
ChunkModules optimization has completed successfully.
Parameters: `chunks` `modules`

##### shouldRecord
`SyncBailHook`
Called to determine whether or not to store records. Returning anything !== false will prevent every other "record" hook from being executed (*record*, *recordModules*, *recordChunks* and *recordHash*).

##### reviveModules
`SyncHook`
Restore module information from records.
Parameters: `modules` `records`

##### beforeModuleIds
`SyncHook`
Executed before assigning an 'id' to each module.
Parameters: `modules`

##### moduleIds
`SyncHook`
Executed assign an id to each module.
Parameters: `modules`

##### optimizeModuleIds
`SyncHook`
Called at the beginning of the modules id optimization.
Parameters: `modules`

##### afterOptimizeModuleIds
`SyncHook`
Called when the modules id optimization phase has completed.
Parameters: `modules`

##### reviveChunks
`SyncHook`
Restore chunk information from records.
Parameters: `chunks` `records`

##### beforeChunkIds
`SyncHook`
Before assigning an id to each chunk.
Parameters: `chunks`

##### chunkIds
`SyncHook`
Called to assign an id to each chunk.
Parameters: `chunks`

##### optimizeChunkIds
`SyncHook`
Called at the beginning of the chunks id optimization phase.
Parameters: `chunks`

##### afterOptimizeChunkIds
`SyncHook`
Triggered after chunk id optimization has finished.
Parameters: `chunks`

##### recordModules
`SyncHook`
Store module info to the records. This is triggered if shouldRecord returns a truthy value.
Parameters: `modules` `records`

##### recordChunks
`SyncHook`
Store chunk info to the records. This is only triggered if shouldRecord returns a truthy value.
Parameters: `chunks` `records`

##### beforeHash
`SyncHook`
Before the compilation is hashed.

##### afterHash
`SyncHook`
After the compilation is hashed.

##### recordHash
`SyncHook`
Store information about record hash to the records. This is only triggered if shouldRecord returns a truthy value.
Parameters: `records`

##### record
`SyncHook`
Store information about the compilation to the records. This is only triggered if shouldRecord returns a truthy value.
Parameters: `compilation` `records`

##### beforeModuleAssets
`SyncHook`
Executed before module assets creation.

##### shouldGenerateChunkAssets
`SyncBailHook`
Called to determine whether or not generate chunks assets. Returning anything !== false will allow chunk assets generation.

##### beforeChunkAssets
`SyncHook`
Executed before creating the chunks assets.

##### additionalAssets
`AsyncSeriesHook`
Create additional assets for the compilation. This hook can be used to download an image, for example:

```js
compilation.hooks.additionalAssets.tapAsync('MyPlugin', callback => {
  download('https://img.shields.io/npm/v/webpack.svg', function(resp) {
    if(resp.status === 200) {
      compilation.assets['webpack-version.svg'] = toAsset(resp);
      callback();
    } else {
      callback(new Error('[webpack-example-plugin] Unable to download the image'));
    }
  });
});
```

##### optimizeAssets
`AsyncSeriesHook`
Optimize all assets stored in 'compilation.assets'.
Parameters: `assets`

##### afterOptimizeAssets
`SyncHook`
The assets have been optimized.
Parameters: `assets`

##### processAssets
`AsyncSeriesHook`
Asset processing.
Parameters: `assets`
```js
compilation.hooks.processAssets.tap(
  {
    name: 'MyPlugin',
    stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
  },
  (assets) => {
    // code here
  }
);
```

- PROCESS_ASSETS_STAGE_ADDITIONAL - Add additional assets to the compilation.
- PROCESS_ASSETS_STAGE_PRE_PROCESS - Basic preprocessing of the assets.
- PROCESS_ASSETS_STAGE_DERIVED - Derive new assets from the existing assets.
- PROCESS_ASSETS_STAGE_ADDITIONS - Add additional sections to the existing assets e.g. banner or initialization code.
- PROCESS_ASSETS_STAGE_OPTIMIZE - Optimize existing assets in a general way.
- PROCESS_ASSETS_STAGE_OPTIMIZE_COUNT - Optimize the count of existing assets, e.g. by merging them.
- PROCESS_ASSETS_STAGE_OPTIMIZE_COMPATIBILITY - Optimize the compatibility of existing assets, e.g. add polyfills or vendor prefixes.
- PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE - Optimize the size of existing assets, e.g. by minimizing or omitting whitespace.
- PROCESS_ASSETS_STAGE_SUMMARIZE - Summarize the list of existing assets.
- PROCESS_ASSETS_STAGE_DEV_TOOLING - Add development tooling to the assets, e.g. by extracting a source map.
- PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER - Optimize the transfer of existing assets, e.g. by preparing a compressed (gzip) file as separate asset.
- PROCESS_ASSETS_STAGE_ANALYSE - Analyze the existing assets.
- PROCESS_ASSETS_STAGE_REPORT - Creating assets for the reporting purposes.

##### afterProcessAssets
`SyncHook`
Called after the *processAssets* hook had finished without error.

##### needAdditionalSeal
`SyncBailHook`
Called to determine if the compilation needs to be unsealed to include other files.

##### afterSeal
`AsyncSeriesHook`
Executed right after *needAdditionalSeal*.

##### chunkHash
`SyncHook`
Triggered to emit the hash for each chunk.
Parameters: `chunk` `chunkHash`

##### moduleAsset
`SyncHook`
Called when an asset from a module was added to the compilation.
Parameters: `module` `filename`

##### chunkAsset
`SyncHook`
Triggered when an asset from a chunk was added to the compilation.
Parameters: `chunk` `filename`

##### assetPath
`SyncWaterfallHook`
Determine the path of an asset.
Parameters: `path` `options`

##### needAdditionalPass
`SyncBailHook`
Determine if an asset needs to be processed further after being emitted.

##### childCompiler
`SyncHook`
After setting up a child compiler.
Parameters: `childCompiler` `compilerName` `compilerIndex`

##### normalModuleLoader
Since webpack v5 *normalModuleLoader* hook was removed. Now to access the loader use *'NormalModule.getCompilationHooks(compilation).loader'* instead.

### JavascriptParser Hooks

The parser instance, found in the compiler, is used to parse each module being processed by webpack. The parser is yet another webpack class that extends tapable and provides a variety of tapable hooks that can be used by plugin authors to customize the parsing process.

The parser is found within module factories and therefore takes little more work to access:

```js
compiler.hooks.normalModuleFactory.tap('MyPlugin', factory => {
  factory.hooks.parser.for('javascript/auto').tap('MyPlugin', (parser, options) => {
    parser.hooks.someHook.tap(/* ... */);
  });
});
```

#### Hooks

The following lifecycle hooks are exposed by the parser and can be accessed as such:

##### evaluateTypeof
`SyncBailHook`
Triggered when evaluating an expression consisting in a `typeof` of a free variable
- Hook Parameters: `identifier`
- Callback Parameters: `expression`
```js
parser.hooks.evaluateTypeof.for('myIdentifier').tap('MyPlugin', expression => {
  /* ... */
  return expressionResult;
});
```
trigger:
```js
const a = typeof myIdentifier;
```
won't:
```js
const myIdentifier = 0;
const b = typeof myIdentifier;
```

##### evaluate
`SyncBailHook`
Called when evaluating an expression.
- Hook parameters: `expressionType`
- Callback parameters: `expression`

index.js:
```js
const a = new String();
```
MyPlugin.js:
```js
parser.hooks.evaluate.for('NewExpression').tap('MyPlugin', expression => {
  /* ... */
  return expressionResult;
});
```
expressions types:
- 'ArrowFunctionExpression'
- 'AssignmentExpression'
- 'AwaitExpression'
- 'BinaryExpression'
- 'CallExpression'
- 'ClassExpression'
- 'ConditionalExpression'
- 'FunctionExpression'
- 'Identifier'
- 'LogicalExpression'
- 'MemberExpression'
- 'NewExpression'
- 'ObjectExpression'
- 'SequenceExpression'
- 'SpreadElement'
- 'TaggedTemplateExpression'
- 'TemplateLiteral'
- 'ThisExpression'
- 'UnaryExpression'
- 'UpdateExpression'

##### evaluateIdentifier
`SyncBailHook`
Called when evaluating an identifier that is a free variable.
- Hook Parameters: `identifier`
- Callback Parameters: `expression`

##### evaluateDefinedIdentifier
`SyncBailHook`
Called when evaluating an identifier that is a defined variable.
- Hook Parameters: `identifier`
- Callback Parameters: `expression`

##### evaluateCallExpressionMember
`SyncBailHook`
Called when evaluating a call to a member function of a successfully evaluated expression.

- Hook Parameters: `identifier`
- Callback Parameters: `expression` `param`

index.js:
```js
const a = expression.myFunc();
```
MyPlugin.js:
```js
parser.hooks.evaluateCallExpressionMember.for('myFunc').tap('MyPlugin', (expression, param) => {
  /* ... */
  return expressionResult;
});
```

##### statement
`SyncBailHook`
General purpose hook that is called for every parsed statement in a code fragment.

- Callback Parameters: `statement`
```js
parser.hooks.statement.tap('MyPlugin', statement => { /* ... */ });
```
statement.type:
- 'BlockStatement'
- 'VariableDeclaration'
- 'FunctionDeclaration'
- 'ReturnStatement'
- 'ClassDeclaration'
- 'ExpressionStatement'
- 'ImportDeclaration'
- 'ExportAllDeclaration'
- 'ExportDefaultDeclaration'
- 'ExportNamedDeclaration'
- 'IfStatement'
- 'SwitchStatement'
- 'ForInStatement'
- 'ForOfStatement'
- 'ForStatement'
- 'WhileStatement'
- 'DoWhileStatement'
- 'ThrowStatement'
- 'TryStatement'
- 'LabeledStatement'
- 'WithStatement'

##### statementIf
`SyncBailHook`
Called when parsing an if statement. Same as the statement hook, but triggered only when `statement.type == 'IfStatement'`.
Callback Parameters: `statement`

##### label
`SyncBailHook`
Called when parsing statements with a label. Those statements have statement.type === 'LabeledStatement'.

Hook Parameters: `labelName`
Callback Parameters: `statement`

##### import
`SyncBailHook`
Called for every import statement in a code fragment. The source parameter contains the name of the imported file.
Callback Parameters: `statement` `source`
index.js
```js
import _ from 'lodash';
```
MyPlugin.js
```js
parser.hooks.import.tap('MyPlugin', (statement, source) => {
  // source == 'lodash'
});
```

##### importSpecifier
`SyncBailHook`
Called for every specifier of every import statement.
Callback Parameters: `statement` `source` `exportName` `identifierName`

index.js:
```js
import _, { has } from 'lodash';
```
MyPlugin.js:
```js
parser.hooks.importSpecifier.tap('MyPlugin', (statement, source, exportName, identifierName) => {
  /* First call
    source == 'lodash'
    exportName == 'default'
    identifierName == '_'
  */
  /* Second call
    source == 'lodash'
    exportName == 'has'
    identifierName == 'has'
  */
});
```

##### export
`SyncBailHook`
Called for every export statement in a code fragment.
Callback Parameters: `statement`

##### exportImport
`SyncBailHook`
Called for every export-import statement eg: `export * from 'otherModule';`.
Callback Parameters: `statement` `source`

##### exportDeclaration
`SyncBailHook`
Called for every `export` statement exporting a declaration.
Callback Parameters: `statement` `declaration`
```js
export const myVar = 'hello'; // also var, let
export function FunctionName(){}
export class ClassName {}
```

##### exportExpression
`SyncBailHook`
Called for every `export` statement exporting an expression e.g.`export default expression;`.
Callback Parameters: `statement` `identifierName` `exportName` `index`

##### exportImportSpecifier
`SyncBailHook`
Called for every specifier of every export-import statement.
Callback Parameters: `statement` `source` `identifierName` `exportName` `index`

##### varDeclaration
`SyncBailHook`
Called when parsing a variable declaration.
Callback Parameters: `declaration`

##### varDeclarationLet
`SyncBailHook`
Called when parsing a variable declaration defined using `let`
Callback Parameters: `declaration`

##### varDeclarationConst
`SyncBailHook`
Called when parsing a variable declaration defined using `const`
Callback Parameters: `declaration`

##### varDeclarationVar
`SyncBailHook`
Called when parsing a variable declaration defined using `var`
Callback Parameters: `declaration`

##### canRename
`SyncBailHook`
Triggered before renaming an identifier to determine if the renaming is allowed. This is usually used together with the `rename` hook.

- Hook Parameters: `identifier`
- Callback Parameters: `expression`
```js
var a = b;

parser.hooks.canRename.for('b').tap('MyPlugin', expression => {
  // returning true allows renaming
  return true;
});
```

##### rename
`SyncBailHook`
Triggered when renaming to get the new identifier. This hook will be called only if `canRename` returns `true`.

- Hook Parameters: `identifier`
- Callback Parameters: `expression`
```js
var a = b;

parser.hooks.rename.for('b').tap('MyPlugin', expression => {});
```

##### assigned
`SyncBailHook`
Called when parsing an `AssignmentExpression` before parsing the assigned expression.

- Hook Parameters: `identifier`
- Callback Parameters: `expression`
```js
a += b;

parser.hooks.assigned.for('a').tap('MyPlugin', expression => {
  // this is called before parsing b
});
```

##### assign
`SyncBailHook`
Called when parsing an `AssignmentExpression` before parsing the assign expression.

- Hook Parameters: `identifier`
- Callback Parameters: `expression`
```js
a += b;

parser.hooks.assigned.for('a').tap('MyPlugin', expression => {
  // this is called before parsing a
});
```

##### typeof
`SyncBailHook`
Triggered when parsing the `typeof` of an identifier

- Hook Parameters: `identifier`
- Callback Parameters: `expression`

##### call
`SyncBailHook`
Called when parsing a function call.

- Hook Parameters: `identifier`
- Callback Parameters: `expression`
```js
eval(/* something */);

parser.hooks.call.for('eval').tap('MyPlugin', expression => {});
```

##### callAnyMember
`SyncBailHook`
Triggered when parsing a call to a member function of an object.

- Hook Parameters: `objectIdentifier`
- Callback Parameters: `expression`
```js
myObj.anyFunc();

parser.hooks.callAnyMember.for('myObj').tap('MyPlugin', expression => {});
```

##### new
`SyncBailHook`
Invoked when parsing a `new` expression.

- Hook Parameters: `identifier`
- Callback Parameters: `expression`
```js
new MyClass();

parser.hooks.new.for('MyClass').tap('MyPlugin', expression => {});
```

##### expression
`SyncBailHook`
Called when parsing an expression.

- Hook Parameters: `identifier`
- Callback Parameters: `expression`

```js
const a = this;

parser.hooks.expression.for('this').tap('MyPlugin', expression => {});
```

##### expressionAnyMember
`SyncBailHook`
Executed when parsing a `MemberExpression`.

Hook Parameters: `identifier`
Callback Parameters: `expression`

```js
const a = process.env;

parser.hooks.new.for('process').tap('MyPlugin', expression => {});
```

##### expressionConditionalOperator
`SyncBailHook`
Called when parsing a `ConditionalExpression` e.g. `condition ? a : b`

Callback Parameters: `expression`


##### program
`SyncBailHook`
Get access to the abstract syntax tree (AST) of a code fragment

Parameters: `ast` `comments`

