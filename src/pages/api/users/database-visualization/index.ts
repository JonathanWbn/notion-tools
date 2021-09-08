import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromSession } from '../../../../infrastructure/api-utils'
import { AddDatabaseVisualizationResponse } from '../../../../infrastructure/api-client'
import { DynamoUserRepository } from '../../../../infrastructure/repository/DynamoUserRepository'
import { CreateDatabaseVisualization } from '../../../../application/use-case/CreateDatabaseVisualization'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<AddDatabaseVisualizationResponse>
): Promise<void> => {
  const { method } = req

  try {
    switch (method) {
      case 'POST': {
        const authUser = getUserFromSession(req, res)
        const createDatabaseVisualization = new CreateDatabaseVisualization(
          new DynamoUserRepository()
        )

        const config = await createDatabaseVisualization.invoke({
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
