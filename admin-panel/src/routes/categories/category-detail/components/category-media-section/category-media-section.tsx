import { PencilSquare, ThumbnailBadge } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useCategoryImages } from "../../../../../hooks/api/category-images"

type CategoryMediaSectionProps = {
  category: HttpTypes.AdminProductCategory
}

export const CategoryMediaSection = ({
  category,
}: CategoryMediaSectionProps) => {
  const { t } = useTranslation()
  const { data: images = [] } = useCategoryImages(category.id)

  const hasMedia = images.length > 0

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Media</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  icon: <PencilSquare />,
                  to: "media?view=edit",
                },
              ],
            },
          ]}
        />
      </div>
      <div className="px-6 py-4">
        {!hasMedia && (
          <div className="text-ui-fg-subtle flex items-center justify-center h-24">
            <p className="text-sm">No media added yet</p>
          </div>
        )}
        {hasMedia && (
          <div className="grid grid-cols-[repeat(auto-fill,96px)] gap-4">
            {images.map((image: any, index: number) => (
              <div
                key={image.id || index}
                className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-lg"
              >
                <Link to="media" state={{ curr: index }}>
                  {image.type === "thumbnail" && (
                    <div className="absolute top-2 left-2 z-10">
                      <Tooltip content={t("fields.thumbnail")}>
                        <ThumbnailBadge />
                      </Tooltip>
                    </div>
                  )}
                  <img
                    src={image.url}
                    alt={`${category.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
