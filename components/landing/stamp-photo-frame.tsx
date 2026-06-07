"use client"

import { useId, useMemo } from "react"

type StampPhotoFrameProps = {
  src: string
  alt: string
  sizes?: string
}

const VB_W = 300
const VB_H = 400
const OUTER_RX = 18
const FRAME_INSET = 14
const SCALLOP_R = 7
const STAMP_FRAME_COLOR = "#B85A32"

/** Postage-stamp perforations — arcs bulge outward into the terracotta margin */
function buildScallopedRect(
  x: number,
  y: number,
  w: number,
  h: number,
  scallopsX: number,
  scallopsY: number,
  r: number,
): string {
  const flat = 0.22
  const parts: string[] = [`M ${x},${y}`]

  const stepX = w / scallopsX
  for (let i = 0; i < scallopsX; i++) {
    const segStart = x + i * stepX
    const segEnd = x + (i + 1) * stepX
    parts.push(`L ${segStart + stepX * flat},${y}`)
    parts.push(`A ${r},${r} 0 0,0 ${segEnd - stepX * flat},${y}`)
  }

  const stepY = h / scallopsY
  for (let i = 0; i < scallopsY; i++) {
    const segStart = y + i * stepY
    const segEnd = y + (i + 1) * stepY
    parts.push(`L ${x + w},${segStart + stepY * flat}`)
    parts.push(`A ${r},${r} 0 0,1 ${x + w},${segEnd - stepY * flat}`)
  }

  for (let i = scallopsX - 1; i >= 0; i--) {
    const segEnd = x + (i + 1) * stepX
    const segStart = x + i * stepX
    parts.push(`L ${segEnd - stepX * flat},${y + h}`)
    parts.push(`A ${r},${r} 0 0,0 ${segStart + stepX * flat},${y + h}`)
  }

  for (let i = scallopsY - 1; i >= 0; i--) {
    const segEnd = y + (i + 1) * stepY
    const segStart = y + i * stepY
    parts.push(`L ${x},${segEnd - stepY * flat}`)
    parts.push(`A ${r},${r} 0 0,1 ${x},${segStart + stepY * flat}`)
  }

  parts.push("Z")
  return parts.join(" ")
}

export function StampPhotoFrame({ src, alt }: StampPhotoFrameProps) {
  const clipId = useId().replace(/:/g, "")

  const scallopPath = useMemo(
    () =>
      buildScallopedRect(
        FRAME_INSET,
        FRAME_INSET,
        VB_W - FRAME_INSET * 2,
        VB_H - FRAME_INSET * 2,
        10,
        13,
        SCALLOP_R,
      ),
    [],
  )

  const innerW = VB_W - FRAME_INSET * 2
  const innerH = VB_H - FRAME_INSET * 2

  return (
    <div className="stamp-photo-frame-wrap">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="stamp-photo-frame"
        role="img"
        aria-label={alt}
        preserveAspectRatio="xMidYMid meet"
      >
        <title>{alt}</title>
        <defs>
          <clipPath id={clipId}>
            <path d={scallopPath} />
          </clipPath>
        </defs>

        <rect width={VB_W} height={VB_H} rx={OUTER_RX} fill={STAMP_FRAME_COLOR} />

        <image
          href={src}
          clipPath={`url(#${clipId})`}
          x={FRAME_INSET}
          y={FRAME_INSET}
          width={innerW}
          height={innerH}
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    </div>
  )
}
