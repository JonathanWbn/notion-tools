import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { CreateToolConfig } from '../../../application/use-case/CreateToolConfig'
import { AddToolToUserResponse } from '../../../infrastructure/client/api-client'
import { DynamoUserRepository } from '../../../infrastructure/repository/DynamoUserRepository'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<AddToolToUserResponse>
): Promise<void> => {
  const { body, method } = req

  try {
    switch (method) {
      case 'POST': {
        const createToolConfig = new CreateToolConfig(new DynamoUserRepository())

        const updatedUser = await createToolConfig.invoke({
          auth0UserId: body.auth0UserId,
          toolConfig: body.toolConfig,
          toolId: body.toolId,
        })

        res.status(200).send(updatedUser)
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
  }
}

export default withApiAuthRequired(handler)
