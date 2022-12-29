import { NextApiRequest, NextApiResponse } from 'next'
import { RunRecurringTask } from '../../../application/use-case/RunRecurringTask'
import { DynamoUserRepository } from '../../../infrastructure/repository/DynamoUserRepository'

const userRepository = new DynamoUserRepository()

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { method } = req

  switch (method) {
    case 'POST': {
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

      res.status(200).send({ success: true })
      return
    }
  }
  res.status(500).send({ success: false })
}

export default handler
