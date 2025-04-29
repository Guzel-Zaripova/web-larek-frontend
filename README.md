# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Типы данных, используемые в приложении

Карточка товара

```ts
type TCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'другое';

interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: TCategory;
	price: number | null;
}
```

Контакная информация при оформление заказа

```ts
interface IOrderForm {
	payment: string;
	email: string;
	phone: string;
	address: string;
}
```

Общая информация о заказе клиента

```ts
export interface IOrderProducts extends IOrderForm {
	items: string[];
	total: number;
}
```

Возвращаемые данные от сервера на успешный заказ клиента

```ts
export interface IOrderResult {
	id: string;
	total: number;
}
```

Данные заказа в форме со способом оплаты и адресом доставки

```ts
type TPaymentDetails = Pick<IOrderForm, 'payment' | 'address'>;
```

Данные заказа в форме с email-ом и номером телефона

```ts
type TContacts = Pick<IOrderForm, 'email' | 'phone'>;
```

## Архитектура приложения

Код приложения организован по слоям в соответствии с парадигмой MVP:

- слой представления — отвечает за визуализацию данных на экране;
- слой данных — отвечает за хранение и изменение данных;
- презентер — обеспечивает взаимодействие между представлением и данными.

### Базовый код

#### class Api

Реализует основную логику для отправки запросов. В конструктор передается основной адрес сервера и необязательный объект с заголовками запросов.

Конструктор:

```ts
constructor(baseUrl: string, options: RequestInit = {}) // принимает два параметра: baseUrl — базовый URL для API, и options — параметры запроса
```

Свойства:

```ts
readonly baseUrl: string // хранение базового URL для API
protected options: RequestInit // хранение параметров запроса для HTTP-запросов
```

Методы:

```ts
protected handleResponse(response: Response): Promise<object> // метод обработки ответа от сервера
get(uri: string): Promise<object> // метод выполняет HTTP GET-запрос по указанному URI, используя базовый URL и параметры запроса, определенные в options
post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object> // метод выполняет HTTP POST-запрос по указанному URI с переданными данными в теле запроса
```

#### interface IEvents

```ts
interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}
```

#### class EventEmitter implements IEvents

Брокер событий позволяет подписываться на события и уведомлять подписчиков о наступлении события.

Свойства:

```ts
_events: Map<EventName, Set<Subscriber>>; // защищенное свойство класса EventEmitter, которое хранит все зарегистрированные обработчики событий
```

Методы:

```ts
on<T extends object>(eventName: EventName, callback: (event: T) => void) // установить обработчик на событие
off(eventName: EventName, callback: Subscriber) // снять обработчик с события
emit<T extends object>(eventName: string, data?: T) // инициировать событие с данными
onAll(callback: (event: EmitterEvent) => void) // слушать все события
offAll() // сбросить все обработчики
trigger<T extends object>(eventName: string, context?: Partial<T>) // сделать коллбек триггер, генерирующий событие при вызове
```

#### abstract class Model<T>

Класс представляет собой дженерик и является базовым для всех классов слоя данных. Дженерик принимает тип объекта, который будет использоваться для дальнейшей работы с данными.\
Конструктор:

```ts
constructor(data: Partial<T>, protected events: IEvents) {
	Object.assign(this, data);
} // принимает объект, содержащий частичные данные модели и объект, отвечающий за управление событиями
```

Метод класса:

```ts
emitChanges(event: string, payload?: object): void // используется для уведомления об изменениях в модели
```

#### abstract class Component<T>

Класс представляет собой дженерик и является базовым для всех компонентов слоя представления. Дженерик принимает тип объекта, который будет использоваться для передачи данных в метод render, отвечающий за отображение информации в компоненте.

Свойства:

```ts
protected readonly container: HTMLElement // корневой DOM-элемент
```

Конструктор:

```ts
protected constructor(protected readonly container: HTMLElement)
```

Методы:

