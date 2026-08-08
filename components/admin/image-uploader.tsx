"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, UploadCloud, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const existing = [
  "/products/cricket-bat.png",
  "/products/football.png",
  "/products/dumbbells.png",
  "/products/rc-car.png",
  "/products/basketball.png",
  "/products/running-shoes.png",
  "/products/building-blocks.png",
  "/products/yoga-mat.png",
]

export function ImageUploader() {
  const [dragging, setDragging] = useState(false)
  const [gallery, setGallery] = useState<string[]>(existing)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files) return
    const urls = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => URL.createObjectURL(f))
    if (urls.length) setGallery((g) => [...urls, ...g])
  }

  return (
    <Card className="rounded-2xl border-border/60">
      <CardHeader>
        <CardTitle className="font-display">Media library</CardTitle>
        <CardDescription>Upload and manage product imagery</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-secondary/30 px-6 py-12 text-center transition-all",
            dragging && "scale-[1.01] border-primary bg-primary/5",
          )}
        >
          <span
            className={cn(
              "grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform",
              dragging && "scale-110",
            )}
          >
            <UploadCloud className="size-7" />
          </span>
          <div>
            <p className="font-medium">Drag & drop images here</p>
            <p className="text-sm text-muted-foreground">or click to browse — PNG, JPG, WEBP up to 5MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </button>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <ImagePlus className="size-4 text-muted-foreground" />
            {gallery.length} images
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {gallery.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="group relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-secondary/40"
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt="Uploaded media"
                  fill
                  sizes="150px"
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={() => setGallery((g) => g.filter((_, idx) => idx !== i))}
                  className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-background/80 text-muted-foreground opacity-0 backdrop-blur transition-all hover:text-destructive group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
