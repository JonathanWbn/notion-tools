import _ from 'lodash'
import {
  CheckboxPropertyValue,
  DatePropertyValue,
  InputPropertyValue,
  NumberPropertyValue,
  Property,
  RichTextPropertyValue,
  SelectPropertyValue,
  TitlePropertyValue,
} from '@notionhq/client/build/src/api-types'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { IToolConfig } from '../../domain/User'
import { useDatabases } from '../api-client'
import { SelectInput } from './select-input'
import { Select } from './select'
import { TitleInput } from './title-input'
import { TextInput } from './text-input'
import { CheckboxInput } from './checkbox-input'
import { NumberInput } from './number-input'
import { DateInput } from './date-input'

interface Props {
  initialValues: IToolConfig['settings']
  onAutoSave: (values: IToolConfig['settings']) => Promise<void>
}

export function ToolConfigForm({ initialValues, onAutoSave }: Props): ReactElement {
  const [values, setValues] = useState<IToolConfig['settings']>(initialValues)
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
      setValues({ ...values, properties: {}, [name]: value as string })
    } else {
      setValues({ ...values, [name]: value })
    }
  }

  const selectedDatabase = databases?.find((db) => db.id === values.databaseId)
  return (
    <>
      <label className="flex justify-between mb-2">
        <span className="text-lg">Database</span>
        <Select
          value={values.databaseId}
          onChange={(v) => handleChange('databaseId', v)}
          options={databaseOptions}
        />
      </label>
      <label className="flex justify-between mb-2">
        <span className="text-lg">Frequency</span>
        <Select
          value={values.frequency}
          onChange={(v) => handleChange('frequency', v)}
          options={frequencyOptions}
        />
      </label>
      {values.frequency === 'weekly' && (
        <label className="flex justify-between mb-2">
          <span className="text-lg">Day of week</span>
          <Select
            value={values.weekday}
            onChange={(v) => handleChange('weekday', v)}
            options={weekdayOptions}
          />
        </label>
      )}
      <label className="flex justify-between">
        <span className="text-lg">Time of creation (UTC)</span>
        <input
          value={values.timeOfDay || ''}
          className="border w-40 text-sm p-2 appearance-none focus:outline-none focus:border-gray-400"
          type="time"
          min="00:00"
          max="24:00"
          onChange={(e) => handleChange('timeOfDay', e.target.value)}
        ></input>
      </label>
      {selectedDatabase && (
        <>
          <div className="w-full border-b border-opacity-80 my-5" />
          <h1 className="text-2xl mb-2">Fields</h1>
          {Object.entries(selectedDatabase.properties)
            .sort(([, property]) => (property.id === 'title' ? -1 : 0))
            .map(([name, property]) => (
              <PropertyInput
                key={property.id}
                name={name}
                property={property}
                value={values.properties?.[property.id]}
                onChange={(propertyValue) => {
                  if (propertyValue) {
                    handleChange('properties', {
                      ...values.properties,
                      [property.id]: propertyValue,
                    })
                  } else {
                    handleChange('properties', _.omit(values.properties, property.id))
                  }
                }}
              />
            ))}
        </>
      )}
    </>
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
  } else if (property.type === 'rich_text') {
    return <TextInput {...{ property, value: value as RichTextPropertyValue, onChange, name }} />
  } else if (property.type === 'checkbox') {
    return (
      <CheckboxInput {...{ property, value: value as CheckboxPropertyValue, onChange, name }} />
    )
  } else if (property.type === 'number') {
    return <NumberInput {...{ property, value: value as NumberPropertyValue, onChange, name }} />
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
