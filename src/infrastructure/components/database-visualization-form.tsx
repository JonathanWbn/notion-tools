import _ from 'lodash'
import {
  CreatedTimeProperty,
  DateProperty,
  LastEditedTimeProperty,
  NumberProperty,
} from '@notionhq/client/build/src/api-types'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { useDatabases } from '../api-client'
import { Select } from './select'
import { IDatabaseVisualization } from '../../domain/DatabaseVisualization'

interface Props {
  initialValues: IDatabaseVisualization['settings']
  onAutoSave: (values: IDatabaseVisualization['settings']) => Promise<void>
}

export function DatabaseVisualizationForm({ initialValues, onAutoSave }: Props): ReactElement {
  const [values, setValues] = useState<IDatabaseVisualization['settings']>(initialValues)
  const { databases } = useDatabases()

  const debouncedOnAutoSave = useRef(_.debounce(onAutoSave, 500))

  useEffect(() => {
    if (JSON.stringify(values) !== JSON.stringify(initialValues)) {
      debouncedOnAutoSave.current(values)
      return debouncedOnAutoSave.current.cancel
    }
  }, [values])

  const databaseOptions = (databases || []).map((database) => ({
    value: database.id,
    label: database.title[0].plain_text,
  }))

  function handleChange(name: string, value: unknown) {
    if (name === 'databaseId' && value !== values.databaseId) {
      // todo reset
      setValues({ ...values, [name]: value as string })
    } else {
      setValues({ ...values, [name]: value })
    }
  }

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
          onChange={(v) => handleChange('databaseId', v)}
          options={databaseOptions}
        />
      </label>
      {selectedDatabase && (
        <>
          <label className="flex justify-between my-1 items-center">
            <span className="text-lg">X Axis</span>
            <Select
              value={values.xAxis}
              onChange={(v) => handleChange('xAxis', v)}
              options={dateProperties.map(([name, prop]) => ({ label: name, value: prop.id }))}
            />
          </label>
          <label className="flex justify-between my-1 items-center">
            <span className="text-lg">Y Axis</span>
            <Select
              value={values.yAxis}
              onChange={(v) => handleChange('yAxis', v)}
              options={numberProperties.map(([name, prop]) => ({ label: name, value: prop.id }))}
            />
          </label>
        </>
      )}
    </>
  )
}
