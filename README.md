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

Корзина

```ts
type TBasketItem = Pick<ICard, 'id' | 'title' | 'price'>;

interface IBasket {
	items: TBasketItem[];
}
```

Интерфейс для модели данных карточек

```ts
interface ICardsData {
	cards: ICard[];
	previewCardId: string | null;
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
interface IOrder extends IOrderForm {
	items: string[];
	total: numner;
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

#### Класс Api

Реализует основную логику для отправки запросов. В конструктор передается основной адрес сервера и необязательный объект с заголовками запросов.
Методы:

- `get` — выполняет GET-запрос к указанному в параметрах ендпоинту и возвращает промис с объектом, полученным от сервера;
- `post` — принимает объект с данными, которые будут отправлены в формате JSON в теле запроса, и передает эти данные на указанный ендпоинт. По умолчанию выполняется запрос типа `POST`, но тип запроса можно изменить, указав третий параметр при вызове метода.

#### Класс EventEmitter

Брокер событий позволяет подписываться на события и уведомлять подписчиков о наступлении события.
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` — подписка на событие;
- `emit` — уведомление подписчиков о наступлении события;
- `trigger` — возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

#### Класс Model

Класс представляет собой дженерик и является базовым для всех классов слоя данных. Дженерик принимает тип объекта, который будет использоваться для дальнейшей работы с данными.\
Конструктор принимает два параметра:

- data: Partial<T> — объект, содержащий частичные данные модели;
- protected events: IEvents — объект, отвечающий за управление событиями.

Метод класса:

- emitChanges(event: string, payload?: object): void — используется для уведомления об изменениях в модели.

#### Класс Component

Класс представляет собой дженерик и является базовым для всех компонентов слоя представления. Дженерик принимает тип объекта, который будет использоваться для передачи данных в метод render, отвечающий за отображение информации в компоненте.

Свойство:

- protected readonly container: HTMLElement — корневой DOM-элемент.

Конструктор:

- protected constructor(protected readonly container: HTMLElement)

Методы:

- toggleClass(element: HTMLElement, className: string, force?: boolean) — переключить класс;
- protected setText(element: HTMLElement, value: unknown) — установить текстовое содержимое;
- setDisabled(element: HTMLElement, state: boolean) — сменить статус блокировки;
- protected setHidden(element: HTMLElement) — скрыть;
- protected setVisible(element: HTMLElement) — показать;
- protected setImage(element: HTMLImageElement, src: string, alt?: string) — установить изображение с альтернативным текстом;
- render(data?: Partial<T>): HTMLElement — вернуть корневой DOM-элемент.

### Слой данных

#### Класс CardData

Класс представляет собой модель данных карточки с товаров. Этот класс наследуется от абстрактного класса Model<ICard>.\
В полях класса содержатся следующие данные:

- id: string — id товара;
- description: string — описание товара;
- image: string — изображение товара;
- title: string — название товара;
- category: TCategory — категория товара;
- price: number | null — цена товара.

#### Класс LarekData

Класс LarekData управляет состоянием приложения. Он хранит информацию о корзине пользователя, каталоге товаров и заказах. Реализует интерфейс ILarekData и наследует от абстрактного класса Model<ILarekData>.\
В полях класса содержатся следующие данные:

- basket: string[] — массив строк, представляющий идентификаторы товаров, добавленных в корзину;
- catalog: ICard[] — массив объектов типа ICard, который представляет собой каталог товаров;
- order: IOrder — объект типа IOrder, который содержит информацию о заказе;
- preview: string | null — строка, представляющая идентификатор товара, который в данный момент находится в режиме предварительного просмотра. Если ничего не выбрано, значение будет null;
- formErrors: FormErrors — объект, представляющий ошибки в форме заказа.

Методы класса:

