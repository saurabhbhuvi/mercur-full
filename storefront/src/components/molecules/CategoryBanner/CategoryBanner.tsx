import Image from "next/image"

type CategoryBannerProps = {
  thumbnailUrl?: string
  categoryName: string
}

export const CategoryBanner = ({
  thumbnailUrl,
  categoryName,
}: CategoryBannerProps) => {
  if (!thumbnailUrl) {
    return null
  }

  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 mb-8 overflow-hidden rounded-lg">
      <Image
        src={thumbnailUrl}
        alt={categoryName}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
          {categoryName}
        </h1>
      </div>
    </div>
  )
}
