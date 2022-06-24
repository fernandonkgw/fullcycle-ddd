import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import OrderRepository from "./order.repository";
import ProductRepository from "./product.repository";

describe("Order repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    })

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const order = new Order("123", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ['items'],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_id: product.id
                }
            ]
        })
    });

    it("should update a order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 2);

        const order = new Order("o1", "c1", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const product2 = new Product("p2", "Product 2", 20);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem("i2", product2.name, product2.price, product2.id, 3);
        order.addItem(orderItem2);
        await orderRepository.update(order);
        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ['items'],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "o1",
            customer_id: "c1",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_id: product.id
                },
                {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    order_id: order.id,
                    product_id: product2.id
                }
            ]
        })
    });

    it("should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 2);

        const order = new Order("o1", "c1", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.find(order.id);
        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ['items'],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "o1",
            customer_id: "c1",
            total: 20,
            items: [
                {
                    id: "i1",
                    name: "Product 1",
                    price: 10,
                    quantity: 2,
                    order_id: "o1",
                    product_id: "p1"
                }
            ]
        })

    });

    it("should throw an error when order is not found", async () => {
        const orderRepository = new OrderRepository();
        
        expect(async () => {
            await orderRepository.find("345ABC");
        }).rejects.toThrow("Order not found");
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 2);
        const order = new Order("o1", "c1", [orderItem]);

        const customer2 = new Customer("c2", "Customer 2");
        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);

        const product2 = new Product("p2", "Product 2", 20);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem("i2", product2.name, product2.price, product2.id, 3);
        const order2 = new Order("o2", "c2", [orderItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
        await orderRepository.create(order2);
    
        const orders = await orderRepository.findAll();
        console.log(orders);
    
        expect(orders).toHaveLength(2);
        expect(orders).toContainEqual(order);
        expect(orders).toContainEqual(order2);
      });
});