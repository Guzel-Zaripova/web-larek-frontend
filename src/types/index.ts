export type TCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'другое';

export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: TCategory;
	price: number | null;
}

export interface IBasket {
	items: string[];
}

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
}

export interface IOrderResult {
	id: string;
}

export interface ILarekData {
	catalog: ICard[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
}

export type TBasketItem = Pick<ICard, 'id' | 'title' | 'price'>;
export type TPaymentDetails = Pick<IOrderForm, 'payment' | 'address'>;
export type TContacts = Pick<IOrderForm, 'email' | 'phone'>;

export interface IPage {
	catalog: HTMLElement[];
	counter: number;
	basket: HTMLElement;
}
