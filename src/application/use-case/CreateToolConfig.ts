import { v4 as uuid } from 'uuid'
import { ToolConfig, User } from '../../domain/User'
import { Tool } from '../../domain/Tool'
import { UserRepository } from '../repository/UserRepository'

interface CreateToolConfigRequest {
  userId: User['userId']
  toolId: Tool['id']
}

export class CreateToolConfig {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: CreateToolConfigRequest): Promise<ToolConfig> {
    const toolConfig = new ToolConfig(uuid(), request.toolId, {}, false, new Date().toISOString())
    const user = await this.userRepository.getById(request.userId)

    await this.userRepository.update(request.userId, {
      ...user,
      toolConfigs: [...user.toolConfigs, toolConfig],
    })

    return toolConfig
  }
}
