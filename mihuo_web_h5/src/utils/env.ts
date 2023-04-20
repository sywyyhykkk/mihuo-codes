export const get_env = (env:string|any) => {
  let index = 0
  for (let i = 0; i < env.length; i++) {
    if (env[i] >= 'A' && env[i] <= 'Z') {
      index = i
      break
    }
  }
  return env.slice(0, index)
}
