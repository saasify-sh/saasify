export default async function hello (name = 'World'): Promise<string> => {
  return `Hello ${name}!`
}
