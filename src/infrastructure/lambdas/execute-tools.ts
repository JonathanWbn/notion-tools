import { RunToolConfig } from '../../application/use-case/RunToolConfig'
import { configIsComplete, shouldBeExecuted } from '../../domain/User'
import { DynamoUserRepository } from '../repository/DynamoUserRepository'

export const handler = async (): Promise<string> => {
  const userRepository = new DynamoUserRepository()

  const users = await userRepository.getAll()

  for (const user of users) {
    console.log('user', user)
    const configsToExecute = user.toolConfigs.filter(
      (config) => config.isActive && configIsComplete(config.config)
    )

    for (const config of configsToExecute) {
      console.log('config', config)

      const runToolConfig = new RunToolConfig(userRepository)

      if (shouldBeExecuted(config)) {
        console.log('executing')
        await runToolConfig.invoke({
          auth0UserId: user.auth0UserId,
          toolConfigId: config.id,
        })
      }
    }
  }

  return 'Success'
}
