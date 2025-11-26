import { 
  defineMiddlewares, 
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { 
  CreateCategoryImagesSchema,
} from "./admin/product-categories/[id]/images/route"
import { 
  UpdateCategoryImagesSchema,
  DeleteCategoryImagesSchema,
} from "./admin/product-categories/[id]/images/batch/route"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/product-categories/:id/images",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(CreateCategoryImagesSchema),
      ],
    },
    {
      matcher: "/admin/product-categories/:id/images/batch",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(UpdateCategoryImagesSchema),
      ],
    },
    {
      matcher: "/admin/product-categories/:id/images/batch",
      method: ["DELETE"],
      middlewares: [
        validateAndTransformBody(DeleteCategoryImagesSchema),
      ],
    },
  ],
})
