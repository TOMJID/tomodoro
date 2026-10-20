import { Args, Command, Flags } from '@oclif/core'

export default class Start extends Command {


  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Start)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /home/tom/Projects/tomodoro/src/commands/start.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
