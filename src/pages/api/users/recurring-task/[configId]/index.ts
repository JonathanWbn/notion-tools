import { DeleteRecurringTask } from '../../../../../application/use-case/DeleteRecurringTask'
import { UpdateRecurringTask } from '../../../../../application/use-case/UpdateRecurringTask'
import { getUserFromSession } from '../../../../../infrastructure/api-utils'
import { DynamoUserRepository } from '../../../../../infrastructure/repository/DynamoUserRepository'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<{ success: true }>
): Promise<void> => {
  const { query, method, body } = req

  try {
    switch (method) {
      case 'PATCH': {
        const authUser = await getUserFromSession(req, res)
        const updateRecurringTask = new UpdateRecurringTask(new DynamoUserRepository())

        await updateRecurringTask.invoke({
          userId: authUser.sub,
          recurringTaskId: query.configId as string,
          recurringTask: body,
        })

        return res.status(200).send({ success: true })
      }
      case 'DELETE': {
        const authUser = await getUserFromSession(req, res)
        const deleteRecurringTask = new DeleteRecurringTask(new DynamoUserRepository())

        await deleteRecurringTask.invoke({
          userId: authUser.sub,
          recurringTaskId: query.configId as string,
        })

        return res.status(200).send({ success: true })
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
  }
}

export default withApiAuthRequired(handler)
