import { ToolConfig, User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'

interface UpdateToolConfigRequest {
  auth0UserId: User['auth0UserId']
  toolConfigId: ToolConfig['id']
  toolConfig: Partial<ToolConfig>
}

export class UpdateToolConfig {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: UpdateToolConfigRequest): Promise<User> {
    const toolConfig = await this.userRepository.getToolConfigById(
      request.auth0UserId,
      request.toolConfigId
    )

    const user = await this.userRepository.updateToolConfig(
      request.auth0UserId,
      toolConfig.copyWith(request.toolConfig)
    )

    return user
  }
}
