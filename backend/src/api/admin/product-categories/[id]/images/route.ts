import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createCategoryImagesWorkflow } from "../../../../../workflows/create-category-images"
import { z } from "zod"

export const CreateCategoryImagesSchema = z.object({
  images: z.array(
    z.object({
      type: z.enum(["thumbnail", "image"]),
      url: z.string(),
      file_id: z.string(),
    })
  ).min(1, "At least one image is required"),
})

type CreateCategoryImagesInput = z.infer<typeof CreateCategoryImagesSchema>

export async function POST(
  req: MedusaRequest<CreateCategoryImagesInput>,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id: categoryId } = req.params
    const { images } = req.validatedBody

    console.log("POST /admin/product-categories/:id/images - categoryId:", categoryId)
    console.log("POST /admin/product-categories/:id/images - images:", images)

    // Add category_id to each image
    const category_images = images.map((image) => ({
      ...image,
      category_id: categoryId,
    }))

    console.log("POST /admin/product-categories/:id/images - category_images:", category_images)

    const { result } = await createCategoryImagesWorkflow(req.scope).run({
      input: {
        category_images,
      },
    })

    console.log("POST /admin/product-categories/:id/images - result:", result)

    res.status(200).json({ category_images: result })
  } catch (error) {
    console.error("POST /admin/product-categories/:id/images - ERROR:", error)
    res.status(500).json({ 
      message: "Failed to create category images",
      error: error instanceof Error ? error.message : String(error)
    })
  }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id: categoryId } = req.params
    const query = req.scope.resolve("query")

    console.log("GET /admin/product-categories/:id/images - categoryId:", categoryId)

    const { data: categoryImages } = await query.graph({
      entity: "product_category_image",
      fields: ["*"],
      filters: {
        category_id: categoryId,
      },
    })

    console.log("GET /admin/product-categories/:id/images - categoryImages:", categoryImages)

    res.status(200).json({ category_images: categoryImages })
  } catch (error) {
    console.error("GET /admin/product-categories/:id/images - ERROR:", error)
    res.status(500).json({ 
      message: "Failed to fetch category images",
      error: error instanceof Error ? error.message : String(error)
    })
  }
}
