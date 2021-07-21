import { NotionAccess, User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'

interface ConnectNotionRequest {
  auth0UserId: User['auth0UserId']
  notionAccess: NotionAccess
}

export class ConnectNotion {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: ConnectNotionRequest): Promise<User> {
    const user = await this.userRepository.getById(request.auth0UserId)

    return await this.userRepository.update(request.auth0UserId, {
      ...user,
      notionAccess: request.notionAccess,
    })
  }
}