- addToBasket(id: string): void — добавление товара в корзину;
- deleteFromBasket(id: string): void — удаление товара из корзины;
- clearBasket(): void — очищает корзину;
- getTotalItem(): number — возвращает общее количество товаров в корзине;
- getTotalPrice(): number — возвращает общую стоимость всех товаров в корзине;
- setCatalog(items: ICard[]): void — устанавливает новый каталог, создавая экземпляры CardData для каждого элемента;
- setPreview(item: CardData): void — устанавливает предварительный просмотр для выбранного товара;
- setPaymentDetailsField(field: keyof IOrderForm, value: string): void — устанавливает значение для данных о способе оплаты с адресом доставки и проверяет их на валидность. Если данные валиден, генерирует событие payment-details:ready;
- validatePaymentDetails(): boolean — проверяет валидность формы с данными о способе оплаты и адресе доставки;
- setContactsField(field: keyof IOrderForm, value: string): void — устанавливает значение для данных об email с номером телефона и проверяет их на валидность. Если данные валиден, генерирует событие contacts:ready;
- validateContacts(): boolean — проверяет валидность форма с данными о номере телефона и email;
- clearOrder(): void — очищает данные о заказе.

### Классы представления

Все классы представления отвечают за визуализацию данных, которые им передаются, внутри контейнера (DOM-элемента).

#### Класс Page

Класс отвечает за вывод контента на главной странице сайта.

- constructor(container: HTMLElement, events: IEvents) — конструктор принимает container, который представляет собой элемент HTML, в котором будет размещены каталог товаров и кнопка для открытия корзины со счетчиком, а также экземпляр класса `EventEmitter` для возможности инициации событий.

В полях класса содержатся следующие данные:

- \_catalog: HTMLElement — массив каталога товаров на странице:
- \_counter: HTMLElement — счетчик количества элементов в корзине;
- \_wrapper: HTMLElement — обертка для содержимого страницы;
- \_basket: HTMLElement — кнопка для открытия корзины.

Также класс предоставляет сеттеры для сохранения элементов HTML разметки в контейнере.

#### Класс Card

Класс отвечает за отображение карточки и используется для их отображения на странице сайта в каталоге, в модальном окне с детальным просмотром информации о товаре и в корзине товаров. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки.\
Конструктор, кроме темплейта, принимает экземпляр `EventEmitter` для инициации событий.

В полях класса содержатся следующие данные:

- \_id: string — id товара;
- \_description?: HTMLElement — описание товара;
- \_image?: HTMLImageElement — изображение товара;
- \_title: HTMLElement — название товара;
- \_category?: HTMLElement — категория товара;
- \_price: HTMLElement — цена товара;
- \_button?: HTMLButtonElement — кнопка добавление товара в корзину;
- \_index?: HTMLElement — индекс товара в списке товаров в корзине.

Методы класса:\
Класс предоставляет геттеры и сеттеры для работы с полями класса.

#### Класс Modal

Класс реализует модальное окно. Также предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели для закрытия модального окна на клик в оверлей и кнопку-крестик.

- constructor(container: HTMLElement, events: IEvents) — конструктор принимает container, который представляет собой элемент HTML, в котором будет размещено модальное окно, и экземпляр класса `EventEmitter` для возможности инициации событий.

В полях класса содержатся следующие данные:

- \_closeButton: HTMLButtonElement — кнопка закрытия модального окна;
- \_content: HTMLElement — содержимое модального окна.

#### Класс Basket

Класс реализует корзину для покупки товаров.\
В полях класса содержатся следующие данные:

- \_list: HTMLElement — список товаров в корзине;
- \_price: HTMLElement — общая стоимость товаров в корзине;
- \_button: HTMLElement — элемент кнопки для оформления заказа.

Методы класса:\
Класс предоставляет сеттеры для работы с полями класса.

#### Класс Success

Класс реализует компонент, отображающий информацию об успешном оформлении заказа.\
В полях класса содержатся следующие данные:

- close: HTMLElement — кнопка потверждения;
- \_description: HTMLElement — сумма списанной валюты после успешного оформления заказа.

Методы класса:\
Класс предоставляет сеттеры для работы с полями класса.

#### Класс Form

Класс Form является обобщенным (generic) и наследуется от класса Component, принимая в качестве параметра тип состояния IFormState. А также расширяет метод render родительского класса.

```ts
interface IFormState {
	valid: boolean;
	errors: string[];
}
```

Интерфейс определяет структуру состояния формы. Он содержит два свойства:

