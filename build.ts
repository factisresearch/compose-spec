import axios, { AxiosResponse } from 'axios'
import { compile } from 'json-schema-to-typescript'
import * as rimraf from 'rimraf'
import { writeFileSync } from 'fs'
import { join } from 'path'
import * as fs from 'fs'

const directory = 'lib'
const url: string = 'https://raw.githubusercontent.com/docker/compose/master/compose/config/compose_spec.json'

rimraf.sync(directory)
fs.mkdirSync(directory)

const promises: Promise<{ compile: string }>[] = []

promises.push(axios.get(url).then((response: AxiosResponse) => {
  return { compilePromise: compile(response.data, `docker-compose-spec.ts`) }
}).then((compilePromiseAndVersion: { compilePromise: Promise<string> }) => {
  return compilePromiseAndVersion.compilePromise.then((compile: string) => {
    return { compile }
  })
}).then((compileAndVersion: { compile: string }) => {
  writeFileSync(join(directory, `docker-compose-spec.ts`), compileAndVersion.compile)
  return compileAndVersion
}))


Promise.all(promises).then((resolved: { compile: string }[]) => {
  console.log(`${resolved.length} files written in ${directory}.`)
}).catch((err) => {
  console.error(err)
  process.exit(-1)
})








