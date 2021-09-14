/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'
import { useEffect, useRef } from 'react'

export function useAutoSave(
  cb: (val: any) => Promise<void>,
  values: Record<string, any>,
  initialValues: Record<string, any>
): void {
  const debouncedOnAutoSave = useRef(_.debounce(cb, 500))

  useEffect(() => {
    if (JSON.stringify(values) !== JSON.stringify(initialValues)) {
      debouncedOnAutoSave.current(values)
      return debouncedOnAutoSave.current.cancel
    }
  }, [values])
}
