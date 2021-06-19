import { User } from '../domain/User'

export interface Authorization {
  assertIsAllowedToCreateUsers(): Promise<void>
  assertIsAllowedToUpdateUser(userId: User['id']): Promise<void>
}
