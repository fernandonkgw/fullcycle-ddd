import EventHandlerInterface from "../../@shared/event-handler.interface";
import eventInterface from "../../@shared/event.interface";
import AddressChangedEvent from "../address-changed.event";
import CustomerCreatedEvent from "../customer-created.event";


export default class SendConsoleLogWhenAddressChangedHnadler implements EventHandlerInterface<AddressChangedEvent> {

    handle(event: AddressChangedEvent): void {
        const customer = event.eventData;
        console.log(`Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.Address}`);
    }

}