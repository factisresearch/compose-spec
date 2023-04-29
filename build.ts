import axios, { AxiosResponse } from 'axios'
import { compile } from 'json-schema-to-typescript'
import { writeFileSync } from 'fs'
import { serializeError } from 'serialize-error'

// the specification is not versioned explicitly by design
// see also https://github.com/compose-spec/compose-spec/blob/master/04-version-and-name.md
const url: string = 'https://raw.githubusercontent.com/compose-spec/compose-spec/853d1a9b2301c20b76b867a22b4ef0faef79362e/schema/compose-spec.json'
const out: string = 'index.ts'

await axios.get(url).then((response: AxiosResponse) =>
    compile(response.data, 'compose-spec').then(
        (compile: string) =>
            writeFileSync(out, compile)
    )
).catch((err) => {
    console.error(serializeError(err))
    process.exit(-1)
})
