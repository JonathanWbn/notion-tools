import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { CreateToolConfig } from '../../../../application/use-case/CreateToolConfig'
import { getUserFromSession } from '../../../../infrastructure/api-utils'
import { AddToolToUserResponse } from '../../../../infrastructure/api-client'
import { DynamoUserRepository } from '../../../../infrastructure/repository/DynamoUserRepository'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<AddToolToUserResponse>
): Promise<void> => {
  const { body, method } = req

  try {
    switch (method) {
      case 'POST': {
        const authUser = getUserFromSession(req, res)
        const createToolConfig = new CreateToolConfig(new DynamoUserRepository())

        const config = await createToolConfig.invoke({
          userId: authUser.sub,
          toolId: body.toolId,
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
