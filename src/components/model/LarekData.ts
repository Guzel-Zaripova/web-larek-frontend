import { Model } from '../base/Model';
import { CardData } from './CardData';
import { FormErrors, ICard, ILarekData, IOrder, IOrderForm } from '../../types';

export class LarekData extends Model<ILarekData> {
	catalog: CardData[];
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

	addItem(item: CardData): void {
		this.order.items.push(item);
		this.emitChanges('card:added');
	}

	deleteItem(id: string): void {
		const index = this.order.items.findIndex((item) => item.id === id);
		if (index !== -1) {
			this.order.items.splice(index, 1);
			this.emitChanges('card:deleted');
		}
	}

	getTotalItem(): number {
		return this.order.items.length;
	}

	getTotalPrice(): number {
		return this.order.items.reduce(
			(accumulator, currentValue) =>
				accumulator +
				this.catalog.find((items) => items.id === currentValue.id).price,
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
