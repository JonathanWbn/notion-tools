import { encrypt } from '../../../../../application/crypto'
import { UpdateDatabaseVisualization } from '../../../../../application/use-case/UpdateDatabaseVisualization'
import { getUserFromSession } from '../../../../../infrastructure/api-utils'
import { DynamoUserRepository } from '../../../../../infrastructure/repository/DynamoUserRepository'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { query, method, body } = req

  try {
    switch (method) {
      case 'PATCH': {
        const authUser = await getUserFromSession(req, res)
        const updateDatabaseVisualization = new UpdateDatabaseVisualization(
          new DynamoUserRepository()
        )

        await updateDatabaseVisualization.invoke({
          userId: authUser.sub,
          databaseVisualizationId: query.configId as string,
          databaseVisualization: body,
        })

        res.status(200).send({ success: true })
        break
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
  }
}

export default withApiAuthRequired(handler)
