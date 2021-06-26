import { ToolConfig, User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'

interface DisableToolConfigRequest {
  auth0UserId: User['auth0UserId']
  toolConfigId: ToolConfig['id']
}

export class DisableToolConfig {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: DisableToolConfigRequest): Promise<User> {
    const toolConfig = await this.userRepository.getToolConfigById(
      request.auth0UserId,
      request.toolConfigId
    )

    const user = await this.userRepository.updateToolConfig(request.auth0UserId, {
      ...toolConfig,
      isActive: false,
    })

    return user
  }
}
