export interface Tool {
  id: string;
  name: string;
  description: string;
  config: Record<string, unknown>;
  isActive: boolean;
}

interface ToolCreatePayload
  extends Pick<Tool, "name" | "description" | "config"> {}

interface ToolUpdatePayload
  extends Partial<Pick<Tool, "name" | "description" | "config">> {}

export interface Tools {
  create(tool: ToolCreatePayload): Promise<Tool>;
  update(toolId: Tool["id"], tool: ToolUpdatePayload): Promise<Tool>;
  disable(toolId: Tool["id"]): Promise<Tool>;
  getById(toolId: Tool["id"]): Promise<Tool>;
  getAll(): Promise<Tool[]>;
}
