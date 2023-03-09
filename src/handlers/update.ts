import services from '@src/services/index.js'
import psdk from 'postman-collection'
import { PostmanCli } from '@src/types'
import { Command } from 'commander'
import editor from '@inquirer/editor'
import util from 'node:util'

export default async function (
    args: PostmanCli.Cmd.VariadicResources,
    ..._cmd: [PostmanCli.Cmd.Opts.Update, Command]
) {
    const [optional, cmd] = _cmd
    args = args.map(e => e.toLowerCase())
    const co = await services.cmdopts.getOptCollection(cmd)
    const resource = services.resource.getFromNested(co, args)

    if (services.response.isResponse(resource)) {
        const p = services.example.toPrintable(resource)
        const str = util.inspect(p, {
            colors: false,
            maxArrayLength: null,
            maxStringLength: null,
            depth: 50,
        })
        const prompt: any = await editor({ default: str, message: '' })

        new psdk.Response({
            code: prompt.response.code,
            responseTime: prompt.response.time,
            body: prompt.response.body,
            header: [{}],
        })
    }
}
