import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";

describe("Integration test list products use case", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true},
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should list all products", async () => {
        const productRepository = new ProductRepository();
        const product1 = ProductFactory.create("Product 1", 10);
        const product2 = ProductFactory.create("Product 2", 20);
        await productRepository.create(product1);
        await productRepository.create(product2);

        const useCase = new ListProductUseCase(productRepository);

        const output = await useCase.execute({});

        expect(output.products.length).toBe(2);
        expect(output.products[0].name).toBe("Product 1");
        expect(output.products[0].price).toBe(10);
        expect(output.products[1].name).toBe("Product 2");
        expect(output.products[1].price).toBe(20);
    });
});