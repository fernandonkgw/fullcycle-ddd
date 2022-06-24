import Order from "../../domain/entity/order";
import order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            }
        );
    }

    async update(entity: Order): Promise<void> {
        await OrderItemModel.destroy({ where: { order_id: entity.id } });
        await entity.items.map((item => OrderItemModel.create({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
            order_id: entity.id
        })));
        await OrderModel.update(
            {
                customer_id: entity.customerId,
                total: entity.total(),
            },
            {
                where: {
                    id: entity.id,
                }
            });
    }
    async find(id: string): Promise<Order> {

        let orderModel;
        try {
            orderModel = await OrderModel.findOne({
                where: { id },
                include: ['items'], 
                rejectOnEmpty: true
            })
        } catch (error) {
            throw new Error("Order not found");
        }
        
        const items = orderModel.items.map((itemModel) => {
            let item = new OrderItem(
                itemModel.id,
                itemModel.name,
                itemModel.price,
                itemModel.product_id,
                itemModel.quantity
            );
            return item;
        })
        const order = new Order(
            orderModel.id,
            orderModel.customer_id,
            items
        );
        return order;
    }
    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({ include: ['items']});
        const orders = orderModels.map((orderModel) => {
            const items = orderModel.items.map((itemModel) => {
                let item = new OrderItem(
                    itemModel.id,
                    itemModel.name,
                    itemModel.price,
                    itemModel.product_id,
                    itemModel.quantity
                );
                return item;
            })
            const order = new Order(
                orderModel.id,
                orderModel.customer_id,
                items
            );
            return order;
        });
        return orders;
    }





}