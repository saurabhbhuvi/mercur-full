import { PencilSquare, ThumbnailBadge } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"

type CategoryMediaSectionProps = {
  category: HttpTypes.AdminProductCategory
}

export const CategoryMediaSection = ({
  category,
}: CategoryMediaSectionProps) => {
  const { t } = useTranslation()
  const images = (category.metadata?.images as any[]) || []
  const thumbnail = category.metadata?.thumbnail as string | undefined

  const hasMedia = images.length > 0 || thumbnail

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
                {image.url === thumbnail && (
                  <div className="absolute top-2 left-2 z-10">
                    <Tooltip content={t("fields.thumbnail")}>
                      <ThumbnailBadge />
                    </Tooltip>
                  </div>
                )}
                <Link to="media" state={{ curr: index }}>
                  <img
                    src={image.url}
                    alt={`${category.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </Link>
              </div>
            ))}
            {thumbnail && !images.some((img: any) => img.url === thumbnail) && (
              <div className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-lg">
                <div className="absolute top-2 left-2 z-10">
                  <Tooltip content={t("fields.thumbnail")}>
                    <ThumbnailBadge />
                  </Tooltip>
                </div>
                <Link to="media" state={{ curr: 0 }}>
                  <img
                    src={thumbnail}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  )
}
