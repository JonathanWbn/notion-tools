export interface Tool {
  id: string
  name: string
  description: string
  config: Record<string, unknown>
  isActive: boolean
}
