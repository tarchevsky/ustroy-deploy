'use client'

import { contactFormFields } from '@/app/contactFormFields'
import ModalContactForm from '@/components/contactForm/ModalContactForm'
import Modal from '@/components/modal/Modal'
import type { ModalHandle } from '@/components/modal/modal.types'
import { useRef, useState } from 'react'
import SuccessModal from '../modal/SuccessModal'

const Brief = ({ btnText = 'Обсудить проект', className = '' }) => {
  const modalRef = useRef<ModalHandle>(null)
  const successModalRef = useRef<ModalHandle>(null)
  const [successMessage, setSuccessMessage] = useState('')

  const handleButtonClick = () => {
    modalRef.current?.showModal()
  }

  const handleSuccess = (message: string) => {
    if (message !== 'Форма не отправлена') {
      setSuccessMessage(message)
      modalRef.current?.closeModal()
      successModalRef.current?.showModal()
    }
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
      </Modal>
      <SuccessModal ref={successModalRef} message={successMessage} />
    </>
  )
}

export default Brief
