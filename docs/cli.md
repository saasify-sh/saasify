[header](_header.md ':include')

# CLI

> [Saasify CLI](https://github.com/saasify-sh/saasify/tree/master/packages/saasify-cli)

## Install

```
npm install -g saasify
```

## Usage

```bash
Usage: saasify <command> [options]

Options:
  -V, --version                                        output the version number
  -d, --debug                                          Enable extra debugging output
  -n, --project <name>                                 Project name
  -c, --config <path>                                  Path to `saasify.json` file (defaults to cwd)
  -C, --no-clipboard                                   Do not attempt to copy URL to clipboard
  -h, --help                                           output usage information

Commands:
  cc|billing <command> [id]                            Manages your credit cards and billing methods
  debug [path]                                         Prints information about a local project
  deploy [options] [path]                              Creates a new deployment
  dev [options] [path]                                 Starts a local dev server for debugging your deployments
  help [cmd]                                           Displays usage info for [cmd]
  init [options] [project-name]                        Creates a new project based on a template
  ls|list [project]                                    Lists deployments
  logs [options] <url|deployment>                      Prints the logs for a given deployment
  publish <deploymentId|deploymentUrl>                 Creates a subscription to a project (requires a valid billing source)
  rm|remove [options] [deploymentId|deploymentUrl...]  Removes deployments
  secrets <command> [name] [value]                     Manages your secret environment variables
  login|signin [options]                               Logs into your account
  logout|signout                                       Logs out of your account
  signup [options]                                     Creates a new account
  subscribe <project>                                  Subscribes to a project (requires a valid billing source)
  unsubscribe [options] <project>                      Unsubscribes from a project
  whoami                                               Prints information about the current user
```
