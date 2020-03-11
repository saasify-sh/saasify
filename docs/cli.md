[header](_header.md ':include')

# CLI

> [Saasify CLI](https://github.com/saasify-sh/saasify/tree/master/packages/saasify-cli)

## Install

```
npm install -g saasify
```

## Usage

```
Usage: saasify <command> [options]

Options:
  -V, --version                                        output the version number
  -d, --debug                                          Enable extra debugging output
  -n, --project <name>                                 Project name
  -c, --config <path>                                  Path to `saasify.json` file (defaults to cwd)
  -C, --no-clipboard                                   Do not attempt to copy URL to clipboard
  -h, --help                                           output usage information

Commands:
  help [cmd]                                           Displays usage info for [cmd]
  debug [path]                                         Prints information about a local project

Workflow:
  init [options] [project-name]                        Creates a new project based on a template
  deploy [options] [path]                              Creates a new deployment
  publish <deploymentId|deploymentUrl>                 Publishes a deployment
  ls|list [project]                                    Lists deployments
  rm|remove [options] [deploymentId|deploymentUrl...]  Removes deployments

Accounts:
  login|signin [options]                               Logs into your account
  logout|signout                                       Logs out of your account
  signup [options]                                     Creates a new account (defaults to GitHub auth)
  whoami                                               Prints information about the currently authenticated user

Advanced:
  dev [options] [path]                                 Starts a local dev server for debugging your deployments
  cc|billing <command> [id]                            Manages your credit cards and billing methods
  logs [options] <url|deployment>                      Prints the logs for a given deployment
  secrets <command> [name] [value]                     Manages your secret environment variables
  subscribe <project>                                  Subscribes to a project (requires a valid billing source)
  unsubscribe [options] <project>                      Unsubscribes from a project
```
