import axios, { AxiosResponse } from 'axios'
import { compile } from 'json-schema-to-typescript'
import { writeFileSync } from 'fs'

const url: string = 'https://raw.githubusercontent.com/docker/compose/master/compose/config/compose_spec.json'
const out: string = 'index.ts'

await axios.get(url).then((response: AxiosResponse) =>
    compile(response.data, 'docker-compose-spec').then(
        (compile: string) =>
            writeFileSync(out, compile)
    )
).catch((err) => {
    console.error(err)
    process.exit(-1)
})
