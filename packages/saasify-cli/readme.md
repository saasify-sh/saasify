<p align="center">
  <a href="https://saasify.sh" title="Saasify">
    <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/logo-vert-white@4x.png" alt="Saasify Logo" width="256" />
  </a>
</p>

# Saasify

> [Saasify](https://saasify.sh) transforms **serverless functions** into fully functional **SaaS** websites!

[![NPM](https://img.shields.io/npm/v/saasify.svg)](https://www.npmjs.com/package/saasify) [![Build Status](https://travis-ci.com/saasify-sh/saasify.svg?branch=master)](https://travis-ci.com/saasify-sh/saasify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Saasify allows makers to:

1) Focus on unique value instead of boilerplate 🔥
2) Ship in minutes instead of months ✈️
3) Monetize OSS ⭐️

## Status

**As of September, 2019, Saasify is in beta and is ready for general use.**

If you're interested in OSS sustainability and want to follow along with our progress, please consider starring the [repo](https://github.com/saasify-sh/saasify) and following us on [ProductHunt](https://www.producthunt.com/upcoming/saasify-2).

## Features

- **$$$**: Monetize your open source projects!
- **Simple**: Quick to setup your own SaaS
- **Productive**: Focus on your unique value prop instead of SaaS boilerplate
- **Standard**: Built with TypeScript + Lambda + Stripe
- **Compatible**: Generated APIs are usable from any programming language
- **Automatic**: Saasify handles all docs, hosting, billing, accounts, and support for you
- **Efficient**: Start validating product / market fit in minutes instead of months

## Install

```
npm install -g saasify
```

## Usage

```bash
Usage: saasify [options] [command]

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
  ls|list [options] [project]                          Lists deployments
  logs [options] <url|deployment>                      Prints the logs for a given deployment
  publish <deploymentId|deploymentUrl>                 Creates a subscription to a project (requires a valid billing source)
  rm|remove [options] [deploymentId|deploymentUrl...]  Removes deployments
  secrets <command> [name] [value]                     Manages your secret environment variables
  login|signin [options]                               Logs into your account
  logout|signout                                       Logs out of your account
  signup [options]                                     Creates a new account
  subscribe <project>                                  Subscribes to a project (requires a valid billing source)
  teams <command> [arg]                                Manages your teams (ls, add, invite, switch)
  unsubscribe [options] <project>                      Unsubscribes from a project
  whoami                                               Prints information about the current user
```

## Walkthrough

For more documentation and a detailed walkthrough, visit [saasify.sh](https://saasify.sh).

## Related

- [saasify](https://saasify.sh) - Saasify homepage.
- [fts](https://github.com/transitive-bullshit/functional-typescript) - TypeScript standard for rock solid serverless functions.

## License

MIT © [Saasify](https://saasify.sh)
