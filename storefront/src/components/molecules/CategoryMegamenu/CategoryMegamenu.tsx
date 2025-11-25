"use client"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { CategoryImage } from "@/types/categories"
import { useState } from "react"

type CategoryWithImages = HttpTypes.StoreProductCategory & {
  metadata?: {
    thumbnail?: string
    banner?: string
  }
}

export const CategoryMegamenu = ({
  categories,
}: {
  categories: CategoryWithImages[]
}) => {
  const [isOpen, setIsOpen] = useState(false)

  // Filter to only show parent categories (no parent_category_id)
  const parentCategories = categories.filter(
    (category) => !category.parent_category_id
  )

  return (
    <div
      className="relative h-full hidden lg:flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="relative h-full flex items-center px-4 focus:outline-none hover:text-gray-700 font-medium"
        data-testid="nav-categories-button"
      >
        Shop Categories
      </button>

      {/* Megamenu dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 w-screen max-w-7xl -translate-x-1/4">
          <div className="bg-white border border-gray-200 shadow-xl rounded-b-lg">
            <div className="container mx-auto px-4">
              <div
                data-testid="nav-categories-popup"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-8"
              >
                {parentCategories.map((category) => {
                  const thumbnailUrl = category.metadata?.thumbnail

                  return (
                    <LocalizedClientLink
                      key={category.id}
                      href={`/categories/${category.handle}`}
                      className="group flex flex-col gap-3 focus:outline-none"
                      data-testid={`category-${category.handle}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                        {thumbnailUrl ? (
                          <Image
                            src={thumbnailUrl}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg
                              className="w-12 h-12"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                          {category.name}
                        </h3>
                      </div>
                    </LocalizedClientLink>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
