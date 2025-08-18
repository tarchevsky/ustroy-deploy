export const formatPhoneNumber = (value: string) => {
	// Удаляем все нецифровые символы
	const number = value.replace(/\D/g, '')

	// Если номер пустой, возвращаем пустую строку
	if (!number) return ''

	let phoneDigits = ''
	let prefix = ''

	// Обрабатываем различные форматы номеров
	if (number.startsWith('8') && number.length === 11) {
		// Российский номер, начинающийся с 8
		prefix = '+7'
		phoneDigits = number.slice(1) // убираем 8
	} else if (number.startsWith('7') && number.length === 11) {
		// Российский номер, начинающийся с 7
		prefix = '+7'
		phoneDigits = number.slice(1) // убираем 7
	} else if (number.startsWith('9') && number.length === 10) {
		// Номер без префикса, начинающийся с 9 (мобильный)
		prefix = '+7'
		phoneDigits = number
	} else if (number.length <= 10) {
		// Номер без префикса
		prefix = '+7'
		phoneDigits = number
	} else if (number.length === 11 && (number.startsWith('8') || number.startsWith('7'))) {
		// 11-значный номер с префиксом
		prefix = '+7'
		phoneDigits = number.slice(1)
	} else {
		// Для всех остальных случаев пытаемся извлечь последние 10 цифр
		prefix = '+7'
		phoneDigits = number.slice(-10)
	}

	// Если цифр меньше 3, просто возвращаем их с префиксом
	if (phoneDigits.length < 3) {
		return `${prefix} ${phoneDigits}`
	}

	// Форматируем номер в зависимости от количества цифр
	if (phoneDigits.length <= 3) {
		return `${prefix} (${phoneDigits}`
	} else if (phoneDigits.length <= 6) {
		return `${prefix} (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3)}`
	} else if (phoneDigits.length <= 8) {
		return `${prefix} (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`
	} else {
		// Полный формат
		return `${prefix} (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6, 8)}-${phoneDigits.slice(8, 10)}`
	}
}
