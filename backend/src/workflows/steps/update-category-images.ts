import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CATEGORY_IMAGE_MODULE } from "../../modules/category-image"
import CategoryImageModuleService from "../../modules/category-image/service"

export type UpdateCategoryImagesStepInput = {
  updates: {
    id: string
    type?: "thumbnail" | "image"
  }[]
}

export const updateCategoryImagesStep = createStep(
  "update-category-images-step",
  async (input: UpdateCategoryImagesStepInput, { container }) => {
    const categoryImageService: CategoryImageModuleService =
      container.resolve(CATEGORY_IMAGE_MODULE)

    // Get previous data for the images being updated
    const prevData = await categoryImageService.listProductCategoryImages({
      id: input.updates.map((u) => u.id),
    })

    // Apply the requested updates
    const updatedData = await categoryImageService.updateProductCategoryImages(
      input.updates
    )

    return new StepResponse(updatedData, prevData)
  },
  async (compensationData, { container }) => {
    if (!compensationData?.length) {
      return
    }

    const categoryImageService: CategoryImageModuleService =
      container.resolve(CATEGORY_IMAGE_MODULE)

    // Revert all updates
    await categoryImageService.updateProductCategoryImages(
      compensationData.map((img) => ({
        id: img.id,
        type: img.type,
      }))
    )
  }
)
