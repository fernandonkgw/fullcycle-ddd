
import Address from "../../customer/value-object/address";
import Customer from "../../customer/entity/customer";
import AddressChangedEvent from "../../customer/event/address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendConsoleLog1WhenCustomerCreatedHandler from "../../customer/event/handler/send-console-log-1-when-customer-created.handler";
import SendConsoleLog2WhenCustomerCreatedHandler from "../../customer/event/handler/send-console-log-2-when-customer-created.handler";
import SendConsoleLogWhenAddressChangedHnadler from "../../customer/event/handler/send-console-log-when-address-changed.handler";
import SendEmailWhenProductIsCreatedHnadler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {

    it("should register an event handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHnadler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    })

    it("should unregister an event handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHnadler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it("should unregister all event handlers", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHnadler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });

    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHnadler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle")

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0,
        });

        // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should notify when Customer created", () => {
        const eventDispatcher = new EventDispatcher();
        const eventhandleLog1 = new SendConsoleLog1WhenCustomerCreatedHandler();
        const eventhandleLog2 = new SendConsoleLog2WhenCustomerCreatedHandler();

        const spyEventHandler1 = jest.spyOn(eventhandleLog1, "handle")
        const spyEventHandler2 = jest.spyOn(eventhandleLog2, "handle")

        eventDispatcher.register("CustomerCreatedEvent", eventhandleLog1);
        eventDispatcher.register("CustomerCreatedEvent", eventhandleLog2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventhandleLog1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventhandleLog2);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "c1",
            name: "Customer 1"
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });

    it("should notify when Customer's Address changed", () => {
        const eventDispatcher = new EventDispatcher();
        const eventhandle = new SendConsoleLogWhenAddressChangedHnadler();

        const spyEventHandler = jest.spyOn(eventhandle, "handle")

        eventDispatcher.register("AddressChangedEvent", eventhandle);

        expect(eventDispatcher.getEventHandlers["AddressChangedEvent"][0]).toMatchObject(eventhandle);

        const customer = new Customer("1", "Customer 1");
        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.changeAddress(address);

        const addressChangedEvent = new AddressChangedEvent(customer);

        eventDispatcher.notify(addressChangedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });
});