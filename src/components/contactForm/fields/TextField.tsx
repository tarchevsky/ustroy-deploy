import type { FieldRenderProps as QuizFieldRenderProps } from '../../quiz/quiz.types'
import type { FormField } from '../contactForm.types'

type FieldRenderProps = Omit<QuizFieldRenderProps, 'field'> & {
  field: FormField
}

type TextFieldProps = Pick<FieldRenderProps, 'field' | 'register' | 'errors'>

const TextField = ({ field, register, errors }: TextFieldProps) => {
  if (!field.name) return null
  return (
    <div className="w-full">
      <input
        type={field.type}
        id={field.name}
        {...register(field.name, {
          required: field.required,
          ...(field.type === 'email' && {
            validate: (value: string) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              return (
                emailRegex.test(value) || 'Пожалуйста, введите корректный email'
              )
            },
          }),
        })}
        required={field.required}
        placeholder={field.placeholder}
        className="input input-bordered w-full text-base"
      />
    </div>
  )
}

export default TextField
