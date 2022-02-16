import { NextApiRequest, NextApiResponse } from 'next'
import { DynamoUserRepository } from '../../../../infrastructure/repository/DynamoUserRepository'
import { DatabaseVisualization } from '../../../../domain/DatabaseVisualization'
import { decrypt } from '../../../../../crypto'

const userRepository = new DynamoUserRepository()

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<DatabaseVisualization | undefined>
): Promise<void> => {
  const { method, query } = req

  try {
    switch (method) {
      case 'GET': {
        const { userId, visualizationId } = JSON.parse(decrypt(query.key as string))

        const user = await userRepository.getById(userId)

        if (!user.notionAccess) {
          res.status(401).end()
          return
        }

        res.status(200).send(user.databaseVisualizations.find((viz) => viz.id === visualizationId))
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
  }
}

export default handler