- valid: boolean — логическое значение, указывающее, является ли форма валидной;
- errors: string[] — массив строк, содержащий сообщения об ошибках.

Внутри класса Form определены два защищенных свойства:

- \_submit: HTMLButtonElement — элемент кнопки отправки формы;
- \_errors: HTMLElement — элемент, в котором будут отображаться ошибки валидации.

Конструктор класса Form:\
constructor(protected container: HTMLFormElement, protected events: IEvents) — принимает container, который представляет собой HTML-элемент формы, и экземпляр класса `EventEmitter` для возможности инициации событий.\
Также включает в себя обраточек событий `input`, который срабатывает при изменении значения в любом из полей формы и обработчик событий `submit`, который предотвращает стандартное поведение отправки формы и вызывает событие с именем, основанным на имени контейнера.

Методы класса Form:

- onInputChange(field: keyof T, value: string): void — вызывается при изменении значения в поле формы. Генерирует событие, которое включает имя поля и его новое значение;
- сеттер valid для управления состоянием кнопки отправки;
- сеттер errors для обновления текста элемента, отображающего ошибки.

#### Класс PaymentDetails

Класс PaymentDetails наследуется от класса Form, расширяя его. Является первой формой в процессе оформлении заказа.\
Включает в себя сеттера и геттеры для установки и получения значений полей payment и address в форме.

#### Класс Contacts

Класс Contacts наследуется от класса Form, расширяя его. Является второй формой в процессе оформлении заказа.\
Включает в себя сеттеры и геттеры для установки и получения значений полей email и phone в форме.

### Слой коммуникации

#### Класс LarekAPI

Класс LarekAPI расширяет базовый класс Api, реализуя интерфейс ILarekAPI и предоставляет методы для выполнения операций, связанных с API.\
Поле класса:

- readonly cdn: string — хранит базовый URL для контента.

Конструктор класса:\
constructor(cdn: string, baseUrl: string, options?: RequestInit) — принимает три параметра:

- cdn: string — строка, представляющая базовый URL для контента;
- baseUrl: string — строка, представляющая базовый URL для API;
- options?: RequestInit — опциональный параметр, который передается в базовый класс Api для настройки запросов.

Методы класса:

- getProductItem(id: string): Promise<ICard> — получение информации о конкретном товаре по его идентификатору id;
- getProsuctList(): Promise<ICard[]> — получение списка всех товаров;
- orderProducts(order: IOrder): Promise<IOrderResult> — размещение заказа на товары.

## Взаимодействие компонентов

Код, который описывает взаимодействие между представлением и данными, расположенный в файле `index.ts`, выполняет функции презентера. Взаимодействие происходит через события, создаваемые с помощью брокера событий и обработчиков, определенных в `index.ts`. Сначала в `index.ts` создаются экземпляры всех нужных классов, а затем настраивается обработка событий.\
Ниже представлен перечень всех событий, которые могут возникать в системе.

События, связанные с изменением данных (создаются классами моделей данных):

- `items:changed` — изменение массива карточек;
- `preview:changed` — изменение открываемой в модальном окне данных карточки;
- `order:ready` — готовность заказа к обработке;
- `formErrors:change` — изменение в ошибках формы.

События, возникающие в результате взаимодействия пользователя с интерфейсом (создаются классами, ответственными за представление):

- `card:select` — выбор карточки для отображения детальной информации о товаре в модальном окне;
- `card:addToBasket` — добавление товара в корзину;
- `card:deleteFromBasket` — удаление товара из корзины;
- `basket:open` — открытие модального окна с корзиной товаров;
- `basket:submit` — переход из окна с корзиной товаров к оформлению заказа;
- `payment:change` — изменение данных в способе оплаты;
- `address:change` — изменение данных в поле с адресом;
- `paymentDetails:submit` — переход из окна с информацией о способе оплаты и адресе доставки к следующему окну;
- `phone:change` — изменение данных в поле с номером телефона
- `email:change` — изменение данных в поле с email;
- `contacts:submit` — переход из окна с формой о номере телефона и email к оплате заказа;
- `order:sucess` — событие, сообщающее о том, что форма с заказом была успешна отправлена;
- `modal:close` — закрытие модального окна.
