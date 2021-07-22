import { User } from '../../domain/User'

export interface UserRepository {
  create(userId: User['userId']): Promise<User>
  update(userId: User['userId'], user: User): Promise<User>
  getById(userId: User['userId']): Promise<User>
  getAll(): Promise<User[]>
}
