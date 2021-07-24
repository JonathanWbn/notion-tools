import _ from 'lodash'
import {
  DatePropertyValue,
  InputPropertyValue,
  Property,
  SelectPropertyValue,
  TitlePropertyValue,
} from '@notionhq/client/build/src/api-types'
import { ReactElement, useState } from 'react'
import { IToolConfig } from '../../domain/User'
import { useDatabases } from '../api-client'
import { SelectInput } from './select-input'
import { Select } from './select'
import { TitleInput } from './title-input'
import { DateInput } from './date-input'

interface Props {
  initialValues: IToolConfig
  onSubmit: (values: IToolConfig) => Promise<void>
}

export function ToolConfigForm({ initialValues, onSubmit }: Props): ReactElement {
  const [values, setValues] = useState<IToolConfig>(initialValues)
  const { databases } = useDatabases()

  const databaseOptions = (databases || []).map((database) => ({
    value: database.id,
    label: database.title[0].plain_text,
  }))

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit(values)
  }

  function handleChange(name: string, value: unknown) {
    setValues({ ..._.set(values, name, value) })
  }

  const selectedDatabase = databases?.find((db) => db.id === values?.settings.databaseId)
  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <Select
        value={values.settings.databaseId}
        onChange={(v) => handleChange('settings.databaseId', v)}
        options={databaseOptions}
      >
        Database
      </Select>
      <Select
        value={values.settings.frequency}
        onChange={(v) => handleChange('settings.frequency', v)}
        options={frequencyOptions}
      >
        Frequency
      </Select>
      {values.settings.frequency === 'weekly' && (
        <Select
          value={values.settings.weekday}
          onChange={(v) => handleChange('settings.weekday', v)}
          options={weekdayOptions}
        >
          Day of week
        </Select>
      )}
      <label>
        Time of taks creation (UTC)
        <input
          value={values.settings.timeOfDay || ''}
          type="time"
          min="00:00"
          max="24:00"
          onChange={(e) => handleChange('settings.timeOfDay', e.target.value)}
        ></input>
      </label>
      {selectedDatabase && (
        <>
          <h2>Create page with properties</h2>
          {Object.entries(selectedDatabase.properties).map(([name, property]) => (
            <PropertyInput
              key={property.id}
              name={name}
              property={property}
              value={values.settings.properties?.[property.id]}
              onChange={(propertyValue) => {
                if (propertyValue) {
                  handleChange('settings.properties', {
                    ...values.settings.properties,
                    [property.id]: propertyValue,
                  })
                } else {
                  handleChange(
                    'settings.properties',
                    _.omit(values.settings.properties, property.id)
                  )
                }
              }}
            />
          ))}
        </>
      )}
      <button>Save</button>
    </form>
  )
}

export interface PropertyInputProps<P = Property, T = InputPropertyValue> {
  property: P
  name: string
  value: T | undefined
  onChange: (val: T | undefined) => void
}

function PropertyInput({ property, value, onChange, name }: PropertyInputProps): ReactElement {
  if (property.type === 'select') {
    return <SelectInput {...{ property, value: value as SelectPropertyValue, onChange, name }} />
  } else if (property.type === 'title') {
    return <TitleInput {...{ property, value: value as TitlePropertyValue, onChange, name }} />
  } else if (property.type === 'date') {
    return <DateInput {...{ property, value: value as DatePropertyValue, onChange, name }} />
  }

  return <></>
}

const weekdayOptions = [
  { value: 'mon', label: 'Monday' },
  { value: 'tues', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
  { value: 'sun', label: 'Sunday' },
]

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
]
