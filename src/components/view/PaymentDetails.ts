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
				events.emit('card:change');
			});
		}

		if (this._cash) {
			this._cash.addEventListener('click', () => {
				events.emit('cash:change');
			});
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(value: 'card' | 'cash') {
		this[`_${value}`].classList.toggle('button_alt-active');
	}
}
