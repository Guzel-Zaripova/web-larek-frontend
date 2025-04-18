import { Model } from '../base/Model';
import { CardData } from './CardData';
import { FormErrors, ICard, ILarekData, IOrder, IOrderForm } from '../../types';

export class LarekData extends Model<ILarekData> {
	basket: CardData[] = [];
	catalog: ICard[];
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
	};
	preview: string | null;
	formErrors: FormErrors = {};

	addToBasket(item: CardData): void {
		this.basket.push(item);
	}

	deleteFromBasket(id: string): void {
		const index = this.basket.findIndex((item) => item.id === id);
		if (index !== -1) {
			this.basket.splice(index, 1);
		}
	}

	clearBasket(): void {
		this.order.items.forEach((id) => {
			this.deleteFromBasket(id);
		});
	}

	getTotalItem(): number {
		return this.basket.length;
	}

	getTotalPrice(): number {
		return this.order.items.reduce(
			(accumulator, currentValue) =>
				accumulator +
				this.catalog.find((items) => items.id === currentValue).price,
			0
		);
	}

	setCatalog(items: ICard[]): void {
		this.catalog = items.map((item) => new CardData(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: CardData): void {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setPaymentDetailsField(field: keyof IOrderForm, value: string): void {
		this.order[field] = value;

		if (this.validatePaymentDetails()) {
			this.events.emit('payment-details:ready', this.order);
		}
	}

	validatePaymentDetails(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setContactsField(field: keyof IOrderForm, value: string): void {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	validateContacts(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearOrder(): void {
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			items: [],
			total: 0,
		};
	}
}
