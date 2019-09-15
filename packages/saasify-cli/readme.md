<p align="center">
  <a href="https://saasify.sh" title="Saasify">
    <img src="https://raw.githubusercontent.com/saasify-sh/saasify/master/logo-white@1024w.png" alt="Saasify Logo" width="500" />
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

**As of September, 2019, Saasify is an active WIP and is not yet ready for general use.**

The backend and developer CLI are complete, and our team is working hard on an MVP of the template-based SaaS website generation.

If you're interested in OSS sustainability and want to follow along with the progress of Saasify, please consider starring the [repo](https://github.com/saasify/saasify) and following us on [ProductHunt](https://www.producthunt.com/upcoming/saasify-2). Thanks! ⭐️

## Features

- **$$$**: Monetize your open source projects!
- **Simple**: Quick to setup your own SaaS
- **Productive**: Focus on your unique value prop instead of SaaS boilerplate
- **Standard**: Built with TypeScript + Lambda + Stripe
- **Compatible**: Generated APIs are usable from any programming language
- **Automatic**: Saasify handles all docs, hosting, billing, accounts, and support for you
- **Efficient**: Start validating product / market fit in minutes instead of months

## Install

```bash
npm install -g saasify
```

## Usage

```
Usage: saasify [options] [command]

Options:
  -V, --version                                        Output the version number
  -d, --debug                                          Enable extra debugging output
  -n, --project <name>                                 Project name
  -c, --config <path>                                  Path to `saasify.json` file (defaults to cwd)
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

You can run `saasify help [cmd]` to view the sub-help for any given command.

## Walkthrough

For more documentation and a detailed walkthrough, visit [saasify.sh](https://saasify.sh).

## Related

- [saasify](https://saasify.sh) - Saasify homepage.
- [fts](https://github.com/transitive-bullshit/functional-typescript) - TypeScript standard for rock solid serverless functions.

## License

MIT © [Travis Fischer](https://transitivebullsh.it)
