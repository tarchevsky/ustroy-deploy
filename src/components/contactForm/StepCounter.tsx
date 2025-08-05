import { FC } from 'react'

interface StepCounterProps {
  currentStep: number
  maxSteps: number
}

const StepCounter: FC<StepCounterProps> = ({ currentStep, maxSteps }) => {
  const isLastStep = currentStep === maxSteps
  return (
    <span
      className="text-primary text-xl font-medium uppercase text-[28px] md:text-[32px]"
      style={{
        fontFamily: 'Unbounded Variable, sans-serif',
      }}
    >
      Шаг {currentStep}
      <span className={isLastStep ? 'text-primary' : 'text-black'}> из </span>
      <span className={isLastStep ? 'text-primary' : 'text-black'}>
        {maxSteps}
      </span>
    </span>
  )
}

export default StepCounter
