import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CATEGORY_IMAGE_MODULE } from "../../modules/category-image"
import CategoryImageModuleService from "../../modules/category-image/service"
import { MedusaError } from "@medusajs/framework/utils"

export type CreateCategoryImagesStepInput = {
  category_images: {
    category_id: string
    type: "thumbnail" | "image"
    url: string
    file_id: string
  }[]
}

export const createCategoryImagesStep = createStep(
  "create-category-images-step",
  async (input: CreateCategoryImagesStepInput, { container }) => {
    const categoryImageService: CategoryImageModuleService =
      container.resolve(CATEGORY_IMAGE_MODULE)

    // Group images by category to handle thumbnails efficiently
    const imagesByCategory = input.category_images.reduce((acc, img) => {
      if (!acc[img.category_id]) {
        acc[img.category_id] = []
      }
      acc[img.category_id].push(img)
      return acc
    }, {} as Record<string, typeof input.category_images>)

    // Process each category
    for (const [_, images] of Object.entries(imagesByCategory)) {
      const thumbnailImages = images.filter((img) => img.type === "thumbnail")
      
      // If there are new thumbnails for this category, validate only one
      if (thumbnailImages.length > 1) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Only one thumbnail is allowed per category"
        )
      }
    }

    // Create all category images
    const createdImages = await categoryImageService.createProductCategoryImages(
      Object.values(imagesByCategory).flat()
    )

    return new StepResponse(createdImages, createdImages)
  },
  async (compensationData, { container }) => {
    if (!compensationData?.length) {
      return
    }

    const categoryImageService: CategoryImageModuleService =
      container.resolve(CATEGORY_IMAGE_MODULE)

    await categoryImageService.deleteProductCategoryImages(
      compensationData
    )
  }
)
