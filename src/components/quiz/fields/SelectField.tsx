import ErrorMessage from '../ErrorMessage'

interface SelectFieldProps {
  field: any
  register: any
  errors: any
}

const SelectField: React.FC<SelectFieldProps> = ({
  field,
  register,
  errors,
}) => {
  if (!field.options) return null

  return (
    <>
      <div className="form-control">
        <select
          {...register(field.name, { required: field.required })}
          className="select select-bordered w-full"
        >
          <option value="">Выберите вариант</option>
          {field.options.map((option: { label?: string; value: string }) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <ErrorMessage
        message={
          errors[field.name] ? field.error || 'Это поле обязательно' : undefined
        }
      />
    </>
  )
}

export default SelectField
