import { CardData } from '../components/model/CardData';

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
	items: ICard[];
	total: number;
}

export interface IOrderProducts extends IOrderForm {
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface ILarekAPI {
	getProductList: () => Promise<ICard[]>;
	getProductItem: (id: string) => Promise<ICard>;
	orderProducts: (order: IOrderProducts) => Promise<IOrderResult>;
}

export interface ILarekData {
	basket: CardData[];
	catalog: ICard[];
	order: IOrder | null;
	preview: string | null;

	addToBasket(item: CardData): void;
	deleteFromBasket(id: string): void;
	clearBasket(): void;
	getTotalItem(): number;
	getTotalPrice(): number;
	setCatalog(items: ICard[]): void;
	setPreview(item: CardData): void;
	setPaymentDetailsField(field: keyof IOrderForm, value: string): void;
	validatePaymentDetails(): boolean;
	setContactsField(field: keyof IOrderForm, value: string): void;
	validateContacts(): boolean;
	clearOrder(): void;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type TBasketItem = Pick<ICard, 'id' | 'title' | 'price'>;
export type TPaymentDetails = Pick<IOrderForm, 'payment' | 'address'>;
export type TContacts = Pick<IOrderForm, 'email' | 'phone'>;

export interface IPage {
	catalog: HTMLElement[];
	counter: number;
	locked: boolean;
}

export type CatalogChangeEvent = {
	catalog: CardData[];
};

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IModalData {
	content: HTMLElement;
}

export interface IBasketView {
	list: HTMLElement[];
	price: number;
	selected: string[];
}

export interface ISuccess {
	description: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface CardCatalog {
	title: string;
	price: number | null;
	image: string;
	category: TCategory;
}

export interface CardPreview {
	title: string;
	price: number | null;
	image: string;
	category: TCategory;
	description: string;
}

export interface CardBasket {
	title: string;
	price: number | null;
	index: number;
}
