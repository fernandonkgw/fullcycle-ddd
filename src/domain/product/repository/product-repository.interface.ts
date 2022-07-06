import Product from "../entity/product";
import RepositoryInterface from "../../@shared/repository/repository-interface";
import ProductInteface from "../entity/product.interface";

export default interface ProductRepositoryInterface 
    extends RepositoryInterface<Product> {

}