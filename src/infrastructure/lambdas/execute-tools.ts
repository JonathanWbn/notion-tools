import { RunRecurringTask } from '../../application/use-case/RunRecurringTask'
import { DynamoUserRepository } from '../repository/DynamoUserRepository'

export const handler = async (): Promise<string> => {
  const userRepository = new DynamoUserRepository()

  const users = await userRepository.getAll()

  for (const user of users) {
    console.log('user', user)
    const configsToExecute = user.recurringTasks.filter(
      (config) => config.isActive && config.isExecutable
    )

    for (const config of configsToExecute) {
      console.log('config', config)

      if (config.shouldBeExecutedNow()) {
        console.log('executing')
        const runRecurringTask = new RunRecurringTask(userRepository)

        await runRecurringTask.invoke({
          userId: user.userId,
          recurringTaskId: config.id,
        })
      }
    }
  }

  return 'Success'
}
