import { z } from "zod"
import { EditCategoryMediaSchema } from "./constants"

export type EditCategoryMediaSchemaType = z.infer<typeof EditCategoryMediaSchema>
