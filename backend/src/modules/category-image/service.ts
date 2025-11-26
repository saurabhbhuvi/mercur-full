import { MedusaService } from "@medusajs/framework/utils"
import ProductCategoryImage from "./models/product-category-image"

class CategoryImageModuleService extends MedusaService({
  ProductCategoryImage,
}) {}

export default CategoryImageModuleService
