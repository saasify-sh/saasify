# Hello World with Secrets

This is a very simple Saasify project that extends the basic hello world example with support for secret environment variables.

```
saasify secrets add my-dynamic-secret 'example secret value'
saasify secrets ls
saasify deploy
```

Note that if you try to deploy this project without first adding the secret, your deployment will fail.

## License

MIT © [Saasify](https://saasify.sh)
