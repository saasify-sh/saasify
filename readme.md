# fin-cli

> Developer CLI for [Fin](https://functional-income.com). Fin is the easiest way to launch your own SaaS.

[![NPM](https://img.shields.io/npm/v/fin.svg)](https://www.npmjs.com/package/fin) [![Build Status](https://travis-ci.com/functional-income/fin-cli.svg?branch=master)](https://travis-ci.com/functional-income/fin-cli) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install -g fin
```

## Usage

```
Usage: fin [options] [command]

Options:
  -V, --version                                        Output the version number
  -d, --debug                                          Enable extra debugging output
  -n, --project <name>                                 Project name
  -c, --config <path>                                  Path to `fin.json` file (defaults to cwd)
  -C, --no-clipboard                                   Do not attempt to copy URL to clipboard
  -h, --help                                           Output usage information

Commands:
  cc|billing <command> [id]                            Manages your credit cards and billing methods
  debug [path]                                         Prints information about a local deployment
  deploy [options] [path]                              Creates a new deployment
  help [cmd]                                           Displays usage info for [cmd]
  ls|list [project]                                    Lists deployments
  logs [options] <url|deploymentid>                    Prints the logs for the given deployment
  rm|remove [options] [deploymentId|deploymentUrl...]  Removes deployments
  serve [options] [path]                               Serves a deployment via a local http server
  login [options]                                      Logs into your account
  logout                                               Logs out of your account
  signup [options]                                     Creates a new account
  whoami                                               Prints information about the current user
```

You can run `fin help [cmd]` to view the sub-help for any given command.

## Walkthrough

For more documentation and a detailed walkthrough, visit [functional-income.com](https://functional-income.com).

## Related

- [fin](https://functional-income.com) - Fin homepage.
- [fin-client](https://github.com/functional-income/fin-client) - Universal HTTP client for Fin.
- [fts](https://github.com/transitive-bullshit/functional-typescript) - TypeScript standard for rock solid serverless functions.
- [now](https://zeit.co/now) - Global serverless deployments.

## License

MIT © [Travis Fischer](https://transitivebullsh.it)
