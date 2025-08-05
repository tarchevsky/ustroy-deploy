interface ProgressScaleProps {
  percent: number
  percentSteps: number[]
}

export const ProgressScale = ({ percent, percentSteps }: ProgressScaleProps) => {
  return (
    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-primary transition-all duration-300 ease-in-out rounded-full"
        style={{ width: `${percent}%` }}
      >
        {percentSteps.map((step, index) => (
          <div
            key={index}
            className="absolute h-2 w-2 bg-white rounded-full transform -translate-y-1/2"
            style={{ left: `${step}%` }}
          />
        ))}
      </div>
    </div>
  )
}
