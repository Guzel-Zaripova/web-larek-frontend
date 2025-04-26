import { Model } from '../base/Model';
import { ICard, TCategory } from '../../types';

export class CardData extends Model<ICard> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: TCategory;
	price: number | null;
}
