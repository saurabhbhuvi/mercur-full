import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CATEGORY_IMAGE_MODULE } from "../../modules/category-image"
import CategoryImageModuleService from "../../modules/category-image/service"

export type DeleteCategoryImagesStepInput = {
  ids: string[]
}

export const deleteCategoryImagesStep = createStep(
  "delete-category-images-step",
  async (input: DeleteCategoryImagesStepInput, { container }) => {
    const categoryImageService: CategoryImageModuleService =
      container.resolve(CATEGORY_IMAGE_MODULE)

    // Retrieve the full category images data before deleting
    const categoryImages = await categoryImageService.listProductCategoryImages({
      id: input.ids,
    })

    // Delete the category images
    await categoryImageService.deleteProductCategoryImages(input.ids)

    return new StepResponse(
      { success: true, deleted: input.ids }, 
      categoryImages
    )
  },
  async (categoryImages, { container }) => {
    if (!categoryImages || categoryImages.length === 0) {
      return
    }

    const categoryImageService: CategoryImageModuleService =
      container.resolve(CATEGORY_IMAGE_MODULE)

    // Recreate all category images with their original data
    await categoryImageService.createProductCategoryImages(
      categoryImages.map((categoryImage) => ({
        id: categoryImage.id,
        category_id: categoryImage.category_id,
        type: categoryImage.type,
        url: categoryImage.url,
        file_id: categoryImage.file_id,
      }))
    )
  }
)
