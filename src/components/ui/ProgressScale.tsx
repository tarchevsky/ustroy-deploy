import { FC } from 'react'

interface ProgressScaleProps {
  percent: number
  percentSteps: number[]
}

const ProgressScale: FC<ProgressScaleProps> = ({ percent, percentSteps }) => (
  <div className="grid grid-cols-[35px_auto] gap-[6px] md:gap-2 items-center ml-2 w-[72px] min-w-[72px] md:w-[53px] md:min-w-[53px]">
    {/* Шкала */}
    <div
      className="relative flex flex-col p-0 rounded-[12px] bg-transparent md:h-[608px] border-solid border-white"
      style={{ width: '35px', minWidth: '35px', height: '1016px' }}
    >
      <div
        className="absolute left-0 w-[33px] rounded-[12px] border border-white"
        style={{
          height: 'calc(100% - 8px)',
          top: 4,
          borderRadius: '12px',
          zIndex: 1,
        }}
      />
      <div
        className="absolute left-0 w-[33px] rounded-[12px] border border-solid border-white transition-all duration-300"
        style={{
          background: 'linear-gradient(0deg, #FFF 0%, #FE520A 100%)',
          borderRadius: '12px',
          bottom: 4,
          height: `calc(${percent}% - 8px)` as any,
          maxHeight: 'calc(100% - 8px)',
          zIndex: 2,
          boxShadow: percent < 100 ? '0 0 0 0 transparent' : undefined,
        }}
      />
    </div>
    {/* Шкала с цифрами */}
    <div className="relative flex flex-col justify-between w-auto h-full">
      {[...percentSteps].reverse().map((p, idx, arr) => {
        // Количество шагов и высота одной "ступени"
        const stepsCount = arr.length
        const stepHeight = 1 / stepsCount
        // Позиция цифры сверху (0 — верх, 1 — низ)
        const position = idx / (stepsCount - 1)
        // background-position рассчитываем так, чтобы градиент совпадал с позицией цифры
        // Высота шкалы: 1016px, высота цифры: 55px
        // background-size: 100% 1016px, background-position-y: position * (1016px - 55px)
        const scaleHeight = 1016
        const digitHeight = 55
        const bgSize = `100% ${scaleHeight}px`
        const bgPosY = position * (scaleHeight - digitHeight)
        const gradient = 'linear-gradient(0deg, #FFF 0%, #FE520A 100%)'
        return (
          <div
            key={p}
            className="inline-flex items-center justify-center"
            style={{
              height: `${digitHeight}px`,
              width: '20px',
              fontSize: 20,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            <span
              className="text-sm md:text-xl"
              style={{
                width: '55px',
                height: '30px',
                transform: 'rotate(-90deg)',
                transformOrigin: 'center center',
                background: gradient,
                backgroundSize: bgSize,
                backgroundPosition: `center -${bgPosY}px`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                transition: 'background 0.3s',
              }}
            >
              {p}%
            </span>
          </div>
        )
      })}
    </div>
  </div>
)

export default ProgressScale
