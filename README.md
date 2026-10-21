tomodoro
=================

A new CLI generated with oclif


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/tomodoro.svg)](https://npmjs.org/package/tomodoro)
[![Downloads/week](https://img.shields.io/npm/dw/tomodoro.svg)](https://npmjs.org/package/tomodoro)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g tomodoro
$ tomodoro COMMAND
running command...
$ tomodoro (--version)
tomodoro/0.0.0 linux-x64 node-v24.22.0
$ tomodoro --help [COMMAND]
USAGE
  $ tomodoro COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`tomodoro help [COMMAND]`](#tomodoro-help-command)
* [`tomodoro plugins`](#tomodoro-plugins)
* [`tomodoro plugins add PLUGIN`](#tomodoro-plugins-add-plugin)
* [`tomodoro plugins:inspect PLUGIN...`](#tomodoro-pluginsinspect-plugin)
* [`tomodoro plugins install PLUGIN`](#tomodoro-plugins-install-plugin)
* [`tomodoro plugins link PATH`](#tomodoro-plugins-link-path)
* [`tomodoro plugins remove [PLUGIN]`](#tomodoro-plugins-remove-plugin)
* [`tomodoro plugins reset`](#tomodoro-plugins-reset)
* [`tomodoro plugins uninstall [PLUGIN]`](#tomodoro-plugins-uninstall-plugin)
* [`tomodoro plugins unlink [PLUGIN]`](#tomodoro-plugins-unlink-plugin)
* [`tomodoro plugins update`](#tomodoro-plugins-update)
* [`tomodoro start`](#tomodoro-start)

## `tomodoro help [COMMAND]`

Display help for tomodoro.

```
USAGE
  $ tomodoro help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for tomodoro.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/6.3.0/src/commands/help.ts)_

## `tomodoro plugins`

List installed plugins.

```
USAGE
  $ tomodoro plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ tomodoro plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.5.2/src/commands/plugins/index.ts)_

## `tomodoro plugins add PLUGIN`

Installs a plugin into tomodoro.

```
USAGE
  $ tomodoro plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into tomodoro.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the TOMODORO_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the TOMODORO_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ tomodoro plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ tomodoro plugins add myplugin

  Install a plugin from a github url.

    $ tomodoro plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ tomodoro plugins add someuser/someplugin
```

## `tomodoro plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ tomodoro plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ tomodoro plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.5.2/src/commands/plugins/inspect.ts)_

## `tomodoro plugins install PLUGIN`

Installs a plugin into tomodoro.

```
USAGE
  $ tomodoro plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into tomodoro.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the TOMODORO_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the TOMODORO_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ tomodoro plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ tomodoro plugins install myplugin

  Install a plugin from a github url.

    $ tomodoro plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ tomodoro plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.5.2/src/commands/plugins/install.ts)_

## `tomodoro plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ tomodoro plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ tomodoro plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.5.2/src/commands/plugins/link.ts)_

## `tomodoro plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ tomodoro plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ tomodoro plugins unlink
  $ tomodoro plugins remove

EXAMPLES
  $ tomodoro plugins remove myplugin
```

## `tomodoro plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ tomodoro plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.5.2/src/commands/plugins/reset.ts)_

## `tomodoro plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ tomodoro plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ tomodoro plugins unlink
  $ tomodoro plugins remove

EXAMPLES
  $ tomodoro plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.5.2/src/commands/plugins/uninstall.ts)_

## `tomodoro plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ tomodoro plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ tomodoro plugins unlink
  $ tomodoro plugins remove

EXAMPLES
  $ tomodoro plugins unlink myplugin
```

## `tomodoro plugins update`

Update installed plugins.

```
USAGE
  $ tomodoro plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.5.2/src/commands/plugins/update.ts)_

## `tomodoro start`

```
USAGE
  $ tomodoro start
```

_See code: [src/commands/start.ts](https://github.com/Projects/tomodoro/blob/v0.0.0/src/commands/start.ts)_
<!-- commandsstop -->
