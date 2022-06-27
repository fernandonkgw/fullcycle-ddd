import EventHandlerInterface from "../../@shared/event-handler.interface";
import eventInterface from "../../@shared/event.interface";
import ProductCreatedEvent from "../product-created.event";

export default class SendEmailWhenProductIsCreatedHnadler implements EventHandlerInterface<ProductCreatedEvent> {

    handle(event: ProductCreatedEvent): void {
        console.log(`Sending email to ....`);
    }

}