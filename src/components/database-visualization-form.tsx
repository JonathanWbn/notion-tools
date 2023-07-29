'use client'

import {
  DatabaseVisualizationSettings,
  DatabaseVisualization,
} from '../domain/DatabaseVisualization'
import { updateDatabaseVisualization } from '../infrastructure/api-client'
import { Button } from './button'
import { DatabaseSelect } from './database-select'
import { DateRangeInput } from './date-range-input'
import { Trash } from './icons'
import { Select } from './select'
import { useAutoSave } from './useAutoSave'
import {
  CreatedTimeProperty,
  CreatedTimePropertyValue,
  Database,
  DateProperty,
  DatePropertyValue,
  FormulaProperty,
  LastEditedTimeProperty,
  LastEditedTimePropertyValue,
  NumberProperty,
} from '@notionhq/client/build/src/api-types'
import { useRouter } from 'next/navigation'
import { ReactElement, useState } from 'react'

export type SupportedDateProperty = DateProperty | CreatedTimeProperty | LastEditedTimeProperty
export type SupportedDatePropertyValue =
  | DatePropertyValue
  | CreatedTimePropertyValue
  | LastEditedTimePropertyValue

interface Props {
  initialValues: DatabaseVisualization['settings']
  databases: Database[]
  id: string
}

export function DatabaseVisualizationForm({ initialValues, id, databases }: Props): ReactElement {
  const router = useRouter()
  const [values, setValues] = useState<DatabaseVisualization['settings']>(initialValues)

  async function onSave(settings: DatabaseVisualizationSettings) {
    await updateDatabaseVisualization(id, { settings })
    router.refresh()
  }

  useAutoSave(onSave, values, initialValues)

  const selectedDatabase = databases.find((db) => db.id === values.databaseId)

  const dateProperties = Object.entries(selectedDatabase?.properties || {}).filter(
    (entry): entry is [string, SupportedDateProperty] =>
      entry[1].type === 'date' ||
      entry[1].type === 'created_time' ||
      entry[1].type === 'last_edited_time'
  )
  const numberProperties = Object.entries(selectedDatabase?.properties || {}).filter(
    (entry): entry is [string, NumberProperty | FormulaProperty] =>
      entry[1].type === 'number' || entry[1].type === 'formula'
  )

  return (
    <>
      <div className="flex justify-between my-1 items-center">
        <span className="text-lg">Database</span>
        <DatabaseSelect
          databases={databases}
          value={values.databaseId}
          onChange={(v) => {
            setValues({ ...values, databaseId: v, xAxis: undefined, yAxis: undefined })
          }}
        />
      </div>
      {selectedDatabase && (
        <>
          <label className="flex justify-between my-1 items-center">
            <span className="text-lg">X Axis</span>
            <Select
              value={values.xAxis}
              onChange={(v) => setValues({ ...values, xAxis: v })}
              options={dateProperties.map(([name, prop]) => ({ label: name, value: prop.id }))}
            />
          </label>
          {values.xAxis && (
            <label className="flex justify-between my-1 items-center">
              <span className="text-lg">X Axis Timeframe</span>
              <DateRangeInput
                value={values.xAxisTimeFrame}
                onChange={(v) => setValues({ ...values, xAxisTimeFrame: v })}
              />
            </label>
          )}
          <label className="flex justify-between my-1 items-center">
            <span className="text-lg">Chart Type</span>
            <Select
              value={values.type}
              onChange={(v) => setValues({ ...values, type: v as 'line' | 'bar' })}
              noEmptyOption
              options={[
                { value: 'line', label: 'Line' },
                { value: 'bar', label: 'Bar' },
              ]}
            />
          </label>
          <label className="flex justify-between my-1 items-center">
            <span className="text-lg">Scale Left (optional)</span>
            <div className="flex justify-between items-center">
              <input
                type="number"
                value={values.yAxisScaleLeft?.min}
                placeholder="Min"
                onChange={(e) =>
                  setValues({
                    ...values,
                    yAxisScaleLeft: {
                      min: parseInt(e.target.value, 10),
                      max: values.yAxisScaleLeft?.max,
                    },
                  })
                }
                className="border w-20 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400 mr-1"
              />
              <input
                type="number"
                value={values.yAxisScaleLeft?.max}
                placeholder="Max"
                onChange={(e) =>
                  setValues({
                    ...values,
                    yAxisScaleLeft: {
                      min: values.yAxisScaleLeft?.min,
                      max: parseInt(e.target.value, 10),
                    },
                  })
                }
                className="border w-20 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400"
              />
            </div>
          </label>
          <label className="flex justify-between my-1 items-center">
            <span className="text-lg">Scale Right (optional)</span>
            <div className="flex justify-between items-center">
              <input
                type="number"
                value={values.yAxisScaleRight?.min}
                placeholder="Min"
                onChange={(e) =>
                  setValues({
                    ...values,
                    yAxisScaleRight: {
                      min: parseInt(e.target.value, 10),
                      max: values.yAxisScaleRight?.max,
                    },
                  })
                }
                className="border w-20 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400 mr-1"
              />
              <input
                type="number"
                value={values.yAxisScaleRight?.max}
                placeholder="Max"
                onChange={(e) =>
                  setValues({
                    ...values,
                    yAxisScaleRight: {
                      min: values.yAxisScaleRight?.min,
                      max: parseInt(e.target.value, 10),
                    },
                  })
                }
                className="border w-20 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400"
              />
            </div>
          </label>
          {values.yAxis?.map((value, i) => (
            <label className="flex justify-between my-1 items-center" key={`${value}-${i}`}>
              <span className="text-lg">Y Axis ({i + 1})</span>
              <div className="flex justify-between items-center">
                <Select
                  value={value}
                  onChange={(v) => {
                    const newValue = values.yAxis ? [...values.yAxis] : []
                    newValue[i] = v
                    setValues({ ...values, yAxis: newValue })
                  }}
                  options={numberProperties.map(([name, prop]) => ({
                    label: name,
                    value: prop.id,
                  }))}
                />
                <Trash
                  onClick={() => {
                    const newValue = values.yAxis ? [...values.yAxis] : []
                    newValue.splice(i, 1)
                    setValues({ ...values, yAxis: newValue })
                  }}
                  className="cursor-pointer ml-2"
                />
              </div>
            </label>
          ))}
          <Button
            className="self-start"
            color="blue"
            onClick={() =>
              setValues({ ...values, yAxis: values.yAxis ? [...values.yAxis, ''] : [''] })
            }
          >
            Add value for Y axis
          </Button>
        </>
      )}
    </>
  )
}
