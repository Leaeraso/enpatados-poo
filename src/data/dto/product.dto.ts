interface ProductDTO {
  product_id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  subcategoryId?: number;
}

export default ProductDTO;