```ts
- toggleClass(element: HTMLElement, className: string, force?: boolean) // переключить класс
- protected setText(element: HTMLElement, value: unknown) // установить текстовое содержимое
- setDisabled(element: HTMLElement, state: boolean) // сменить статус блокировки
- protected setHidden(element: HTMLElement) // скрыть
- protected setVisible(element: HTMLElement) // показать
- protected setImage(element: HTMLImageElement, src: string, alt?: string) // установить изображение с альтернативным текстом
- render(data?: Partial<T>): HTMLElement // вернуть корневой DOM-элемент.
```

### Слой данных

#### Класс class LarekData extends Model<ILarekData>

Класс LarekData управляет состоянием приложения. Он хранит информацию о корзине пользователя, каталоге товаров и заказах.\
Свойства:

```ts
catalog: ICard[] // массив объектов типа ICard, представляющий каталог товаров
order: IOrder // объект, представляющий заказ, с полями для способа оплаты, адреса, email, телефона, списка товаров и общей суммы
preview: string | null // строка, представляющая ID предварительно выбранного товара, или null, если товар не выбран
formErrors: FormErrors // объект, содержащий ошибки валидации формы, связанные с заказом и контактной информацией
```

Методы:

```ts
addItem(item: ICard): void // добавляет товар в заказ и вызывает событие о добавлении товара
deleteItem(item: ICard): void // удаляет товар из заказа по его ID и вызывает событие о удалении товара
getTotalItem(): number // возвращает общее количество товаров в заказе
getTotalPrice(): number // рассчитывает и возвращает общую стоимость товаров в заказе
setCatalog(items: ICard[]): void // устанавливает каталог товаров, преобразуя их в объекты ICard, и вызывает событие о изменении товаров
setPreview(item: ICard): void // устанавливает предварительно выбранный товар и вызывает событие о его изменении
clearPreview(): void // сбрасывает предварительно выбранный товар
setOrderField(field: keyof IOrderForm, value: string): void // устанавливает значение для поля заказа и проверяет его валидность, вызывая событие, если заказ готов
validateOrder(): boolean // проверяет валидность полей заказа и обновляет ошибки формы, возвращая true, если ошибок нет
setContactsField(field: keyof IOrderForm, value: string): void // устанавливает значение для поля контактной информации и проверяет его валидность, вызывая событие, если контакты готовы
validateContacts(): boolean // проверяет валидность полей контактной информации и обновляет ошибки формы, возвращая true, если ошибок нет
clearOrder(): void // сбрасывает все поля заказа к их начальному состоянию
```

### Классы представления

Все классы представления отвечают за визуализацию данных, которые им передаются, внутри контейнера (DOM-элемента).

#### interface IPage

```ts
{
	catalog: HTMLElement[];
	counter: number;
	locked: boolean;
}
```

#### class Page extends Component<IPage>

Класс отвечает за вывод контента на главной странице сайта.

```ts
constructor(container: HTMLElement, events: IEvents) // принимает container, который представляет собой элемент HTML, в котором будет размещены каталог товаров и кнопка для открытия корзины со счетчиком, а также экземпляр класса `EventEmitter` для возможности инициации событий
```

Свойства:

```ts
_catalog: HTMLElement; // массив каталога товаров на странице
_counter: HTMLElement; // счетчик количества элементов в корзине
_wrapper: HTMLElement; // обертка для содержимого страницы
_basket: HTMLElement; // кнопка для открытия корзины
```

Также класс предоставляет сеттеры для сохранения элементов HTML разметки в контейнере.

#### class Card<T> extends Component<T>

Базовый класс для карточек, который управляет общими свойствами и методами карточек.
Конструктор:

```ts
constructor(blockName: string, container: HTMLElement, actions?: ICardActions) // blockName — имя блока для поиска элементов; container — контейнер, в котором находятся элементы карточки; actions — объект с действиями, которые могут быть выполнены
```

Свойства:

```ts
_title: HTMLElement // элемент заголовка карточки
_price: HTMLElement // элемент цены карточки
_button?: HTMLButtonElement // элемент кнопки
```

Методы:

