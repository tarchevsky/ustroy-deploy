'use client'

import { ModalHandle, ModalProps } from '@/components/modal/modal.types'
import { forwardRef, useImperativeHandle, useRef } from 'react'

const Modal = forwardRef<ModalHandle, ModalProps>(
  ({ message, children, closeIcon, fullScreen, contentClassName, onClose }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null)

    useImperativeHandle(ref, () => ({
      showModal: () => {
        if (modalRef.current) {
          modalRef.current.showModal()
        }
      },
    }))

    const handleClose = () => {
      if (modalRef.current) {
        modalRef.current.close()
      }
      onClose?.()
    }

    return (
      <dialog
        ref={modalRef}
        className={`modal ${fullScreen ? 'modal-full' : ''}`}
        onClose={handleClose}
      >
        <div
          className={`modal-box ${contentClassName || ''}`}
          style={{
            position: 'relative',
            ...(fullScreen && {
              maxWidth: '100%',
              maxHeight: '100%',
              width: '100%',
              margin: 0,
              borderRadius: 0,
            }),
          }}
        >
          {closeIcon && (
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                lineHeight: 1,
              }}
              aria-label="Закрыть"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="5"
                  y1="5"
                  x2="15"
                  y2="15"
                  stroke="#909090"
                  strokeWidth="2"
                />
                <line
                  x1="15"
                  y1="5"
                  x2="5"
                  y2="15"
                  stroke="#909090"
                  strokeWidth="2"
                />
              </svg>
            </button>
          )}
          {message ? <p className="py-4">{message}</p> : null}
          {children}
          {!closeIcon && (
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Закрыть</button>
              </form>
            </div>
          )}
        </div>
      </dialog>
    )
  },
)

Modal.displayName = 'Modal'

export default Modal
