'use client'

import { useState } from 'react'
import ContactForm from './ContactForm'

import type { FormField } from './contactForm.types'
import StepCounter from './StepCounter'

interface ModalContactFormProps {
  fields: FormField[]
  onSuccess?: (message: string) => void
  message?: string
  closeIcon?: boolean
  title?: string
  fullScreen?: boolean
  contentClassName?: string
  showStepCounter?: boolean
  inlineFirstStep?: boolean
  descr?: string
}

const ModalContactForm = ({
  title,
  fields,
  onSuccess,
  message,
  closeIcon,
  fullScreen,
  contentClassName,
  showStepCounter = true,
  inlineFirstStep = false,
  descr,
}: ModalContactFormProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const maxSteps = Math.max(...fields.map((field) => field.step || 1))

  // descr для текущего шага, если есть
  const stepDescr =
    fields.find((f) => (f.step || 1) === currentStep && f.descr)?.descr || descr

  return (
    <>
      {title && (
        <h4 className="mt-16 ind-sm text-[28px] md:text-[32px] font-medium uppercase">
          {title}
        </h4>
      )}
      {showStepCounter && (
        <StepCounter currentStep={currentStep} maxSteps={maxSteps} />
      )}
      {stepDescr && (
        <p
          className="text-black"
          dangerouslySetInnerHTML={{ __html: stepDescr }}
        />
      )}

      <ContactForm
        fields={fields}
        useParentModal
        onSuccess={onSuccess}
        message={message}
        closeIcon={closeIcon}
        showStepCounter={showStepCounter}
        onStepChange={setCurrentStep}
        inlineFirstStep={inlineFirstStep}
      />
    </>
  )
}

export default ModalContactForm
