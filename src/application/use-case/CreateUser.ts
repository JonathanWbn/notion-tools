import { User } from '../../domain/User'
import { Authorization } from '../Authorization'
import { UserRepository } from '../repository/UserRepository'

export class CreateUser {
  constructor(
    private readonly authorization: Authorization,
    private readonly userRepository: UserRepository
  ) {}

  public async invoke(): Promise<User> {
    await this.authorization.assertIsAllowedToCreateUsers()

    const user = await this.userRepository.create()

    return user
  }
}
