import { AbstractFileProviderService } from "@medusajs/framework/utils"
import { 
  ProviderFileResultDTO,
  ProviderDeleteFileDTO,
  ProviderGetFileDTO,
  ProviderUploadFileDTO,
} from "@medusajs/framework/types"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import stream from "stream"

type InjectedDependencies = {
  logger?: any
}

interface SupabaseFileModuleOptions {
  supabase_url: string
  supabase_key: string
  bucket: string
  file_url?: string
}

class SupabaseFileProviderService extends AbstractFileProviderService {
  static identifier = "supabase-file"
  protected supabase_: SupabaseClient
  protected bucket_: string
  protected fileUrl_: string
  protected logger_: any

  constructor(
    container: InjectedDependencies,
    options: SupabaseFileModuleOptions
  ) {
    super()

    this.logger_ = container?.logger
    this.supabase_ = createClient(options.supabase_url, options.supabase_key)
    this.bucket_ = options.bucket
    this.fileUrl_ = options.file_url || `${options.supabase_url}/storage/v1/object/public/${options.bucket}`
    
    this.logger_?.info(`Supabase file provider initialized with bucket: ${this.bucket_}`)
  }

  async upload(file: ProviderUploadFileDTO): Promise<ProviderFileResultDTO> {
    try {
      const fileName = `${Date.now()}-${file.filename}`
      const filePath = fileName

      // Convert stream to buffer if needed
      let fileBuffer: Buffer
      if (Buffer.isBuffer(file.content)) {
        fileBuffer = file.content
      } else if (file.content && typeof file.content === 'object' && 'pipe' in file.content) {
        fileBuffer = await this.streamToBuffer(file.content as stream.Readable)
      } else {
        throw new Error("Unsupported file content type")
      }

      const { data, error } = await this.supabase_.storage
        .from(this.bucket_)
        .upload(filePath, fileBuffer, {
          contentType: file.mimeType,
          upsert: false,
        })

      if (error) {
        throw error
      }

      const url = `${this.fileUrl_}/${data.path}`

      return {
        url,
        key: data.path,
      }
    } catch (error) {
      throw new Error(`Failed to upload file to Supabase: ${error.message}`)
    }
  }

  async delete(file: ProviderDeleteFileDTO): Promise<void> {
    try {
      const filePath = file.fileKey

      const { error } = await this.supabase_.storage
        .from(this.bucket_)
        .remove([filePath])

      if (error) {
        throw error
      }
    } catch (error) {
      throw new Error(`Failed to delete file from Supabase: ${error.message}`)
    }
  }

  async getPresignedDownloadUrl(
    fileData: ProviderGetFileDTO
  ): Promise<string> {
    try {
      const { data, error } = await this.supabase_.storage
        .from(this.bucket_)
        .createSignedUrl(fileData.fileKey, 3600) // 1 hour expiry

      if (error) {
        throw error
      }

      return data.signedUrl
    } catch (error) {
      throw new Error(`Failed to get presigned URL: ${error.message}`)
    }
  }

  private async streamToBuffer(stream: stream.Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
      stream.on("error", reject)
      stream.on("end", () => resolve(Buffer.concat(chunks)))
    })
  }
}

export default SupabaseFileProviderService
