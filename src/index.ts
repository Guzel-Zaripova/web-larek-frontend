import { EventEmitter } from './components/base/Events';
import { CardData } from './components/model/CardData';
import { LarekApi } from './components/model/LarekAPI';
import { LarekData } from './components/model/LarekData';
import { Basket } from './components/view/Basket';
import { Card } from './components/view/Card';
import { Contacts } from './components/view/Contacts';
import { Modal } from './components/view/Modal';
import { Page } from './components/view/Page';
import { PaymentDetails } from './components/view/PaymentDetails';
import { Success } from './components/view/Success';
import './scss/styles.scss';
import { CatalogChangeEvent } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new LarekData({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new PaymentDetails(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('card:select', (item: CardData) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: CardData) => {
	const showItem = (item: CardData) => {
		const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => events.emit('card:add', item),
		});

		modal.render({
			content: card.render({
				id: item.id,
				title: item.title,
				image: item.image,
				description: item.description,
				category: item.category,
				price: item.price,
			}),
		});

		if (item.selected === true) {
			card.button = true;
		}
	};

	if (item) {
		api
			.getProductItem(item.id)
			.then(() => {
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('card:add', (item: CardData) => {
	appData.addItem(item);
	item.selected = true;
});

events.on('card:added', (item: CardData) => {
	page.counter = appData.getTotalItem();
	modal.close();
});
