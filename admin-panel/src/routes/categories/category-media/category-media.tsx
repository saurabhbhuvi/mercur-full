import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { useProductCategory } from "../../../hooks/api/categories"
import { CategoryMediaView } from "./components/category-media-view"

export const CategoryMedia = () => {
  const { id } = useParams()

  const { product_category, isPending, isError, error } = useProductCategory(
    id!
  )

  const ready = !isPending && !!product_category

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {ready && <CategoryMediaView category={product_category} />}
    </RouteFocusModal>
  )
}
