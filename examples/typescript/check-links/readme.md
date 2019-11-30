# check-links

> Quickly and robustly checks large batches of URLs for liveness.

<a href="https://check-links.saasify.sh">
  <img
    src="https://badges.saasify.sh"
    height="40"
    alt="Use Hosted API"
  />
</a>

## Usage

We handle concurrency and retry logic so you can check the status of millions of links **quickly** and **robustly**.

For each URL, it first attempts an HTTP HEAD request, and if that fails it will attempt an HTTP GET request, retrying several times by default with exponential falloff.

- Supports HTTP and HTTPS urls.
- Defaults to a 30 second timeout per HTTP request with 2 retries.
- Defaults to a Mac OS Chrome `user-agent`.
- Defaults to following redirects.

## License

MIT © [Saasify](https://saasify.sh)
