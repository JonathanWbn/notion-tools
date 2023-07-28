export function isExecutable(databaseVisualization: DatabaseVisualization): boolean {
  if (!databaseVisualization.settings.databaseId) {
    return false
  }

  return true
}

export interface DatabaseVisualization {
  id: string
  settings: DatabaseVisualizationSettings
}

export interface DatabaseVisualizationSettings {
  databaseId?: string
  xAxis?: string
  xAxisTimeFrame?: [string | undefined, string | undefined]
  yAxisScaleLeft?: { min?: number; max?: number }
  yAxisScaleRight?: { min?: number; max?: number }
  yAxis?: string[]
  type: 'bar' | 'line'
}
