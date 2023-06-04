import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromSession } from '../../../../infrastructure/api-utils'
import { AddRecurringTaskResponse } from '../../../../infrastructure/api-client'
import { DynamoUserRepository } from '../../../../infrastructure/repository/DynamoUserRepository'
import { CreateRecurringTask } from '../../../../application/use-case/CreateRecurringTask'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<AddRecurringTaskResponse>
): Promise<void> => {
  const { method } = req

  try {
    switch (method) {
      case 'POST': {
        const authUser = await getUserFromSession(req, res)
        const createRecurringTask = new CreateRecurringTask(new DynamoUserRepository())

        const config = await createRecurringTask.invoke({
          userId: authUser.sub,
        })

        res.status(200).send(config)
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
  }
}

export default withApiAuthRequired(handler)
