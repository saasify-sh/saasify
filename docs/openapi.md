[header](_header.md ':include')

# OpenAPI

**[OpenAPI](https://swagger.io/specification/)** was previously called **Swagger**. These specs are both formal ways of defining your HTTP API's endpoints, inputs, and outputs.

## Why

Saasify uses **OpenAPI v3** to auto-generate a few useful things for your product:

- An interactive demo that your customers can play with before purchasing your product ([live example](https://wordcloud.saasify.sh/)).
- Developer-friendly API docs ([live example](https://imagemin.saasify.sh/docs)).
- Example inputs and outputs for each endpoint.
- Example code snippets for several common languages.

## OpenAPI Spec Generation

If your API is simple enough, we can help you create an OpenAPI spec by hand. We will be launching a WYSIWYG web editor that makes this process much simpler soon (_late Spring 2020_).

If you already have a formal spec for your API, but it's not in **OpenAPI v3 format**, chances are that you can convert it to OpenAPI v3 using the free tier of [APImatic's](https://www.apimatic.io/transformer/) transform utility.

Most of the time you shouldn't have to write these OpenAPI specs yourself or understand really anything about the format as there are many [tools](https://openapi.tools ':target=_blank') that will auto-generate them for you.

Here are a few of the best OpenAPI tools that we recommend for new Saasify projects.

### Visual Designer

[Stoplight Studio](https://stoplight.io/studio) is hands down the best visual OpenAPI editor on the market. It's available for web, Mac, Windows, and Linux and offers some really impressive features such as Git integration, mock servers, API linting, Postman import, and Markdown documentation generation.

### TypeScript

If you're working with a JavaScript or TypeScript codebase, we recommend using [tsoa](https://github.com/lukeautry/tsoa) which allows you to easily create OpenAPI-compatible REST APIs that interop with common Node.js server frameworks (Express, Koa, and Hapi).

The best part about `tsoa` is that your API's source code automatically stays in sync with it's auto-generated OpenAPI spec.

### Python

If you're working with a Python codebase, we strongly recommend using [FastAPI](https://fastapi.tiangolo.com/), a modern, fast (high-performance), web framework for building OpenAPI-compatible REST APIs with Python 3.6+ (based on standard Python type hints).

The best part about `FastAPI` is that your API's source code automatically stays in sync with it's auto-generated OpenAPI spec.
