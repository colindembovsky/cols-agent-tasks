# Colin's ALM Corner Build Tasks - Replace Tokens

![Replace Tokens Task](../../images/ss_replaceTokens.png)

## Overview
This task invokes replaces tokens in a file, in multiple paths, with values from the matching variables set in the Environment.

## Settings
The task requires the following settings:

1. **Target File**: path(s) to the file that contains the tokens. Multiple paths are seperated by a ';'
1. **Token Regex**: a RegEx to find the tokens. Must include a group selector. This defaults to `__(\w+)__`. This
will match tokens that have double-underscore `__` prefix and postfix (e.g. `__MyVar__`).

## Environment Variables
The environment variables should use the name of the token without the token identifiers. They can be
defined in the Release (global - applies to all Environments) or in an Environment (in the variables
set for the Environment).

## Example:
Imagine you have a file with the following contents:
```
<?xml version="1.0" encoding="utf-8"?>
<parameters>
  <setParameter name="IIS Web Application Name" value="__SiteName__" />
</parameters>  
```

This file contains a token called "SiteName".

Drop the Task into the build or release, and then set the Target File to the path(s) where the file is. Then set
a global variable or an environment variable called "SiteName" and give it the value you want the token to be
replaced with. That's it!

## Different Token Identifiers
If your tokens have a different identifier, then you can change the Token Regex. For example, if your tokens
are of the form `--Token--`, then you can change the Regex to `--(\w+)--` and the task will work.

## Gotchas
1. Existing environment variables.

    Be aware that there may be some existing environment variables on the build/release agent. For example
`Username` is set to the identity that the agent is running under. In order to avoid conflicts, you should
ensure that any tokens have a unique name. `WebUsername` is a better token than `Username` for this reason.
You can see all the environment variables in the logs for a deployment.

1. Secrets

    Since the native [vso-task-lib](https://github.com/Microsoft/vsts-task-lib) does not support secrets for 
    Node (it does for PowerShell) there is a hack that allows you to specify secrets as an advanced parameter.
    You specify them in key-value pairs (with the key being the name and the value being the secret variable) 
    and can use a semi-colon to separate them:
    
    ```
    key1:$(secret1);key2:$(secret2)
    ```
    
    Hopefully [this issue](https://github.com/Microsoft/vsts-task-lib/issues/48) will be implemented and I can 
    remove this "hack" - thanks to [Di](https://github.com/dixu99) for the contribution!

## Using Tokenizer with ReplaceTokens
It is expected that this combination will be used for DotNet Core applications. You will likely want to tokenize the appsettings.json file during the build and then use the ReplaceTokens task to fill in
values during the Release. This is possible, but you will need to change the defaults for the ReplaceTokens task in order to work with
the json "namespaces". The following process will get you going:

1. Use the [Tokenizer](../Tokenizer) to tokenize the appsettings.json file as described above.
2. On the Release, enter the name of the tokens but substitute an `_` (underscore) for the `.` (period). Using the above example, you'd need three environment
variables: `ConnectionStrings_DefaultConnection`, `Tricky_Gollum` and `Tricky_Hobbit`.
3. On the Release, add a ReplaceTokens task and change the default Token Regex parameter to `__(\w+[\.\w+]*)__`
