[header](_header.md ':include')

# OpenAPI

**[OpenAPI](https://swagger.io/specification/ ':target=_blank')** is a formal spec used to define an API's HTTP endpoints, inputs, and outputs.

> **Note that OpenAPI was previously called Swagger**.

## Why OpenAPI?

You can **optionally** pass Saasify an **OpenAPI v3** spec that describes your product's backend API.

If you choose to provide an OpenAPI spec, Saasify will add some nice functionality for you:

- Additional validation when proxying HTTP calls to your backend API.
- Developer-friendly API docs ([live example](https://imagemin.saasify.sh/docs ':target=_blank')).
- Example inputs and outputs for each endpoint.
- Example code snippets for several common languages.
- An interactive demo that your customers can play with before purchasing your product ([live example](https://wordcloud.saasify.sh/ ':target=_blank')).

!> Providing an OpenAPI spec is recommended for SaaS products that are primarily targeted at developers. If your SaaS product is not selling direct API access, then you can ignore the OpenAPI config (unless you'd like the additional validation provided by Saasify's API proxy).

## OpenAPI Spec Generation

If you already have a formal spec for your backend API, but it's not in **OpenAPI v3 format**, chances are that you can convert it to OpenAPI v3 using the free tier of [APImatic's](https://www.apimatic.io/transformer/ ':target=_blank') transform utility.

Most of the time you shouldn't have to write these OpenAPI specs yourself or understand really anything about the format as there are many [tools](https://openapi.tools ':target=_blank') that will auto-generate them for you.

Here are a few of the best OpenAPI tools that we recommend for new Saasify projects.

### Visual Designer

[Stoplight Studio](https://stoplight.io/studio ':target=_blank') is hands down the best visual OpenAPI editor on the market. It's available for web, Mac, Windows, and Linux and offers some really impressive features such as Git integration, mock servers, API linting, Postman import, and Markdown documentation generation.

### TypeScript

If you're working with a JavaScript or TypeScript codebase, we recommend using [tsoa](https://github.com/lukeautry/tsoa ':target=_blank') which allows you to easily create OpenAPI-compatible REST APIs that interop with common Node.js server frameworks (Express, Koa, and Hapi).

The best part about `tsoa` is that your backend API's source code automatically stays in sync with it's auto-generated OpenAPI spec.

### Python

If you're working with a Python codebase, we strongly recommend using [FastAPI](https://fastapi.tiangolo.com/ ':target=_blank'), a modern, fast (high-performance), web framework for building OpenAPI-compatible REST APIs with Python 3.6+ (based on standard Python type hints).

The best part about `FastAPI` is that your backend API's source code automatically stays in sync with it's auto-generated OpenAPI spec.
