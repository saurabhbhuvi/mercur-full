import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CATEGORY_IMAGE_MODULE } from "../../modules/category-image"
import CategoryImageModuleService from "../../modules/category-image/service"

export type ConvertCategoryThumbnailsStepInput = {
  category_ids: string[]
}

export const convertCategoryThumbnailsStep = createStep(
  "convert-category-thumbnails-step",
  async (input: ConvertCategoryThumbnailsStepInput, { container }) => {
    const categoryImageService: CategoryImageModuleService =
      container.resolve(CATEGORY_IMAGE_MODULE)

    // Find existing thumbnails in the specified categories
    const existingThumbnails = await categoryImageService.listProductCategoryImages({
      type: "thumbnail",
      category_id: input.category_ids,
    })

    if (existingThumbnails.length === 0) {
      return new StepResponse([], [])
    }

    // Store previous states for compensation
    const compensationData: string[] = existingThumbnails.map((t) => t.id)

    // Convert existing thumbnails to "image" type
    await categoryImageService.updateProductCategoryImages(
      existingThumbnails.map((t) => ({
        id: t.id,
        type: "image" as const,
      }))
    )

    return new StepResponse(existingThumbnails, compensationData)
  },
  async (compensationData, { container }) => {
    if (!compensationData?.length) {
      return
    }

    const categoryImageService: CategoryImageModuleService =
      container.resolve(CATEGORY_IMAGE_MODULE)

    // Revert thumbnails back to "thumbnail" type
    await categoryImageService.updateProductCategoryImages(
      compensationData.map((id) => ({
        id,
        type: "thumbnail" as const,
      }))
    )
  }
)
