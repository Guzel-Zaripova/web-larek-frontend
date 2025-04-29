import { IOrderForm, TCategory } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {};

export const FORM_ERROR_MESSAGES: Record<keyof IOrderForm, string> = {
	payment: 'Необходимо указать способ оплаты',
	address: 'Необходимо указать адрес доставки',
	email: 'Необходимо указать email',
	phone: 'Необходимо указать телефон',
};

export const CARD_CATEGORY_CLASSES: Record<TCategory, string> = {
	'хард-скил': 'card__category_hard',
	'софт-скил': 'card__category_soft',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
	другое: 'card__category_other',
};
