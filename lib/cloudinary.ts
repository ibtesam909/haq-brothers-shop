import { v2 as cloudinary } from "cloudinary"

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.warn("CLOUDINARY_CLOUD_NAME is not set — image uploads will not work")
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  api_key: process.env.CLOUDINARY_API_KEY ?? "",
  api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
  secure: true,
})

export default cloudinary

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  width: number
  height: number
  format: string
  bytes: number
}

export async function uploadToCloudinary(
  file: Buffer,
  folder = "haq-brothers",
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Upload failed"))
            return
          }
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            url: result.url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          })
        },
      )
      .end(file)
  })
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export async function listCloudinaryResources(
  folder = "haq-brothers",
  maxResults = 100,
) {
  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: folder,
    max_results: maxResults,
  })
  return result.resources as Array<{
    public_id: string
    secure_url: string
    width: number
    height: number
    format: string
    bytes: number
    created_at: string
  }>
}
