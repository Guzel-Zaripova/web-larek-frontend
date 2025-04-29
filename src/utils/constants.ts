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

export enum ModelEvent {
	CardAdded = 'card:added',
	CardDeleted = 'card:deleted',
	ItemsChanged = 'items:changed',
	PreviewChanged = 'preview:changed',
	OrderReady = 'order:ready',
	OrderFormErrorsChange = 'orderFormErrors:change',
	ContactsReady = 'contacts:ready',
	ContactsFormErrorsChange = 'contactsFormErrors:change',
}

export enum ViewEvent {
	ModalOpen = 'modal:open',
	ModalClose = 'modal:close',
	CardAdd = 'card:add',
	CardDelete = 'card:delete',
	CardSelect = 'card:select',
	BasketOpen = 'basket:open',
	BasketSubmit = 'basket:submit',
	OrderCardChange = 'order.card:change',
	OrderCashChange = 'order.cash:change',
	OrderAddressChange = 'order.address:change',
	OrderSubmit = 'order:submit',
	ContactsEmailChange = 'contacts.email:change',
	ContactsPhoneChange = 'contacts.phone:change',
	ContactsSubmit = 'contacts:submit',
}
