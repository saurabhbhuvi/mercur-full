import { HttpTypes } from "@medusajs/types"
import { useSearchParams } from "react-router-dom"
import { CategoryMediaForm } from "../category-media-form"
import { CategoryMediaGallery } from "../category-media-gallery"

type CategoryMediaViewProps = {
  category: HttpTypes.AdminProductCategory
}

export const CategoryMediaView = ({ category }: CategoryMediaViewProps) => {
  const [searchParams] = useSearchParams()
  const view = searchParams.get("view")

  if (view === "edit") {
    return <CategoryMediaForm category={category} />
  }

  return <CategoryMediaGallery category={category} />
}
