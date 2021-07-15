import { RunToolConfig } from '../../application/use-case/RunToolConfig'
import { configIsComplete } from '../../domain/User'
import { DynamoUserRepository } from '../repository/DynamoUserRepository'

export const handler = async (): Promise<string> => {
  const userRepository = new DynamoUserRepository()

  const users = await userRepository.getAll()

  console.log('users', users)

  for (const user of users) {
    const configsToExecute = user.toolConfigs.filter(
      (config) => config.isActive && configIsComplete(config.config)
    )

    for (const config of configsToExecute) {
      console.log('config', config)

      const runToolConfig = new RunToolConfig(userRepository)

      await runToolConfig.invoke({
        auth0UserId: user.auth0UserId,
        toolConfigId: config.id,
      })
    }
  }

  return 'Success'
}