```ts
private formatPrice(value: number | null): string // форматирует цену для отображения
```

А так же геттеры и сеттеры для работы с свойствами класса.

#### class CardCatalog extends Card<CardCatalog>

Класс для карточек каталога, наследующий от Card.

Свойства:

```ts
_category: HTMLElement; // элемент категории карточки
_image: HTMLImageElement; // элемент изображения карточки
```

Методы:

```ts
set category(value: TCategory) // устанавливает категорию карточки и добавляет соответствующий класс
set image(value: string) // устанавливает изображение карточки
```

#### class CardPreview extends Card<CardPreview>

Класс для предварительного просмотра карточек, наследующий от Card.

Свойства:

```ts
_category: HTMLElement; // элемент категории карточки
_image: HTMLImageElement; // элемент изображения карточки
_description: HTMLElement; // элемент описания карточки
```

Методы:

```ts
set category(value: TCategory) // устанавливает категорию карточки и добавляет соответствующий класс
set image(value: string) // устанавливает изображение карточки
set description(value: string) // устанавливает описание карточки
set actionText(value: string) // устанавливает текст кнопки действия
```

#### class CardBasket extends Card<CardBasket>

Класс для карточек в корзине, наследующий от Card.

Свойства:

```ts
_index: HTMLElement; // элемент индекса карточки в корзине
```

Методы:

```ts
set index(value: number) // устанавливает индекс карточки в корзине
```

#### class Modal extends Component<IModalData>

Класс реализует модальное окно. Также предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели для закрытия модального окна на клик в оверлей и кнопку-крестик.

Конструктор:

```ts
constructor(container: HTMLElement, events: IEvents) // принимает container — элемент HTML, в котором будет размещено модальное окно, и экземпляр класса EventEmitter для возможности инициации событий
```

Свойства:

```ts
_closeButton: HTMLButtonElement; // кнопка закрытия модального окна
_content: HTMLElement; // содержимое модального окна
```

#### class Basket extends Component<IBasketView>

Класс реализует корзину для покупки товаров.\
Свойства:

```ts
_list: HTMLElement; // список товаров в корзине
_price: HTMLElement; // общая стоимость товаров в корзине
_button: HTMLElement; // элемент кнопки для оформления заказа
```

Методы:\
Класс предоставляет сеттеры для работы с свойствами класса.

#### class Success extends Component<ISuccess>

Класс реализует компонент, отображающий информацию об успешном оформлении заказа.\
Свойства:

```ts
close: HTMLElement; // кнопка потверждения
_description: HTMLElement; // сумма списанной валюты после успешного оформления заказа
```

Методы класса:\
Класс предоставляет сеттеры для работы с свойствами класса.

#### class Form<T> extends Component<IFormState>

Класс Form является дженериком и наследуется от класса Component, принимая в качестве параметра тип состояния IFormState. А также расширяет метод render родительского класса.

```ts
interface IFormState {
	valid: boolean;
	errors: string[];
}
```

Интерфейс определяет структуру состояния формы. Он содержит два свойства:

```ts
valid: boolean // логическое значение, указывающее, является ли форма валидной
errors: string[] // массив строк, содержащий сообщения об ошибках
```

Свойства:

```ts
_submit: HTMLButtonElement; // элемент кнопки отправки формы
_errors: HTMLElement; // элемент, в котором будут отображаться ошибки валидации
```

Конструктор:

```ts
constructor(protected container: HTMLFormElement, protected events: IEvents) // принимает container — HTML-элемент формы, и экземпляр класса `EventEmitter` для возможности инициации событий
```

Также включает в себя обраточек событий `input`, который срабатывает при изменении значения в любом из полей формы и обработчик событий `submit`, который предотвращает стандартное поведение отправки формы и вызывает событие с именем, основанным на имени контейнера.

Методы:

```ts
onInputChange(field: keyof T, value: string): void // вызывается при изменении значения в поле формы. Генерирует событие, которое включает имя поля и его новое значение
set valid(value: boolean): void // управление состоянием кнопки отправки
set errors(value: string): void // обновление текста элемента, отображающего ошибки
```

