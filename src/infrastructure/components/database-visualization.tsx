import {
  LineChart,
  XAxis,
  Line,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  FormulaPropertyValue,
  NumberPropertyValue,
  Page,
} from '@notionhq/client/build/src/api-types'
import { format } from 'date-fns'
import { useDatabase, useDatabaseQuery } from '../api-client'
import { SupportedDatePropertyValue } from './database-visualization-form'
import {
  DatabaseVisualization,
  DatabaseVisualizationSettings,
} from '../../domain/DatabaseVisualization'
import React, { ReactElement } from 'react'
import { Spinner } from './icons'

const notionColors = ['#5893b3', '#e49759', '#5b9d92', '#ea7271']

interface Props {
  databaseVisualization?: DatabaseVisualization
  width: number | string
  height: number | string
}

export function DatabaseVisualizationComponent({
  databaseVisualization,
  width,
  height,
}: Props): ReactElement {
  const { database } = useDatabase(databaseVisualization?.settings.databaseId || '')
  const { pages, refetch } = useDatabaseQuery(databaseVisualization?.settings.databaseId || '')

  if (
    !pages ||
    !databaseVisualization ||
    !databaseVisualization.settings.databaseId ||
    !databaseVisualization.settings.xAxis
  ) {
    return <Spinner className="animate-spin mx-auto" />
  }

  const data = pages ? getDataFromSettings(pages, databaseVisualization.settings) : []
  const Chart = databaseVisualization.settings.type === 'bar' ? BarChart : LineChart
  const hasNoScaleSetting =
    !databaseVisualization.settings.yAxisScaleLeft &&
    !databaseVisualization.settings.yAxisScaleRight

  return (
    <div className="relative" style={{ width, height }}>
      <button className="absolute bottom-3 right-3 z-10" onClick={() => refetch()}>
        🔄
      </button>
      <ResponsiveContainer width={width} height={height}>
        <Chart data={data}>
          <XAxis dataKey="x" />
          <Tooltip />
          <Legend />
          {databaseVisualization.settings.yAxisScaleLeft && (
            <YAxis
              yAxisId="left"
              width={45}
              type="number"
              domain={[
                databaseVisualization.settings.yAxisScaleLeft.min || 'auto',
                databaseVisualization.settings.yAxisScaleLeft.max || 'auto',
              ]}
              orientation="left"
            />
          )}
          {databaseVisualization.settings.yAxisScaleRight && (
            <YAxis
              yAxisId="right"
              width={45}
              type="number"
              domain={[
                databaseVisualization.settings.yAxisScaleRight.min || 'auto',
                databaseVisualization.settings.yAxisScaleRight.max || 'auto',
              ]}
              orientation="right"
            />
          )}
          {databaseVisualization.settings.yAxis?.map((v, i) => (
            <React.Fragment key={i}>
              {hasNoScaleSetting && (
                <YAxis
                  yAxisId={v}
                  width={45}
                  type="number"
                  domain={['auto', 'auto']}
                  orientation={i % 2 === 0 ? 'left' : 'right'}
                />
              )}
              {databaseVisualization.settings.type === 'bar' ? (
                <Bar
                  yAxisId={hasNoScaleSetting ? v : i > 1 ? 'right' : 'left'}
                  key={v}
                  dataKey={v}
                  fill={notionColors[i]}
                  name={getPropertyName(v)}
                />
              ) : (
                <Line
                  key={v}
                  yAxisId={hasNoScaleSetting ? v : i > 1 ? 'right' : 'left'}
                  type="linear"
                  dataKey={v}
                  strokeWidth={2}
                  stroke={notionColors[i]}
                  dot={false}
                  connectNulls
                  name={getPropertyName(v)}
                />
              )}
            </React.Fragment>
          ))}
        </Chart>
      </ResponsiveContainer>
    </div>
  )

  function getDataFromSettings(
    pages: Page[],
    settings: DatabaseVisualizationSettings
  ): Array<Record<string, string>> {
    return pages
      .map((page) => {
        const pageValues = Object.values(page.properties)
        const datePropertyValue = pageValues.find((prop) => prop.id === settings.xAxis) as
          | SupportedDatePropertyValue
          | undefined

        if (!datePropertyValue) {
          return { x: new Date() }
        }

        const dateValue =
          datePropertyValue.type === 'created_time'
            ? datePropertyValue.created_time
            : datePropertyValue.type === 'last_edited_time'
            ? datePropertyValue.last_edited_time
            : datePropertyValue.date.start

        return {
          x: dateValue ? new Date(dateValue) : new Date(),
          ...(settings.yAxis || [])
            .map((v): { key: string; value: number | undefined } => {
              const value = pageValues.find((prop) => prop.id === v) as
                | NumberPropertyValue
                | FormulaPropertyValue
                | undefined
              return {
                key: v,
                value:
                  value?.type === 'number'
                    ? value.number
                    : value?.type === 'formula' && value.formula.type === 'number'
                    ? value.formula.number || undefined
                    : undefined,
              }
            })
            .reduce((acc, el) => ({ ...acc, [el.key]: el.value }), {}),
        }
      })
      .sort((a, b) => +a.x - +b.x)
      .filter((el) => {
        const [start, end] = settings.xAxisTimeFrame || []
        return (!start || +el.x > +new Date(start)) && (!end || +el.x < +new Date(end))
      })
      .map((el) => ({ ...el, x: `  ${format(el.x, 'PP')}  ` }))
  }

  function getPropertyName(propertyId: string) {
    return Object.keys(database?.properties || {}).find(
      (el) => database?.properties[el].id === propertyId
    )
  }
}
