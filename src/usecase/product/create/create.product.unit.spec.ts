import CreateProductUseCase from "./create.product.usecase";

const input = {
    name: "Product 1",
    price: 100.99
}

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Unit test create product use case", () => {

    it("should create a product", async () => {
        const productRepository = MockRepository();
        const useCase = new CreateProductUseCase(productRepository);

        const output = await useCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: "Product 1",
            price: 100.99,
        });
    });

    it("should throw a error when name is missing", async () => {
        const productRepository = MockRepository();
        const useCase = new CreateProductUseCase(productRepository);

        input.name = "";

        await expect(useCase.execute(input)).rejects.toThrow("Name is required");
    })

    it("should throw a error when price is less than zero", async () => {
        const productRepository = MockRepository();
        const useCase = new CreateProductUseCase(productRepository);

        input.name = "Product 1";
        input.price = -1;

        await expect(useCase.execute(input)).rejects.toThrow("Price must be greater than zero");
    })
})