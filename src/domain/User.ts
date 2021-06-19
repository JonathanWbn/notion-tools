import { Tool } from "./Tools";

export interface ToolConfig {
  id: string;
  toolId: Tool["id"];
  config: Record<string, unknown>;
  isActive: boolean;
}

export interface User {
  id: string;
  toolConfigs: ToolConfig[];
  isActive: boolean;
}

export interface Users {
  create(): Promise<User>;
  addToolConfig(
    userId: User["id"],
    config: ToolConfig["config"]
  ): Promise<User>;
  updateToolConfig(
    userId: User["id"],
    toolConfigId: ToolConfig["id"],
    config: ToolConfig["config"]
  ): Promise<User>;
  disable(userId: User["id"]): Promise<User>;
  getById(userId: User["id"]): Promise<User>;
  getAll(): Promise<User[]>;
}
