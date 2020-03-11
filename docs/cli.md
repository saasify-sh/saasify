[header](_header.md ':include')

# CLI

> [Saasify CLI](https://github.com/saasify-sh/saasify/tree/master/packages/saasify-cli)

The Saasify CLI is your primary interface for creating new SaaS projects and deploying updates.

See the [quick start](quick-start.md) for a walkthrough of how to get started using the CLI.

In the near future, Saasify's admin dashboard will offer a GUI on top of this CLI, but the core workflow and product will remain largely the same.

## Install

```
# install the saasify CLI globally
npm install -g saasify

# signup for a new account (uses GitHub auth by default)
saasify signup
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
```

## Workflow

```bash
# initialize your project's saasify.json (or copy one from an example project)
saasify init [project-name]

# edit your project...

saasify deploy

# preview and iterate on your SaaS product...

saasify publish

# start marketing your live SaaS product...
```
