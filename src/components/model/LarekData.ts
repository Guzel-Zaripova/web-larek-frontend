import { Model } from '../base/Model';
import { FormErrors, ICard, ILarekData, IOrder, IOrderForm } from '../../types';
import { FORM_ERROR_MESSAGES } from '../../utils/constants';

export class LarekData extends Model<ILarekData> {
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

	addItem(item: ICard): void {
		this.order.items.push(item);
		this.emitChanges('card:added', item);
	}

	deleteItem(item: ICard): void {
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
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: ICard): void {
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
			errors.payment = FORM_ERROR_MESSAGES.payment;
		}
		if (!this.order.address) {
			errors.address = FORM_ERROR_MESSAGES.address;
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
			errors.email = FORM_ERROR_MESSAGES.email;
		}
		if (!this.order.phone) {
			errors.phone = FORM_ERROR_MESSAGES.phone;
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
