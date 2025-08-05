'use client'

import React, { useRef, useState } from 'react'
import FadeIn from '../fadeIn/FadeIn'
import Modal from '../modal/Modal'
import type { ModalHandle } from '../modal/modal.types'
import type { TextWithButtonProps } from './types'

interface TextWithButtonExtendedProps extends TextWithButtonProps {
  text?: string
  btnText?: string
  onClick?: () => void
  inlineFirstStep?: boolean
}

const TextWithButton = ({
  modalContent,
  closeIcon,
  text,
  btnText,
  onClick,
  inlineFirstStep,
}: TextWithButtonExtendedProps) => {
  const modalRef = useRef<ModalHandle>(null)
  const [modalMessage, setModalMessage] = useState<string | null>(null)

  const handleButtonClick = () => {
    if (modalRef.current && modalContent) {
      setModalMessage(null)
      modalRef.current.showModal()
    }
  }

  const handleSuccess = (message: string) => {
    setModalMessage(message)
  }

  const handleModalClose = () => {
    setModalMessage(null)
  }

  const renderModalContent = () => {
    if (modalMessage) {
      return <p className="py-4">{modalMessage}</p>
    }

    if (React.isValidElement(modalContent)) {
      const element = modalContent as React.ReactElement<any> // Changed from ModalContentProps to any
      return React.cloneElement(element, {
        onSuccess: handleSuccess,
        closeIcon: closeIcon,
        inlineFirstStep: true,
      })
    }

    return modalContent
  }

  if (!modalContent) {
    return (
      <section className="ind mt-8">
        <div className="mr-[3vw] md:mr-[32vw]">
          <FadeIn className="ind cont-left bg-white rounded-r-box pl-2">
            <div className="mt-16 flex flex-col md:flex-row items-center justify-between md:gap-4">
              <p
                className="text-2xl font-normal py-6 lg:py-0"
                style={{ fontFamily: 'Unbounded Variable, sans-serif' }}
              >
                {text || 'Остались вопросы?'}
              </p>
              <button
                className="btn btn-lg btn-block btn-primary text-white hover:bg-white hover:text-primary hover:border-primary hover:border-2 md:btn-wide my-2 md:my-4 mr-4"
                type="button"
                onClick={onClick}
              >
                {btnText || 'Задать вопрос'}
              </button>
            </div>
          </FadeIn>
        </div>
      </section>
    )
  }

  return (
    <FadeIn className="ind bg-white">
      <div className="mt-16 flex items-center justify-between">
        <p className="text-2xl">{text || 'Остались вопросы?'}</p>
        <button className="btn btn-lg" onClick={onClick} type="button">
          {btnText || 'Задать вопрос'}
        </button>
      </div>

      {modalContent && <Modal ref={modalRef}>{renderModalContent()}</Modal>}
    </FadeIn>
  )
}

export default TextWithButton
