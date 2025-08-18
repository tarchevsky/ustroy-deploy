export const formatPhoneNumber = (value: string) => {
	if (!value) {
		return ''
	}

	// Удаляем все нецифровые символы
	let digits = value.replace(/\D/g, '')

	// Нормализация номера
	// 8... -> 7...
	if (digits.startsWith('8')) {
		digits = '7' + digits.slice(1)
	}

	// 9... (10 digits) -> 79...
	if (digits.length === 10 && digits.startsWith('9')) {
		digits = '7' + digits
	}

	// Форматируем только российские номера (начинаются с 7)
	if (digits.startsWith('7')) {
		digits = digits.slice(0, 11) // не больше 11 цифр

		let formatted = '+7'
		if (digits.length > 1) {
			formatted += ' (' + digits.substring(1, 4)
		}
		if (digits.length >= 5) {
			formatted += ') ' + digits.substring(4, 7)
		}
		if (digits.length >= 8) {
			formatted += '-' + digits.substring(7, 9)
		}
		if (digits.length >= 10) {
			formatted += '-' + digits.substring(9, 11)
		}
		return formatted
	}

	// Для всего остального возвращаем как есть, но без букв
	return value.replace(/[^\d+()-\s]/g, '')
}
