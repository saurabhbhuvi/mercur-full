import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../lib/client"

export type CategoryImage = {
  id: string
  url: string
  file_id: string
  type: "thumbnail" | "image"
  category_id: string
}

type CategoryImagesResponse = {
  category_images: CategoryImage[]
}

// Query to fetch category images
export const useCategoryImages = (categoryId: string) => {
  return useQuery({
    queryKey: ["category-images", categoryId],
    queryFn: async () => {
      const response = await sdk.client.fetch<CategoryImagesResponse>(
        `/admin/product-categories/${categoryId}/images`
      )
      return response.category_images
    },
    enabled: !!categoryId,
  })
}

// Mutation to create category images
export const useCreateCategoryImages = (categoryId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (images: { type: "thumbnail" | "image"; url: string; file_id: string }[]) => {
      const response = await sdk.client.fetch<CategoryImagesResponse>(
        `/admin/product-categories/${categoryId}/images`,
        {
          method: "POST",
          body: { images },
        }
      )
      return response.category_images
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-images", categoryId] })
      queryClient.invalidateQueries({ queryKey: ["product-categories"] })
    },
  })
}

// Mutation to update category images
export const useUpdateCategoryImages = (categoryId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: { id: string; type: "thumbnail" | "image" }[]) => {
      const response = await sdk.client.fetch<CategoryImagesResponse>(
        `/admin/product-categories/${categoryId}/images/batch`,
        {
          method: "POST",
          body: { updates },
        }
      )
      return response.category_images
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-images", categoryId] })
      queryClient.invalidateQueries({ queryKey: ["product-categories"] })
    },
  })
}

// Mutation to delete category images
export const useDeleteCategoryImages = (categoryId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await sdk.client.fetch(
        `/admin/product-categories/${categoryId}/images/batch`,
        {
          method: "DELETE",
          body: { ids },
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-images", categoryId] })
      queryClient.invalidateQueries({ queryKey: ["product-categories"] })
    },
  })
}
