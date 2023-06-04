import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { encrypt } from '../../../../../application/crypto'
import { DeleteDatabaseVisualization } from '../../../../../application/use-case/DeleteDatabaseVisualization'
import { UpdateDatabaseVisualization } from '../../../../../application/use-case/UpdateDatabaseVisualization'
import { getUserFromSession } from '../../../../../infrastructure/api-utils'
import { DynamoUserRepository } from '../../../../../infrastructure/repository/DynamoUserRepository'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { query, method, body } = req

  try {
    switch (method) {
      case 'GET': {
        const authUser = getUserFromSession(req, res)

        res.status(200).send({
          key: encrypt(JSON.stringify({ userId: authUser.sub, visualizationId: query.configId })),
        })
        break
      }
      case 'PATCH': {
        const authUser = getUserFromSession(req, res)
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
      case 'DELETE': {
        const authUser = getUserFromSession(req, res)
        const deleteDatabaseVisualization = new DeleteDatabaseVisualization(
          new DynamoUserRepository()
        )

        await deleteDatabaseVisualization.invoke({
          userId: authUser.sub,
          databaseVisualizationId: query.configId as string,
        })

        res.status(200).send({ success: true })
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
  }
}

export default withApiAuthRequired(handler)
