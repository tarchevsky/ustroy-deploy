'use client'

import { contactFormFields } from '@/app/contactFormFields'
import ModalContactForm from '@/components/contactForm/ModalContactForm'
import Modal from '@/components/modal/Modal'
import type { ModalHandle } from '@/components/modal/modal.types'
import { useRef, useState } from 'react'

const Brief = ({ btnText = 'Обсудить проект', className = '' }) => {
  const modalRef = useRef<ModalHandle>(null)
  const [modalMessage, setModalMessage] = useState<string | null>(null)

  const handleButtonClick = () => {
    setModalMessage(null)
    modalRef.current?.showModal()
  }

  const handleSuccess = (message: string) => {
    setModalMessage(message)
  }

  // Получаем descr для первого шага, если есть поле с layout 'row' и descr
  const firstStepDescr = contactFormFields.find(
    (f) => (f.step || 1) === 1 && f.layout === 'row' && f.descr,
  )?.descr

  return (
    <>
      <button className={className} type="button" onClick={handleButtonClick}>
        {btnText}
      </button>
      <Modal ref={modalRef} fullScreen closeIcon contentClassName="cont">
        {modalMessage ? (
          <div className="py-8 text-center">
            <p>{modalMessage}</p>
          </div>
        ) : (
          <ModalContactForm
            title="Обсуждение проекта"
            fullScreen
            fields={contactFormFields}
            message="Ваше сообщение"
            closeIcon
            onSuccess={handleSuccess}
            showStepCounter
            inlineFirstStep
            descr={firstStepDescr}
          />
        )}
      </Modal>
    </>
  )
}

export default Brief
