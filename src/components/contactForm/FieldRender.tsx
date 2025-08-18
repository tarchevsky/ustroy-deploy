import type { FieldErrors, UseFormReturn } from 'react-hook-form'
import SelectField from '../quiz/fields/SelectField'
import ErrorMessage from './ErrorMessage'
import type { FormField, IFormInput } from './contactForm.types'
import Captcha from './fields/Captcha'
import { CheckboxField } from './fields/CheckboxField'
import FileField from './fields/FileField'
import { RadioField } from './fields/RadioField'
import TelField from './fields/TelField'
import { getByPath } from './getByPath'

export interface FieldRenderProps {
  field: FormField
  form: UseFormReturn<IFormInput>
  errors: FieldErrors<IFormInput>
  resetCaptcha?: boolean
  resetTrigger?: boolean
}

const FieldRender = ({
  field,
  form,
  errors,
  resetCaptcha,
  resetTrigger,
}: FieldRenderProps) => {
  const { register, control, setError, clearErrors, watch } = form

  const renderInput = () => {
    switch (field.type) {
      case 'tel':
        return <TelField field={field} control={control} errors={errors} />

      case 'file':
        return <FileField field={field} register={register} errors={errors} />

      case 'checkbox':
        return field.name ? (
          <CheckboxField
            {...field}
            value={field.name ? (watch(field.name) as string[]) || [] : []}
            onChange={
              field.name
                ? (value) => form.setValue(field.name!, value)
                : () => {}
            }
            error={field.name ? errors[field.name]?.message : undefined}
            resetTrigger={resetTrigger}
          />
        ) : null

      case 'radio':
        return field.name ? (
          <RadioField
            {...field}
            value={field.name ? (watch(field.name) as string) || '' : ''}
            onChange={
              field.name
                ? (value) => form.setValue(field.name!, value)
                : () => {}
            }
            error={field.name ? errors[field.name]?.message : undefined}
            resetTrigger={resetTrigger}
          />
        ) : null

      case 'captcha':
        return (
          <Captcha
            register={register}
            errors={errors}
            setError={setError}
            clearErrors={clearErrors}
            onReset={() => {
              // Этот колбэк будет вызван при генерации новых чисел
            }}
            resetKey={resetCaptcha}
          />
        )

      case 'select':
        return field.name ? (
          <SelectField field={field} register={register} errors={errors} />
        ) : null

      case 'textarea':
        return field.name ? (
          <textarea
            placeholder={field.placeholder}
            {...register(field.name, {
              required: field.required,
            })}
            className="textarea textarea-bordered w-full h-24 text-base"
          />
        ) : null

      case 'info':
        return (
          <div
            className="uppercase"
            dangerouslySetInnerHTML={{ __html: field.content || '' }}
          />
        )

      default:
        const validationRules = {
          required: field.required && 'Это поле обязательно',
          ...(field.pattern && {
            pattern: {
              value: new RegExp(field.pattern, field.patternFlags),
              message: field.error || 'Неверный формат',
            },
          }),
        }

        return field.name ? (
          <input
            type={field.type}
            placeholder={field.placeholder}
            {...register(field.name, validationRules)}
            className="input input-bordered w-full"
          />
        ) : null
    }
  }

  return (
    <div className="form-control w-full">
      {field.type !== 'checkbox' && field.type !== 'captcha' && (
        <label className="label">
          <span className="label-text">{field.title}</span>
        </label>
      )}
      {renderInput()}
      {field.type !== 'tel' &&
        field.type !== 'captcha' &&
        field.type !== 'checkbox' &&
        field.type !== 'file' &&
        field.type !== 'radio' &&
        field.type !== 'info' && (
          <ErrorMessage
            message={(() => {
              if (!field.name) return undefined // пропускаем поля без name
              const err = getByPath(errors, field.name)
              return err
                ? err.message || field.error || 'Это поле обязательно'
                : undefined
            })()}
          />
        )}
    </div>
  )
}

export default FieldRender
