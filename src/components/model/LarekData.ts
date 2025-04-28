import { Model } from '../base/Model';
import { CardData } from './CardData';
import { FormErrors, ICard, ILarekData, IOrder, IOrderForm } from '../../types';
import { formError } from '../../utils/constants';

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
		this.emitChanges('card:added', item);
	}

	deleteItem(item: CardData): void {
		const index = this.order.items.findIndex(
			(orderItem) => orderItem.id === item.id
		);
		if (index !== -1) {
			this.order.items.splice(index, 1);
			this.emitChanges('card:deleted', item);
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

	clearPreview(): void {
		this.preview = null;
	}

	setOrderField(field: keyof IOrderForm, value: string): void {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = formError.payment;
		}
		if (!this.order.address) {
			errors.address = formError.address;
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
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
			errors.email = formError.email;
		}
		if (!this.order.phone) {
			errors.phone = formError.phone;
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
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
