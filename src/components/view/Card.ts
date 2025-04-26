import { CardView, ICard, ICardActions, TCategory } from '../../types';
import { category } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class Card extends Component<ICard> {
	protected _description?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _index?: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._description = container.querySelector(`.${blockName}__text`);
		this._image = container.querySelector(`.${blockName}__image`);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._index = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set category(value: TCategory) {
		this.setText(this._category, value);
		this._category.classList.add(category[value]);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set index(value: number) {
		this._index.textContent = value.toString();
	}

	set price(value: number | null) {
		this._price.textContent = this.formatPrice(value);

		if (this._button) {
			this._button.disabled = value === null;
		}
	}

	// set button(value: boolean) {
	// 	this._button.disabled = value;
	// }

	// set button(value: string) {
	// 	this._button.textContent = value;
	// }

	set selected(value: boolean) {
		if (value) {
			this._button.textContent = 'Удалить';
		} else {
			this._button.textContent = 'В корзину';
		}
	}

	private formatPrice(value: number | null): string {
		if (value === null) {
			return 'Бесценно';
		}
		return `${value} синапсов`;
	}
}

// НОВЫЕ КЛАССЫ ! ! !

// export class CardNew<T> extends Component<CardView<T>> {
// 	protected _title: HTMLElement;
// 	protected _price: HTMLElement;
// 	protected _button?: HTMLButtonElement;

// 	constructor(
// 		protected blockName: string,
// 		container: HTMLElement,
// 		actions?: ICardActions
// 	) {
// 		super(container);

// 		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
// 		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
// 		this._button = container.querySelector(`.${blockName}__button`);

// 		if (actions?.onClick) {
// 			if (this._button) {
// 				this._button.addEventListener('click', actions.onClick);
// 			} else {
// 				container.addEventListener('click', actions.onClick);
// 			}
// 		}
// 	}

// 	set id(value: string) {
// 		this.container.dataset.id = value;
// 	}

// 	get id(): string {
// 		return this.container.dataset.id || '';
// 	}

// 	set title(value: string) {
// 		this.setText(this._title, value);
// 	}

// 	get title(): string {
// 		return this._title.textContent || '';
// 	}

// 	set price(value: number | null) {
// 		this._price.textContent = this.formatPrice(value);

// 		if (this._button) {
// 			this._button.disabled = value === null;
// 		}
// 	}

// 	private formatPrice(value: number | null): string {
// 		if (value === null) {
// 			return 'Бесценно';
// 		}
// 		return `${value} синапсов`;
// 	}
// }

// export class CardCatalog extends CardNew<CardCatalog> {
// 	protected _category?: HTMLElement;
// 	protected _image?: HTMLImageElement;

// 	constructor(container: HTMLElement, actions?: ICardActions) {
// 		super('card', container, actions);

// 		this._image = container.querySelector(`.card__image`);
// 		this._category = ensureElement<HTMLElement>(`.card__category`, container);
// 	}

// 	set category(value: TCategory) {
// 		this.setText(this._category, value);
// 		this._category.classList.add(category[value]);
// 	}

// 	set image(value: string) {
// 		this.setImage(this._image, value, this.title);
// 	}
// }

// export class CardPreview extends CardNew<CardPreview> {
// 	protected _category?: HTMLElement;
// 	protected _image?: HTMLImageElement;
// 	protected _description?: HTMLElement;

// 	constructor(container: HTMLElement, actions?: ICardActions) {
// 		super('card', container, actions);

// 		this._image = container.querySelector(`.card__image`);
// 		this._category = ensureElement<HTMLElement>(`.card__category`, container);
// 		this._description = ensureElement<HTMLElement>(`.card__text`, container);
// 	}

// 	set category(value: TCategory) {
// 		this.setText(this._category, value);
// 		this._category.classList.add(category[value]);
// 	}

// 	set image(value: string) {
// 		this.setImage(this._image, value, this.title);
// 	}

// 	set description(value: string) {
// 		this.setText(this._description, value);
// 	}
// }

// export class CardBasket extends CardNew<CardBasket> {
// 	protected _index?: HTMLElement;

// 	constructor(container: HTMLElement, actions?: ICardActions) {
// 		super('card', container, actions);

// 		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
// 	}

// 	set index(value: number) {
// 		this._index.textContent = value.toString();
// 	}
// }
