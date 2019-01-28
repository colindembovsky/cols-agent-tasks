# Colin's ALM Corner Build Tasks - Tokenizer

![Tokenizer Task](../../images/ss_tokenize.png)

## Overview
This task injects tokens into a file. For now, only JSON files are supported. The tokens are prefixed and postfixed with `__` (double underscore).
They use the full path of the value as the token name - see the example below for more detail.

## YAML
```yaml
steps:
- task: colinsalmcorner.colinsalmcorner-buildtasksbeta.tokenizer-task.JSONTokenizer@1
  displayName: 'Tokenize file(s)'
  inputs:
    sourcePath: src/MyProject/  # source path to search
    filePattern: '**/appsettings.json'  # file pattern (glob) to match in source path
    tokenizeType: Json  # only type available currently
    includes: 'ConnectionStrings.DefaultConnection'  # comma-separated list of values to tokenize
    # excludes: 'values,to,exclude'    # comma-separated list of values to NOT tokenize
    # nullBehavior: warning   # 'warning' or 'error' for null properties
```

## Settings
The task requires the following settings:

1. **Source path**: path to the folder that contains the files for tokenizing.
1. **File Pattern**: minimatch supported filter for file(s).
1. **Tokenize Type**: JSON is the only supported type currently.
1. **Includes**: Comma-separated list of properties to include. Use this to only tokenize a small number of values.
1. **Excludes**: Comma-separated list of properties to exclude. Use this to excluse a small number of values.

## Includes and Excludes
If both Includes and Excludes is empty, then all values will be tokenized. If you wish to only tokenize a small subset of values,
then specify the full path for the values you want to tokenize. Similarly, use Excludes to exclude a small subset of values.

The "path" for the Includes and Excludes is the full JSON path in the file. For example, if the file is:

```JSON
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=aspnet-WebApplication1-26e8893e-d7c0-4fc6-8aab-29b59971d622;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "Tricky": {
    "Gollum": "Smeagol",
    "Hobbit": "Frodo"
  },
  "Logging": {
    "IncludeScopes": false,
    "LogLevel": {
      "Default": "Debug",
      "System": "Information",
      "Microsoft": "Information"
    }
  }
}
```
and you wanted to just replace the DefaultConnection and the Tricky Gollum and Hobbit values, then Includes would need to be

```
ConnectionStrings.DefaultConnection,Tricky.Gollum,Tricky.Hobbit
```

After tokenization, the file would appear as follows:
```JSON
{
  "ConnectionStrings": {
    "DefaultConnection": "__ConnectionStrings.DefaultConnection__"
  },
  "Tricky": {
    "Gollum": "__Tricky.Gollum__",
    "Hobbit": "__Tricky.Hobbit__"
  },
  "Logging": {
    "IncludeScopes": false,
    "LogLevel": {
      "Default": "Debug",
      "System": "Information",
      "Microsoft": "Information"
    }
  }
}
```

### Arrays
Arrays are replaced according to the following rule: if it is an array of primitives (strings etc.) then replace the values in the array with a single variable name. If it is a complex array (objects) then iterate into the object. For example:

```js
{
  "defaultAssembly": "WebApi",
  "modules": [
    {
      "type": "WebApi.Infrastucture.ContainerModules.DataModule, WebApi",
      "parameters": {
        "connectionString": "",
        "defaultSchema": ""
      }
    },
    {
      "type": "WebApi.Infrastucture.ContainerModules.MediatorModule, WebApi"
    }
  ],
  "Auth": {
    "ClientSecret": "",
    "ValidAudiences": [
      ""
    ],
    "ConnectionStringKVSecretName": ""
  }
}
```
becomes
```js
{
  "defaultAssembly": "__defaultAssembly__",
  "modules": [
    {
      "type": "__modules[0].type__",
      "parameters": {
        "connectionString": "__modules[0].parameters.connectionString__",
        "defaultSchema": "__modules[0].parameters.defaultSchema__"
      }
    },
    {
      "type": "__modules[1].type__"
    }
  ],
  "Auth": {
    "ClientSecret": "__Auth.ClientSecret__",
    "ValidAudiences": [
      "__Auth.ValidAudiences__"
    ],
    "ConnectionStringKVSecretName": "__Auth.ConnectionStringKVSecretName__"
  }
}
```
> **Note:** In this example, `modules[]` is a complex array since it contains complex objects, while `Auth.ValidAudiences[]` is a primitive array (containing strings).

## Using Tokenizer with ReplaceTokens
It is expected that this combination will be used for DotNet Core applications. You will likely want to tokenize the appsettings.json file during the build and then use the [ReplaceTokens](../ReplaceTokens) task to fill in
values during the Release. This is possible, but you will need to change the defaults for the ReplaceTokens task in order to work with
the json "namespaces". The following process will get you going:

1. Use the Tokenizer to tokenize the appsettings.json file as described above.
2. On the Release, enter the name of the tokens but substitute an `_` (underscore) for the `.` (period). Using the above example, you'd need three environment
variables: `ConnectionStrings_DefaultConnection`, `Tricky_Gollum` and `Tricky_Hobbit`.
3. On the Release, add a ReplaceTokens task and change the default Token Regex parameter to `__(\w+[\.\w+]+(\[\])?)__`
4. If you have array entries, the token will be suffixed with `[]` (for example `__Client.ValidAudiences[]__`). In this case, the variable you should define when doing replacement would be the name _without the brackets_: in this case `Client_ValidAudiences`. The value of this variable should be a comma-separated list and will be expanded appropriately (i.e. if your variable value is `a,b` then the value injected will be `"a","b"`).

> **Note:** Though you can tokenize int arrays, the ReplaceTokens task can only replace string arrays.