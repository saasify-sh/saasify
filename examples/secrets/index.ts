export default (name = 'World') => {
  return `Hello ${name}!

MY_DYNAMIC_SECRET: ${process.env.MY_DYNAMIC_SECRET}
MY_STATIC_ENV_VAR: ${process.env.MY_STATIC_ENV_VAR}
`
}
