import { ICardActions, TCategory } from '../../types';
import { category } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class Card<T> extends Component<T> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._button = container.querySelector(`.${blockName}__button`);

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

	set price(value: number | null) {
		this._price.textContent = this.formatPrice(value);

		if (this._button) {
			this._button.disabled = value === null;
		}
	}

	private formatPrice(value: number | null): string {
		if (value === null) {
			return 'Бесценно';
		}
		return `${value} синапсов`;
	}
}

export class CardCatalog extends Card<CardCatalog> {
	protected _category?: HTMLElement;
	protected _image?: HTMLImageElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);

		this._image = container.querySelector(`.card__image`);
		this._category = ensureElement<HTMLElement>(`.card__category`, container);
	}

	set category(value: TCategory) {
		this.setText(this._category, value);
		this._category.classList.add(category[value]);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}
}

export class CardPreview extends Card<CardPreview> {
	protected _category?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);

		this._image = container.querySelector(`.card__image`);
		this._category = ensureElement<HTMLElement>(`.card__category`, container);
		this._description = ensureElement<HTMLElement>(`.card__text`, container);
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

	set actionText(value: string) {
		this._button.textContent = value;
	}
}

export class CardBasket extends Card<CardBasket> {
	protected _index?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);

		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
	}

	set index(value: number) {
		this._index.textContent = value.toString();
	}
}
