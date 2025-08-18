import { formatPhoneNumber } from '@/utils/formatPhoneNumber'

export default function PhoneFormatTest() {
  const testCases = [
    '+7 (903) 569-55-10', // Автозаполнение iPhone
    '79035695510', // Полный номер с 7
    '89035695510', // Полный номер с 8
    '9035695510', // Без префикса
    '903 569 55 10', // С пробелами
    '903-569-55-10', // С дефисами
    '(903) 569-55-10', // Без префикса в скобках
  ]

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Тест форматирования телефонных номеров
      </h1>
      <div className="space-y-4">
        {testCases.map((testCase, index) => {
          const result = formatPhoneNumber(testCase)
          return (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <strong>Входной номер:</strong> {testCase}
                </div>
                <div>
                  <strong>Результат:</strong> {result}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Тест поля ввода</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <label className="block mb-2 text-sm font-medium">
            Введите номер телефона:
          </label>
          <input
            type="tel"
            placeholder="Введите номер телефона"
            className="input input-bordered w-full"
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value)
              e.target.value = formatted
            }}
            onInput={(e) => {
              const target = e.target as HTMLInputElement
              const formatted = formatPhoneNumber(target.value)
              target.value = formatted
            }}
            onPaste={(e) => {
              e.preventDefault()
              const paste = e.clipboardData?.getData('text') || ''
              const target = e.target as HTMLInputElement
              const formatted = formatPhoneNumber(paste)
              target.value = formatted
            }}
          />
          <p className="text-sm text-gray-600 mt-2">
            Попробуйте ввести или вставить различные форматы номеров. На iPhone
            попробуйте использовать автозаполнение.
          </p>
        </div>
      </div>
    </div>
  )
}
