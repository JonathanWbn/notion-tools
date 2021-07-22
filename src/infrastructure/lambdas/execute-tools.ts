import { RunToolConfig } from '../../application/use-case/RunToolConfig'
import { DynamoUserRepository } from '../repository/DynamoUserRepository'

export const handler = async (): Promise<string> => {
  const userRepository = new DynamoUserRepository()

  const users = await userRepository.getAll()

  for (const user of users) {
    console.log('user', user)
    const configsToExecute = user.toolConfigs.filter(
      (config) => config.isActive && config.isExecutable
    )

    for (const config of configsToExecute) {
      console.log('config', config)

      const runToolConfig = new RunToolConfig(userRepository)

      if (config.shouldBeExecutedNow()) {
        console.log('executing')
        await runToolConfig.invoke({
          userId: user.userId,
          toolConfigId: config.id,
        })
      }
    }
  }

  return 'Success'
}
