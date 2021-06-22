import { NextApiRequest, NextApiResponse } from 'next'
import { MemoryToolRepository } from '../../../infrastructure/repository/MemoryToolRepository'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { method, query } = req

  try {
    switch (method) {
      case 'GET': {
        const toolRepository = new MemoryToolRepository()
        const tool = toolRepository.getById(query.tool as string)

        res.status(200).send(tool)
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
