import { NotionAccess, User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'

interface ConnectNotionRequest {
  userId: User['userId']
  notionAccess: NotionAccess
}

export class ConnectNotion {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: ConnectNotionRequest): Promise<User> {
    const user = await this.userRepository.getById(request.userId)

    return await this.userRepository.update(request.userId, {
      ...user,
      notionAccess: request.notionAccess,
    })
  }
}
