import { ISuccess, ISuccessActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class Success extends Component<ISuccess> {
	protected _description: HTMLElement;
	protected close: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this.close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick) {
			this.close.addEventListener('click', actions.onClick);
		}
	}
	set description(value: number) {
		this.setText(this._description, `Списано ${value} синапсов`);
	}
}
