export class DatabaseVisualization implements IDatabaseVisualization {
  static _isExecutable(databaseVisualization: IDatabaseVisualization): boolean {
    if (!databaseVisualization.settings.databaseId) {
      return false
    }

    return true
  }

  constructor(
    public readonly id: string,
    public readonly settings: DatabaseVisualizationSettings
  ) {}

  get isExecutable(): boolean {
    return DatabaseVisualization._isExecutable(this)
  }

  public copyWith({ settings }: Partial<DatabaseVisualization>): DatabaseVisualization {
    return new DatabaseVisualization(this.id, settings || this.settings)
  }
}

export interface IDatabaseVisualization {
  id: string
  settings: DatabaseVisualizationSettings
}

export interface DatabaseVisualizationSettings {
  databaseId?: string
  xAxis?: string
  xAxisTimeFrame?: [string | undefined, string | undefined]
  yAxis?: string[]
  type: 'bar' | 'line'
}
