import { toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { UseFieldArrayAppend, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  FileUpload,
} from "../../../../../components/common/file-upload"
import { Form } from "../../../../../components/common/form"

import { EditCategoryMediaSchemaType } from "../../../category-create/types"

type UploadCategoryMediaFormItemProps = {
  form:
    | UseFormReturn<EditCategoryMediaSchemaType>
  append: UseFieldArrayAppend<EditCategoryMediaSchemaType, "media">
}

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/svg+xml",
]

const SUPPORTED_FORMATS_FILE_EXTENSIONS = [
  ".jpeg",
  ".jpg",
  ".png",
  ".gif",
  ".webp",
  ".heic",
  ".svg",
]

export const UploadCategoryMediaFormItem = ({
  form,
  append,
}: UploadCategoryMediaFormItemProps) => {
  const { t } = useTranslation()
  const [previews, setPreviews] = useState<string[]>([])

  const handleFilesChosen = async (files: Array<{ file: File }>) => {
    const actualFiles = files.map(f => f.file)
    const invalidFiles = actualFiles.filter(
      (f) => !SUPPORTED_FORMATS.includes(f.type)
    )

    if (invalidFiles.length > 0) {
      toast.error(
        t("products.media.invalidFileType", {
          fileTypes: SUPPORTED_FORMATS_FILE_EXTENSIONS.join(", "),
        })
      )
      return
    }

    const objectUrls: string[] = []

    actualFiles.forEach((f) => {
      const url = URL.createObjectURL(f)
      objectUrls.push(url)

      const id = Math.random().toString(36).substring(7)

      append({
        id,
        url,
        isThumbnail: false,
        file: f,
      })
    })

    setPreviews((prev) => [...prev, ...objectUrls])
  }

  useEffect(() => {
    return () => {
      if (previews.length) {
        previews.forEach((p) => {
          URL.revokeObjectURL(p)
        })
      }
    }
  }, [previews])

  return (
    <div className="flex flex-col gap-y-4">
      <Form.Field
        control={
          form.control as UseFormReturn<EditCategoryMediaSchemaType>["control"]
        }
        name="media"
        render={() => {
          return (
            <Form.Item>
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-col">
                  <Form.Label optional>Media</Form.Label>
                  <Form.Hint>Add images to your category.</Form.Hint>
                </div>
                <Form.Control>
                  <FileUpload
                    label="Upload images"
                    hint="Supports: JPG, PNG, GIF, SVG, WEBP, HEIC"
                    formats={SUPPORTED_FORMATS}
                    onUploaded={handleFilesChosen}
                  />
                </Form.Control>
              </div>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
    </div>
  )
}
