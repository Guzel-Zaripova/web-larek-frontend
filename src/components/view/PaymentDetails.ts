import { TPaymentDetails } from '../../types';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export class PaymentDetails extends Form<TPaymentDetails> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._card = container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

		if (this._card) {
			this._card.addEventListener('click', () => {
				this.toggleClass(this._card, 'button_alt-active', true);
				this.toggleClass(this._cash, 'button_alt-active', false);
				events.emit('order.card:change');
			});
		}

		if (this._cash) {
			this._cash.addEventListener('click', () => {
				this.toggleClass(this._cash, 'button_alt-active', true);
				this.toggleClass(this._card, 'button_alt-active', false);
				events.emit('order.cash:change');
			});
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	resetButtonStates() {
		this.toggleClass(this._cash, 'button_alt-active', false);
		this.toggleClass(this._card, 'button_alt-active', false);
	}
}
