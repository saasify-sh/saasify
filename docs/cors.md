[header](_header.md ':include')

# CORS

Saasify's API gateway allow for very permissive [CORS](https://enable-cors.org) (Cross Origin Resource Sharing).

This means that your customers can use your SaaS product's API from any origin, including client-side JavaScript code.

Just be sure to carefully think through your product's use case before recommending that your customers call your API from client-side JavaScript on the web due to the the private nature of their auth tokens.
