import _ from 'lodash'
import {
  CheckboxPropertyValue,
  DatePropertyValue,
  InputPropertyValue,
  MultiSelectPropertyValue,
  NumberPropertyValue,
  Property,
  RichTextPropertyValue,
  SelectPropertyValue,
  TitlePropertyValue,
  URLPropertyValue,
} from '@notionhq/client/build/src/api-types'
import { ReactElement, useState } from 'react'
import { useDatabases } from '../api-client'
import { SelectInput } from './select-input'
import { Select } from './select'
import { TitleInput } from './title-input'
import { TextInput } from './text-input'
import { CheckboxInput } from './checkbox-input'
import { NumberInput } from './number-input'
import { DateInput } from './date-input'
import { IRecurringTask } from '../../domain/RecurringTask'
import { useAutoSave } from './useAutoSave'
import { DatabaseSelect } from './database-select'
import { URLInput } from './url-input'
import { MultiSelectInput } from './multi-select-input'

interface Props {
  initialValues: IRecurringTask['settings']
  onAutoSave: (values: IRecurringTask['settings']) => Promise<void>
}

export function RecurringTaskForm({ initialValues, onAutoSave }: Props): ReactElement {
  const [values, setValues] = useState<IRecurringTask['settings']>(initialValues)
  const { databases } = useDatabases()
  useAutoSave(onAutoSave, values, initialValues)

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
      <div className="flex justify-between mb-2">
        <span className="text-lg">Database</span>
        <DatabaseSelect value={values.databaseId} onChange={(v) => handleChange('databaseId', v)} />
      </div>
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
      {values.frequency === 'monthly' && (
        <label className="flex justify-between mb-2">
          <span className="text-lg">Day of month</span>
          <Select
            value={`${values.dayOfMonth}`}
            onChange={(v) => handleChange('dayOfMonth', +v)}
            options={dayOfMonthOptions}
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
  } else if (property.type === 'multi_select') {
    return (
      <MultiSelectInput
        {...{ property, value: value as MultiSelectPropertyValue, onChange, name }}
      />
    )
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
  } else if (property.type === 'url') {
    return <URLInput {...{ property, value: value as URLPropertyValue, onChange, name }} />
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

const dayOfMonthOptions = [
  { value: '1', label: '1st' },
  { value: '2', label: '2nd' },
  { value: '3', label: '3rd' },
  { value: '4', label: '4th' },
  { value: '5', label: '5th' },
  { value: '6', label: '6th' },
  { value: '7', label: '7th' },
  { value: '8', label: '8th' },
  { value: '9', label: '9th' },
  { value: '10', label: '10th' },
  { value: '11', label: '11th' },
  { value: '12', label: '12th' },
  { value: '13', label: '13th' },
  { value: '14', label: '14th' },
  { value: '15', label: '15th' },
  { value: '16', label: '16th' },
  { value: '17', label: '17th' },
  { value: '18', label: '18th' },
  { value: '19', label: '19th' },
  { value: '20', label: '20th' },
  { value: '21', label: '21st' },
  { value: '22', label: '22nd' },
  { value: '23', label: '23rd' },
  { value: '24', label: '24th' },
  { value: '25', label: '25th' },
  { value: '26', label: '26th' },
  { value: '27', label: '27th' },
  { value: '28', label: '28th' },
]

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]
