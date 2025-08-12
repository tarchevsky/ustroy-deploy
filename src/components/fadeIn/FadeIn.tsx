'use client'

import type { LayoutProps } from '@/types'
import cn from 'clsx'
import { motion, useInView, type MotionStyle } from 'framer-motion'
import React, { useRef } from 'react'

interface FadeInProps extends LayoutProps {
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  amplitude?: number
}

const FadeIn = React.forwardRef<HTMLElement, FadeInProps>(
  (
    {
      children,
      className,
      delay = 0.2,
      duration = 0.2,
      direction = 'none',
      amplitude = 1,
      style,
      tag = 'div',
    },
    ref,
  ) => {
    const internalRef = useRef(null)
    const viewRef = (ref || internalRef) as React.RefObject<Element>
    const isInView = useInView(viewRef, { once: true, amount: 0.1 })

    const MotionComponent = motion[tag] || motion.div

    const getDirectionProps = () => {
      switch (direction) {
        case 'up':
          return { y: amplitude }
        case 'down':
          return { y: -amplitude }
        case 'left':
          return { x: amplitude }
        case 'right':
          return { x: -amplitude }
        case 'none':
          return {}
        default:
          return { y: amplitude }
      }
    }

    const initialProps = { opacity: 0, ...getDirectionProps() }
    const animateProps = isInView ? { opacity: 1, y: 0, x: 0 } : initialProps

    return (
      <MotionComponent
        // @ts-ignore
        ref={ref || internalRef}
        initial={initialProps}
        animate={animateProps}
        transition={{ duration, delay }}
        {...(className ? { className: cn(className) } : {})}
        style={style as MotionStyle}
      >
        {children}
      </MotionComponent>
    )
  },
)

FadeIn.displayName = 'FadeIn'

export default FadeIn
