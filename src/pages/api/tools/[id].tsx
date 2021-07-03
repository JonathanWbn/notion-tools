import { NextApiRequest, NextApiResponse } from 'next'
import { Tool } from '../../../domain/Tool'
import { MemoryToolRepository } from '../../../infrastructure/repository/MemoryToolRepository'

const handler = async (req: NextApiRequest, res: NextApiResponse<Tool>): Promise<void> => {
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
    res.status(500).end()
  }
}

export default handler
