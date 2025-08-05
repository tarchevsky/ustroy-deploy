'use client'

import React, { useEffect, useState } from 'react'

interface WorkshopLoadProps {
  workshopName: string
}

interface Manufacture {
  name: string
  month1: number
  month2: number
  month3: number
}

// Функция для получения последних трёх месяцев на русском
function getLastThreeMonths(): string[] {
  const now = new Date()
  const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ]
  const result = []
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push(months[d.getMonth()])
  }
  return result
}

export const WorkshopLoad: React.FC<WorkshopLoadProps> = ({ workshopName }) => {
  const [data, setData] = useState<Manufacture | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(
      'https://ustroysite.bubbleapps.io/version-test/api/1.1/wf/manufacture',
    )
      .then((res) => res.json())
      .then((json) => {
        const found = json.manufactures.find(
          (m: Manufacture) => m.name === workshopName,
        )
        setData(found || null)
        setLoading(false)
      })
      .catch(() => {
        setError('Ошибка загрузки данных')
        setLoading(false)
      })
  }, [workshopName])

  if (loading) return <div className="cont">Загрузка загрузки цеха...</div>
  if (error) return <div>{error}</div>
  // убираем вывод 'Данные по цеху не найдены'

  const monthLabels = getLastThreeMonths()

  return (
    <div className="cont my-8">
      <h2 className="text-2xl font-semibold mb-4 uppercase">Загрузка цеха</h2>
      {data &&
        (() => {
          // Собираем массив месяцев и процентов, только если процент > 0
          const months = [
            { label: monthLabels[0], value: data.month1, color: '#FFD49F' },
            { label: monthLabels[1], value: data.month2, color: '#B8FF8E' },
            { label: monthLabels[2], value: data.month3, color: '#C8EFFF' },
          ].filter((m) => m.value > 0)
          const total = months.reduce((sum, m) => sum + m.value, 0)
          return (
            <div
              className="bg-white p-[11px] flex flex-row gap-2"
              style={{ borderRadius: '12px' }}
            >
              {months.map((m, i) => (
                <div
                  key={m.label}
                  style={{
                    borderRadius: '12px',
                    background: m.color,
                    height: '86px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    minWidth: '80px',
                    flexGrow: total > 0 ? m.value : 1,
                    flexBasis:
                      total > 0 ? `${(m.value / total) * 100}%` : '100%',
                    transition: 'flex-basis 0.3s',
                  }}
                  className="mb-0 flex flex-row justify-between items-center gap-8 overflow-hidden"
                >
                  <span
                    className="uppercase"
                    style={{
                      color: '#393939',
                      fontFamily: 'Unbounded Variable, sans-serif',
                      fontSize: '20px',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      lineHeight: 'normal',
                    }}
                  >
                    {m.label}
                  </span>
                  <span
                    className="uppercase"
                    style={{
                      color: '#393939',
                      fontFamily: 'Unbounded Variable, sans-serif',
                      fontSize: '20px',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      lineHeight: 'normal',
                    }}
                  >
                    {m.value}%
                  </span>
                </div>
              ))}
            </div>
          )
        })()}
    </div>
  )
}

export default WorkshopLoad
