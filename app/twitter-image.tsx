import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'BrainWise.pro - Advanced brain health monitoring and assessments'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  const imageData = await fetch(
    new URL('../public/brain-hero.png', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img 
          src={imageData as unknown as string}
          alt={alt}
          width={1200}
          height={630}
          style={{ objectFit: 'cover' }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
} 