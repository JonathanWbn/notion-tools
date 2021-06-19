import { ToolConfig, User } from "../../domain/User";
import { Authorization } from "../authorization";
import { UserRepository } from "../repository/UserRepository";

interface CreateUserRequest {
  userId: User["id"];
  configId: ToolConfig["id"];
}

export class DisableToolConfig {
  constructor(
    private readonly authorization: Authorization,
    private readonly userRepository: UserRepository
  ) {}

  public async invoke(request: CreateUserRequest) {
    await this.authorization.assertIsAllowedToUpdateUser(request.userId);

    const user = await this.userRepository.disableToolConfig(
      request.userId,
      request.configId
    );

    return user;
  }
}
