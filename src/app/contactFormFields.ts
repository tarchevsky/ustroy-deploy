import type { FormField } from '@/components/contactForm/contactForm.types'

export const contactFormFields: FormField[] = [
  {
    name: 'name',
    type: 'text',
    title: 'Имя',
    placeholder: 'Имя',
    required: true,
    error: 'Введите своё имя',
    step: 1,
    layout: 'row',
    descr:
      'Для расчета проекта оставьте ваши данные, чтобы наш менеджер смог связаться с вами для уточнения вопросов по проекту.<br /> <strong>Заполните ваши контактные данные:</strong>',
  },
  {
    name: 'email',
    type: 'email',
    title: 'Почта',
    placeholder: 'Почта',
    required: true,
    error: 'Введите корректный email адрес',
    pattern: '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$',
    patternFlags: 'i',
    step: 1,
  },
  {
    name: 'phone',
    type: 'tel',
    title: 'Телефон',
    placeholder: 'Телефон',
    required: true,
    error: 'Введите корректный номер телефона',
    pattern:
      '^(\\+7|7|8)?[\\s-]?\\(?[489][0-9]{2}\\)?[\\s-]?[0-9]{3}[\\s-]?[0-9]{2}[\\s-]?[0-9]{2}$',
    step: 1,
  },
  {
    type: 'info',
    content: '<h3>1. Общие данные проекта</h3>',
    step: 2,
  },
  {
    name: '1.1',
    type: 'text',
    title: '1.1. Укажите название проекта',
    placeholder: 'Название',
    required: true,
    error: 'Пожалуйста, заполните это поле',
    step: 2,
    descr:
      '<strong>Заполните бриф</strong><br />Чем подробнее и детальнее будут предоставлены данные, тем точнее будет просчёт.',
  },
  {
    name: '1.2',
    type: 'text',
    title: '1.2. Контакты ответственного лица (художника, заказчика и т.п.)',
    placeholder: 'Иванов И.И.',
    required: true,
    error: 'Пожалуйста, заполните это поле',
    step: 2,
    descr:
      '<strong>Заполните бриф</strong><br />Чем подробнее и детальнее будут предоставлены данные, тем точнее будет просчёт.',
  },
  {
    name: '1.3',
    type: 'select',
    title: '1.3.  Формат проекта',
    placeholder: 'съемка',
    required: true,
    error: 'Пожалуйста, заполните это поле',
    step: 2,
    options: [
      { label: 'Съемка', value: 'shooting' },
      { label: 'Дизайн', value: 'design' },
      { label: 'Разработка', value: 'development' },
    ],
    descr:
      '<strong>Заполните бриф</strong><br />Чем подробнее и детальнее будут предоставлены данные, тем точнее будет просчёт.',
  },
  {
    name: 'message',
    type: 'textarea',
    title: 'Сообщение',
    placeholder: 'Расскажите подробнее о вашем запросе',
    required: true,
    error: 'Пожалуйста, заполните это поле',
    step: 2,
  },
  {
    name: 'policy',
    type: 'radio',
    title: 'Политика конфиденциальности',
    required: true,
    error: 'Отметьте, что вы ознакомлены с нашей политикой',
    options: [{ label: 'Я согласен с условиями', value: 'agree' }],
    privacyLink: '/privacy-policy',
    privacyLinkText: 'политики конфиденциальности',
    step: 2,
  },
  // {
  // 	name: 'captcha',
  // 	type: 'captcha',
  // 	error: 'Пожалуйста, решите пример'
  // }
]
