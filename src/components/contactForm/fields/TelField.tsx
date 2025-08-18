import { useLocalStorage } from '@/hooks/useLocalStorage'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import { Controller } from 'react-hook-form'
import type { FormField } from '../contactForm.types'
import ErrorMessage from '../ErrorMessage'

interface TelFieldProps {
  field: FormField
  control: any
  errors: any
}

const TelField: React.FC<TelFieldProps> = ({ field, control, errors }) => {
  if (!field.name) return null
  const { removeItem } = useLocalStorage()

  return (
    <div className="form-control w-full">
      {field.title && (
        <label className="label" htmlFor={field.name}>
          <span className="label-text">{field.title}</span>
        </label>
      )}
      <Controller
        name={field.name}
        control={control}
        rules={{
          required: field.required,
          validate: (value) => {
            if (!field.required && !value) return true

            const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/
            return phoneRegex.test(value) || 'Введите корректный номер телефона'
          },
        }}
        render={({ field: { onChange, value } }) => {
          const handlePhoneChange = (inputValue: string) => {
            const formattedValue = formatPhoneNumber(inputValue)
            onChange(formattedValue)
            if (!formattedValue && field.name) {
              removeItem(field.name)
            }
          }

          return (
            <input
              type="tel"
              id={field.name}
              value={value || ''}
              required={field.required}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onInput={(e) => {
                // Дополнительная обработка для автозаполнения на мобильных
                const target = e.target as HTMLInputElement
                handlePhoneChange(target.value)
              }}
              onPaste={(e) => {
                // Обработка вставки номера из буфера обмена
                e.preventDefault()
                const paste = e.clipboardData?.getData('text') || ''
                handlePhoneChange(paste)
              }}
              placeholder={field.placeholder}
              className="input input-bordered w-full"
              autoComplete="tel"
            />
          )
        }}
      />
      <ErrorMessage
        message={
          errors[field.name]
            ? (errors[field.name]?.message as string) ||
              field.error ||
              'Это поле обязательно'
            : undefined
        }
      />
    </div>
  )
}

export default TelField
