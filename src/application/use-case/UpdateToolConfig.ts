import { ToolConfig, User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'

interface UpdateToolConfigRequest {
  userId: User['userId']
  toolConfigId: ToolConfig['id']
  toolConfig: Partial<ToolConfig>
}

export class UpdateToolConfig {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: UpdateToolConfigRequest): Promise<User> {
    const user = await this.userRepository.getById(request.userId)

    return await this.userRepository.update(request.userId, {
      ...user,
      toolConfigs: user.toolConfigs.map((tc) =>
        tc.id === request.toolConfigId ? tc.copyWith(request.toolConfig) : tc
      ),
    })
  }
}
