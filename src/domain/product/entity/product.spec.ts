import ProductFactory from "../factory/product.factory";
import Product from "./product";

describe("Product unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let product = new Product("", "Product 1", 100);
        }).toThrowError("product: Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            let product = new Product("p1", "", 100);
        }).toThrowError("product: Name is required");
    });

    it("should throw error when price is less than zero", () => {
        expect(() => {
            let product = new Product("p1", "Product 1", -1);
        }).toThrowError("product: Price must be greater than zero");
    });

    it("should throw two errors when Name is empty and Price less than zero", () => {
        expect(() => {
            ProductFactory.create("", -1);
        }).toThrowError("product: Name is required,product: Price must be greater than zero");
    })

    it("should change name", () => {
        const product = new Product("p1", "Product 1", 100);
        product.changeName("Product 1x");
        expect(product.name).toBe("Product 1x");
    });

    it("should change price", () => {
        const product = new Product("p1", "Product 1", 100);
        product.changePrice(150);
        expect(product.price).toBe(150);
    });
});