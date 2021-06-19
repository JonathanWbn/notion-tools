import { Authorization } from "../authorization";
import { UserRepository } from "../repository/UserRepository";

export class CreateUser {
  constructor(
    private readonly authorization: Authorization,
    private readonly userRepository: UserRepository
  ) {}

  public async invoke() {
    await this.authorization.assertIsAllowedToCreateUsers();

    const user = await this.userRepository.create();

    return user;
  }
}
