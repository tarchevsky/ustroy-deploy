'use client'

import Modal from '@/components/modal/Modal'
import type { ModalHandle } from '@/components/modal/modal.types'
import { forwardRef } from 'react'

interface SuccessModalProps {
  title?: string
  message: string
}

const SuccessModal = forwardRef<ModalHandle, SuccessModalProps>(
  ({ title = 'Спасибо!', message }, ref) => {
    return (
      <Modal ref={ref} closeIcon>
        <div className="p-8 text-center">
          {title && <h4 className="text-2xl font-bold mb-4">{title}</h4>}
          <p>{message}</p>
        </div>
      </Modal>
    )
  },
)

SuccessModal.displayName = 'SuccessModal'

export default SuccessModal