#### class PaymentDetails extends Form<TPaymentDetails>

Класс для управления деталями платежа, наследующий от Form. Он обрабатывает выбор способа оплаты (карта или наличные) и управляет соответствующими элементами формы.

Свойства:

```ts
_card: HTMLButtonElement; // элемент кнопки для выбора оплаты картой
_cash: HTMLButtonElement; // элемент кнопки для выбора оплаты наличными
```

Методы:

```ts
set address(value: string) // устанавливает значение поля адреса в форме, используя переданное значение
resetButtonStates() // сброс состояния кнопок
```

#### class Contacts extends Form<TContacts>

Класс для управления контактной информацией, наследующий от Form. Он позволяет устанавливать значения полей электронной почты и телефона в форме.

Методы:

```ts
set email(value: string) // устанавливает значение поля электронной почты в форме, используя переданное значение
set phone(value: string) // устанавливает значение поля телефона в форме, используя переданное значение
```

### Слой коммуникации

```ts
interface ILarekAPI {
	getProductList: () => Promise<ICard[]>;
	orderProducts: (order: IOrderProducts) => Promise<IOrderResult>;
}
```

#### LarekApi extends Api implements ILarekAPI

Класс LarekAPI расширяет базовый класс Api, реализуя интерфейс ILarekAPI и предоставляет методы для выполнения операций, связанных с API.
Свойства:

```ts
readonly cdn: string // хранит базовый URL для контента
```

Конструктор:

```ts
constructor(cdn: string, baseUrl: string, options?: RequestInit)
// принимает три параметра:

cdn: string // строка, представляющая базовый URL для контента
baseUrl: string // строка, представляющая базовый URL для API
options?: RequestInit // опциональный параметр, который передается в базовый класс Api для настройки запросов
```

Методы:

```ts
getProsuctList(): Promise<ICard[]> // получение списка всех товаров
orderProducts(order: IOrderProducts): Promise<IOrderResult> // размещение заказа на товары
```

## Взаимодействие компонентов

Код, который описывает взаимодействие между представлением и данными, расположенный в файле `index.ts`, выполняет функции презентера. Взаимодействие происходит через события, создаваемые с помощью брокера событий и обработчиков, определенных в `index.ts`. Сначала в `index.ts` создаются экземпляры всех нужных классов, а затем настраивается обработка событий.\
Ниже представлен перечень всех событий, которые могут возникать в системе.

События, связанные с изменением данных (создаются классами моделей данных):

```ts
'card:added'; // в заказ добавляется новый элемент
'card:deleted'; // из заказа удаляется элемент
'items:changed'; // изменяется каталог элементов
'preview:changed'; // изменяется элемент предварительного просмотра
'order:ready'; // все поля заказа заполнены корректно и готовы к отправке
'orderFormErrors:change'; // изменяются ошибки в форме заказа
'contacts:ready'; // все поля контактной информации заполнены корректно и готовы к отправке
'contactsFormErrors:change'; // изменяются ошибки в форме контактной информации
```

События, возникающие в результате взаимодействия пользователя с интерфейсом (создаются классами, ответственными за представление):

```ts
'card:select'; // пользователь выбирает карточку
'modal:open'; // модальное окно открывается
'modal:close'; // модальное окно закрывается
'card:add'; // пользователь добавляет карточку в корзину
'card:delete'; // пользователь удаляет карточку из корзины
'basket:open'; // открывается корзина
'basket:submit'; // пользователь подтверждает корзину
'order.card:change'; // пользователь выбирает оплату картой
'order.cash:change'; // пользователь выбирает оплату наличными
'order.address:change'; // изменяется адрес в форме заказа
'order:submit'; // переход из окна с информацией о заказе к следующему окну
'contacts.email:change'; // изменяется электронная почта в форме контактов
'contacts.phone:change'; // изменяется телефон в форме контактов
'contacts:submit'; // пользователь подтверждает контактную информацию
```
