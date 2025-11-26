import CategoryImageModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const CATEGORY_IMAGE_MODULE = "categoryImage"

export default Module(CATEGORY_IMAGE_MODULE, {
  service: CategoryImageModuleService,
})
