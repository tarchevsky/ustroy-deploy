import { useMemo } from 'react'
import type { FormField } from './contactForm.types'
import { getByPath } from './getByPath'

export function useContactFormProgress(fields: FormField[], watch: any) {
  // Считаем только поля второго шага, кроме captcha
  const progressStep = 2
  const progressFields = useMemo(
    () =>
      fields.filter(
        (f) =>
          (f.step || 1) === progressStep &&
          f.type !== 'captcha' &&
          f.type !== 'info',
      ),
    [fields],
  )
  const totalFields = progressFields.length
  // Считаем заполненные поля только для второго шага
  const watchedValues = watch()
  const filledFields = progressFields.filter((f) => {
    if (!f.name) return false // пропускаем поля без name
    const value = getByPath(watchedValues, f.name)
    if (f.type === 'checkbox')
      return Array.isArray(value) ? value.length > 0 : !!value
    if (f.type === 'radio') return !!value
    return value !== undefined && value !== null && value !== ''
  }).length
  // Минимум 10%, максимум 100%
  const percent =
    totalFields > 0
      ? Math.max(10, Math.round((filledFields / totalFields) * 100))
      : 100

  // Для шкалы: массив процентов для подписей (0% внизу, 100% вверху)
  const percentSteps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

  return { percent, percentSteps }
}
