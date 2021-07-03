import { NextApiRequest, NextApiResponse } from 'next'
import { Tool } from '../../../domain/Tool'
import { MemoryToolRepository } from '../../../infrastructure/repository/MemoryToolRepository'

const handler = async (req: NextApiRequest, res: NextApiResponse<Tool[]>): Promise<void> => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const toolRepository = new MemoryToolRepository()
        const tools = toolRepository.getAll()

        res.status(200).send(tools)
      }
    }
  } catch (err) {
    console.log('err', err)
    res.status(500).end()
  }
}

export default handler
