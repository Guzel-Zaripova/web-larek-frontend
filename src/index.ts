import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/LarekAPI';
import { LarekData } from './components/model/LarekData';
import { Basket } from './components/view/Basket';
import { CardCatalog, CardPreview, CardBasket } from './components/view/Card';
import { Contacts } from './components/view/Contacts';
import { Modal } from './components/view/Modal';
import { Page } from './components/view/Page';
import { PaymentDetails } from './components/view/PaymentDetails';
import { Success } from './components/view/Success';
import './scss/styles.scss';
import { CatalogChangeEvent, ICard, IOrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

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

// получение каталога карточек с сервера api
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

// вывод каталога карточек на странице
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
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

// пользователь выбирает карточку
events.on('card:select', (item: ICard) => {
	appData.setPreview(item);
});

// рендер карточки в превью
const renderCardPreview = (item: ICard) => {
	const selected = appData.order.items.some(
		(orderItem) => orderItem.id === item.id
	);
	const eventType = selected ? 'card:delete' : 'card:add';
	const actionText = selected ? 'Удалить' : 'В корзину';

	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit(eventType, item),
	});

	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
			actionText,
		}),
	});
};

// изменяется элемент предварительного просмотра
events.on('preview:changed', (item: ICard) => {
	if (item) {
		renderCardPreview(item);
	} else {
		modal.close();
	}
});

// открытие модального окна
events.on('modal:open', () => {
	page.locked = true;
});

// закрытие модального окна
events.on('modal:close', () => {
	page.locked = false;
	appData.clearPreview();
});

// пользователь добавляет карточку в корзину
events.on('card:add', (item: ICard) => {
	appData.addItem(item);
});

// в заказ добавляется новый элемент
events.on('card:added', (item: ICard) => {
	page.counter = appData.getTotalItem();
	renderCardPreview(item);
});

// пользователь удаляет карточку из корзины
events.on('card:delete', (item: ICard) => {
	appData.deleteItem(item);
});

// из заказа удаляется элемент
events.on('card:deleted', (item: ICard) => {
	page.counter = appData.getTotalItem();
	if (appData.preview === item.id) {
		renderCardPreview(item);
	} else {
		renderBasket();
	}
});

// рендер корзины товаров
function renderBasket() {
	const basketItems = appData.order.items.map((item, index) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:delete', item),
		});

		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

	basket.selected = appData.order.items;
	modal.render({
		content: basket.render({
			list: basketItems,
			price: appData.getTotalPrice(),
		}),
	});
}

// открывается корзина
events.on('basket:open', () => {
	renderBasket();
});

// пользователь подтверждает корзину и переходит к окну заказа
events.on('basket:submit', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// пользователь выбирает оплату картой
events.on('order.card:change', () => {
	appData.setOrderField('payment', 'card');
});

// пользователь выбирает оплату наличными
events.on('order.cash:change', () => {
	appData.setOrderField('payment', 'cash');
});

// изменяется адрес в форме заказа
events.on<{ field: string; value: string }>(
	'order.address:change',
	(address) => {
		appData.setOrderField('address', address.value);
	}
);

// изменяются ошибки в форме заказа
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

// переход из окна с информацией о заказе к следующему окну
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// изменяется электронная почта в форме контактов
events.on<{ field: string; value: string }>(
	'contacts.email:change',
	(email) => {
		appData.setContactsField('email', email.value);
	}
);

// изменяется телефон в форме контактов
events.on<{ field: string; value: string }>(
	'contacts.phone:change',
	(phone) => {
		appData.setContactsField('phone', phone.value);
	}
);

// изменяются ошибки в форме контактной информации
events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// пользователь подтверждает контактную информацию
events.on('contacts:submit', () => {
	const apiData = {
		payment: appData.order.payment,
		email: appData.order.email,
		phone: appData.order.phone,
		address: appData.order.address,
		total: appData.getTotalPrice(),
		items: appData.order.items.map((item) => item.id),
	};

	// отправка информации о заказе на сервер api
	// и рендер окна с информацией об успешном заказе
	api
		.orderProducts(apiData)
		.then((result) => {
			appData.clearOrder();
			page.counter = appData.getTotalItem();
			order.resetButtonStates();
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					description: result.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});
