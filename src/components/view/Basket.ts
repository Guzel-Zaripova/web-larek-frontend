import { IBasketView, ICard } from '../../types';
import { ensureElement, createElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._price = this.container.querySelector('.basket__price');
		this.button = this.container.querySelector('.basket__button');

		if (this.button) {
			this.button.addEventListener('click', () => {
				events.emit('basket:submit');
			});
		}
	}

	set list(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set selected(items: ICard[]) {
		if (items.length) {
			this.setDisabled(this.button, false);
		} else {
			this.setDisabled(this.button, true);
		}
	}

	set price(price: number) {
		this.setText(this._price, `${price} синапсов`);
	}
}
