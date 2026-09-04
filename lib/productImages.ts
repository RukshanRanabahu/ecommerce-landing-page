export function getProductImage(category: string): string {
  switch (category.toLowerCase()) {
    case "shoes":
      return "/products/shoe-placeholder.jpg";
    case "shirts":
      return "/products/shirt-placeholder.jpg";
    default:
      return "/products/shirt-placeholder.jpg";
  }
}
