'use client'
import type { ModalHandle } from '@/components/modal/modal.types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { removeStorageItem, STORAGE_KEYS } from '@/utils/storage'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import ProgressScale from '../ui/ProgressScale'
import type { FormField, IFormInput } from './contactForm.types'
import FieldRender from './FieldRender'

import { useContactFormProgress } from './useContactFormProgress'
import { useFormValidation } from './useFormValidation'

const Modal = lazy(() => import('@/components/modal/Modal'))

interface IContactFormProps {
  fields: FormField[]
  useParentModal?: boolean
  onSuccess?: (message: string) => void
  message?: string
  closeIcon?: boolean
  showProgressScale?: boolean
  formEmail?: boolean
  showStepCounter?: boolean
  onStepChange?: (step: number) => void
  inlineFirstStep?: boolean
  descr?: string
}

const ContactForm = ({
  fields,
  useParentModal,
  onSuccess,
  message,
  closeIcon,
  showProgressScale = true,
  formEmail = false,
  showStepCounter = false,
  onStepChange,
  inlineFirstStep = false,
  descr,
}: IContactFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [resetCaptcha, setResetCaptcha] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(false)
  const [wasSubmitted, setWasSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const maxSteps = Math.max(...fields.map((field) => field.step || 1))

  useEffect(() => {
    onStepChange?.(currentStep)
  }, [currentStep, onStepChange])
  const modalRef = useRef<ModalHandle>(null)
  const { removeItem } = useLocalStorage()
  const form = useFormValidation(fields)
  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
    clearErrors,
    watch,
  } = form

  // --- Шкала заполнения ---
  const { percent, percentSteps } = useContactFormProgress(fields, watch)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleModalClose = () => {
    // Просто закрываем модальное окно без сброса формы
  }

  const onSubmit = async (data: IFormInput) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      let res
      if (formEmail) {
        res = await fetch('/api/formEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fields, values: data }),
        })
      } else {
        res = await fetch('/api/formCrm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      }

      const result = await res.json()

      if (result.success) {
        setWasSubmitted(true)
        const resetValues = fields.reduce(
          (acc, field) => {
            if (field.name) acc[field.name] = ''
            return acc
          },
          {} as Record<string, string>,
        )

        reset(resetValues, {
          keepErrors: false,
          keepDirty: false,
          keepTouched: false,
          keepIsSubmitted: false,
          keepIsValid: false,
          keepDefaultValues: false,
        })
        clearErrors()
        setResetCaptcha((prev) => !prev)
        setResetTrigger((prev) => !prev)
        removeStorageItem(STORAGE_KEYS.CONTACT_FORM_DATA)

        fields.forEach((field) => {
          if (field.type === 'radio' || field.type === 'checkbox') {
            if (field.name) removeItem(field.name)
          }
        })

        const successMessage =
          message ||
          'Ваше обращение отправлено! Спасибо за проявленный интерес!'

        if (useParentModal && onSuccess) {
          onSuccess(successMessage)
        } else {
          modalRef.current?.showModal()
        }
      } else {
        setSubmitError(result.message || 'Не удалось отправить сообщение')
        setWasSubmitted(false)
        if (useParentModal && onSuccess) {
          onSuccess('Форма не отправлена')
        } else {
          modalRef.current?.showModal()
        }
      }
    } catch (error) {
      setSubmitError('Произошла ошибка при отправке формы')
      setWasSubmitted(false)
      if (useParentModal && onSuccess) {
        onSuccess('Форма не отправлена')
      } else {
        modalRef.current?.showModal()
      }
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : (
        <div className="flex flex-row gap-4 items-start">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 flex-1"
            noValidate
          >
            {currentStep === 1 && inlineFirstStep ? (
              (() => {
                const firstStepFields = fields.filter(
                  (field) => (field.step || 1) === 1,
                )
                const isRow = firstStepFields.some(
                  (field) => field.layout === 'row',
                )

                // Если первый шаг в строку, то выводим поля в строку

                if (isRow) {
                  return (
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start">
                      {firstStepFields.map((field, idx) => (
                        <div
                          key={field.name ? field.name : `info-${idx}`}
                          className="w-full min-h-[56px]"
                        >
                          <FieldRender
                            field={field}
                            form={form}
                            errors={errors}
                            resetCaptcha={resetCaptcha}
                            resetTrigger={resetTrigger}
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-primary text-white w-full md:w-auto whitespace-nowrap self-center mt-2"
                        onClick={async (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const currentFields = fields.filter(
                            (f) => (f.step || 1) === currentStep,
                          )
                          const names = currentFields
                            .map((f) => f.name)
                            .filter(Boolean) as string[]
                          const valid = await form.trigger(names)
                          if (valid) {
                            setCurrentStep((step) =>
                              Math.min(maxSteps, step + 1),
                            )
                          }
                        }}
                      >
                        Далее
                      </button>
                    </div>
                  )
                } else {
                  return (
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {firstStepFields.map((field, idx) => (
                          <div
                            key={field.name ? field.name : `info-${idx}`}
                            className="w-full"
                          >
                            <FieldRender
                              field={field}
                              form={form}
                              errors={errors}
                              resetCaptcha={resetCaptcha}
                              resetTrigger={resetTrigger}
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary text-white w-full md:w-auto whitespace-nowrap"
                        onClick={async (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const currentFields = fields.filter(
                            (f) => (f.step || 1) === currentStep,
                          )
                          const names = currentFields
                            .map((f) => f.name)
                            .filter(Boolean) as string[]
                          const valid = await form.trigger(names)
                          if (valid) {
                            setCurrentStep((step) =>
                              Math.min(maxSteps, step + 1),
                            )
                          }
                        }}
                      >
                        Далее
                      </button>
                    </div>
                  )
                }
              })()
            ) : (
              <>
                <div className="flex flex-col">
                  {fields
                    .filter((field) => (field.step || 1) === currentStep)
                    .map((field, idx) => (
                      <FieldRender
                        key={field.name ? field.name : `info-${idx}`}
                        field={field}
                        form={form}
                        errors={errors}
                        resetCaptcha={resetCaptcha}
                        resetTrigger={resetTrigger}
                      />
                    ))}
                </div>

                {currentStep > 1 && (
                  <div className="flex gap-4 justify-between flex-wrap mt-4">
                    <button
                      type="button"
                      className="btn btn-block md:btn-wide"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setCurrentStep((step) => Math.max(1, step - 1))
                      }}
                    >
                      Назад
                    </button>

                    {currentStep < maxSteps ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const currentFields = fields.filter(
                            (f) => (f.step || 1) === currentStep,
                          )
                          const isValid = currentFields.every(
                            (f) => !f.name || !errors[f.name],
                          )
                          if (isValid) {
                            setCurrentStep((step) =>
                              Math.min(maxSteps, step + 1),
                            )
                          }
                        }}
                      >
                        Далее
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-block md:btn-wide btn-primary text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Отправка...' : 'Разместить заказ'}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {!useParentModal && (
              <Suspense fallback={null}>
                <Modal
                  ref={modalRef}
                  message={
                    wasSubmitted
                      ? message ||
                        'Ваше обращение отправлено! Спасибо за проявленный интерес!'
                      : submitError
                        ? 'Форма не отправлена'
                        : ''
                  }
                  closeIcon={closeIcon}
                />
              </Suspense>
            )}
          </form>
          {/* Шкала заполнения */}
          {showProgressScale && currentStep === 2 && (
            <ProgressScale percent={percent} percentSteps={percentSteps} />
          )}
        </div>
      )}
    </>
  )
}

export default ContactForm
