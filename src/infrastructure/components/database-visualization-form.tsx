import {
  CreatedTimeProperty,
  DateProperty,
  LastEditedTimeProperty,
  NumberProperty,
} from '@notionhq/client/build/src/api-types'
import { ReactElement, useState } from 'react'
import { useDatabases } from '../api-client'
import { Select } from './select'
import { IDatabaseVisualization } from '../../domain/DatabaseVisualization'
import { useAutoSave } from './useAutoSave'
import { Button } from '../components/button'
import { Trash } from '../components/icons'

interface Props {
  initialValues: IDatabaseVisualization['settings']
  onAutoSave: (values: IDatabaseVisualization['settings']) => Promise<void>
}

export function DatabaseVisualizationForm({ initialValues, onAutoSave }: Props): ReactElement {
  const [values, setValues] = useState<IDatabaseVisualization['settings']>(initialValues)
  const { databases } = useDatabases()
  useAutoSave(onAutoSave, values, initialValues)

  const databaseOptions = (databases || []).map((database) => ({
    value: database.id,
    label: database.title[0].plain_text,
  }))

  const selectedDatabase = databases?.find((db) => db.id === values.databaseId)

  const dateProperties = Object.entries(selectedDatabase?.properties || {}).filter(
    (entry): entry is [string, DateProperty | CreatedTimeProperty | LastEditedTimeProperty] =>
      entry[1].type === 'date' ||
      entry[1].type === 'created_time' ||
      entry[1].type === 'last_edited_time'
  )
  const numberProperties = Object.entries(selectedDatabase?.properties || {}).filter(
    (entry): entry is [string, NumberProperty] => entry[1].type === 'number'
  )

  return (
    <>
      <label className="flex justify-between my-1 items-center">
        <span className="text-lg">Database</span>
        <Select
          value={values.databaseId}
          onChange={(v) => {
            setValues({ ...values, databaseId: v, xAxis: undefined, yAxis: undefined })
          }}
          options={databaseOptions}
        />
      </label>
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
