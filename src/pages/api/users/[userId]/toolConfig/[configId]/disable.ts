import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { DisableToolConfig } from '../../../../../../application/use-case/DisableToolConfig'
import { DynamoUserRepository } from '../../../../../../infrastructure/repository/DynamoUserRepository'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { query, method } = req

  try {
    switch (method) {
      case 'POST': {
        const disableToolConfig = new DisableToolConfig(new DynamoUserRepository())

        const updatedUser = await disableToolConfig.invoke({
          auth0UserId: query.userId as string,
          toolConfigId: query.configId as string,
        })

        res.status(200).send(updatedUser)
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default withApiAuthRequired(handler)
