import { ReactNode } from 'react'

export interface ModalProps {
  message?: string
  children?: ReactNode
  closeIcon?: boolean
  fullScreen?: boolean
  contentClassName?: string
  onClose?: () => void
}

export interface ModalHandle {
  showModal: () => void
}
