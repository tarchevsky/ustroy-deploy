export const formatPhoneNumber = (value: string) => {
	// Удаляем все нецифровые символы
	let number = value.replace(/\D/g, '')

	// Если номер пустой, возвращаем пустую строку
	if (!number) return ''

	// Если начинается с 8, заменяем на 7
	if (number.startsWith('8')) {
		number = '7' + number.slice(1)
	}

	// Если начинается с 7 и длина 11, убираем первую 7
	if (number.startsWith('7') && number.length === 11) {
		number = number.slice(1)
	}

	// Ограничиваем до 10 цифр
	number = number.slice(0, 10)

	// Форматируем
	if (number.length >= 1) {
		let formatted = '+7'
		if (number.length > 0) {
			formatted += ` (${number.slice(0, 3)}`
			if (number.length > 3) {
				formatted += `) ${number.slice(3, 6)}`
				if (number.length > 6) {
					formatted += `-${number.slice(6, 8)}`
					if (number.length > 8) {
						formatted += `-${number.slice(8, 10)}`
					}
				}
			}
		}
		return formatted
	}

	return ''
}
