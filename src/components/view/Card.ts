import { ICard, ICardActions, TCategory } from '../../types';
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
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._index = container.querySelector(`.${blockName}__item-index`);

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

	set button(value: boolean) {
		this._button.disabled = value;
	}

	private formatPrice(value: number | null): string {
		if (value === null) {
			return 'Бесценно';
		}
		return `${value} синапсов`;
	}
}
