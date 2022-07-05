
import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import AddressChangedEvent from "../../../customer/event/address-changed.event";
import CustomerCreatedEvent from "../../../customer/event/customer-created.event";


export default class SendConsoleLogWhenAddressChangedHnadler implements EventHandlerInterface<AddressChangedEvent> {

    handle(event: AddressChangedEvent): void {
        const customer = event.eventData;
        console.log(`Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.Address}`);
    }

}