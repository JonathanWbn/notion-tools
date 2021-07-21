import { User } from '../../domain/User'

export interface UserRepository {
  create(userId: User['auth0UserId']): Promise<User>
  update(userId: User['auth0UserId'], user: User): Promise<User>
  getById(userId: User['auth0UserId']): Promise<User>
  getAll(): Promise<User[]>
}
