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
	catalog: CardData[];
	order: IOrder;
	preview: string | null;

	addToBasket(item: CardData): void;
	deleteItem(item: CardData): void;
	getTotalItem(): number;
	getTotalPrice(): number;
	setCatalog(items: ICard[]): void;
	setPreview(item: CardData): void;
	clearPreview(): void;
	setOrderField(field: keyof IOrderForm, value: string): void;
	validateOrder(): boolean;
	setContactsField(field: keyof IOrderForm, value: string): void;
	validateContacts(): boolean;
	clearOrder(): void;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

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

export type CardCatalog = Pick<ICard, 'title' | 'price' | 'image' | 'category'>;
export type CardPreview = Pick<
	ICard,
	'title' | 'price' | 'image' | 'category' | 'description'
>;
export type CardBasket = Pick<ICard, 'title' | 'price'> & {
	index: number;
};

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

export type TFormErrors = Partial<Record<keyof IOrderForm, string>>;
