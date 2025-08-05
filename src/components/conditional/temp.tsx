'use client'

import type { FormField } from '@/components/contactForm/contactForm.types'
import {
  TypesOfContentChooseAboutLayout,
  TypesOfContentChooseCalculateLayout,
  TypesOfContentChooseCustomersLayout,
} from '@/graphql/types/pageSettingsTypes'
import { transformCustomersFromPageSettings } from '@/services/transformService'
import { Companies } from '@/ui/companies/Companies'
import { wpToTailwind } from '@/utils/wpToTailwind'
import AboutBlock from '../aboutBlock/AboutBlock'
import ModalContactForm from '../contactForm/ModalContactForm'
import ContentBlock from '../contentBlock/ContentBlock'
import PostsCarousel from '../postsCarousel/PostsCarousel'
import TextWithButton from '../textWithButton/TextWithButton'
import Modal from '../modal/Modal'
import { useRef, useState } from 'react'
import type { ModalHandle } from '../modal/modal.types'

const ConditionalTextWithButton = ({
  block,
  fields,
}: {
  block: TypesOfContentChooseCalculateLayout
  fields?: FormField[]
}) => {
  const formModalRef = useRef<ModalHandle>(null)
  const messageModalRef = useRef<ModalHandle>(null)
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null)

  const handleButtonClick = () => {
    formModalRef.current?.showModal()
  }

  const handleSuccess = (message: string) => {
    const isError = message.toLowerCase().includes('ошибка')
    setMessageType(isError ? 'error' : 'success')
    
    // Закрываем форму и показываем сообщение
    const formDialog = formModalRef.current && (formModalRef.current as any).modalRef?.current
    if (formDialog && typeof formDialog.close === 'function') {
      formDialog.close()
    }
    
    messageModalRef.current?.showModal()
  }

  const handleCloseForm = () => {
    setMessageType(null)
  }

  const handleCloseMessage = () => {
    setMessageType(null)
  }

  if (block && fields) {
    const firstStepDescr = fields.find(
      (f) => (f.step || 1) === 1 && f.layout === 'row' && f.descr,
    )?.descr

    return (
      <>
        <TextWithButton
          text={block.text}
          btnText={block.btnText}
          onClick={handleButtonClick}
          closeIcon
          inlineFirstStep={true}
        />

        <Modal
          fullScreen={true}
          closeIcon={true}
          contentClassName="cont"
          ref={formModalRef}
          onClose={handleCloseForm}
        >
          <ModalContactForm
            title="Обсуждение проекта"
            fullScreen={true}
            fields={fields}
            message="Ваше сообщение"
            closeIcon
            onSuccess={handleSuccess}
            showStepCounter={true}
            inlineFirstStep={true}
            descr={firstStepDescr}
          />
        </Modal>

        <Modal
          fullScreen={false}
          closeIcon={true}
          contentClassName="px-8 py-6 bg-white shadow-lg"
          ref={messageModalRef}
          onClose={handleCloseMessage}
          message={
            messageType === 'success'
              ? 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.'
              : 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.'
          }
        />
      </>
    )
  }

  return (
    <TextWithButton
      text={block?.text}
      btnText={block?.btnText}
      onClick={handleButtonClick}
      closeIcon
      inlineFirstStep={true}
    />
  )
}

// ... rest of the file
