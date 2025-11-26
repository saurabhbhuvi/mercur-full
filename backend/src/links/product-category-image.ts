import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import CategoryImageModule from "../modules/category-image"

export default defineLink(
  {
    linkable: ProductModule.linkable.productCategory,
    field: "id",
    isList: true,
  },
  {
    ...CategoryImageModule.linkable.productCategoryImage.id,
    primaryKey: "category_id",
  },
  {
    readOnly: true,
  }
)
