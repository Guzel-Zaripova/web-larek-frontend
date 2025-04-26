import { IEvents } from './Events';

export abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	emitChanges(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	}
}

function typedEmitChanges<T extends EventType>(event: T, payload: Payload2<T>) {
	console.log(payload);
}

typedEmitChanges('card:deleted', true);

interface PayloadMap {
	'card:add': number;
	'card:deleted': boolean;
}
type EventType = keyof PayloadMap;
type Payload2<K extends EventType> = PayloadMap[K];
