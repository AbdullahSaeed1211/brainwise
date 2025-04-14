import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'BrainWise.pro - Advanced brain health monitoring and assessments'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(to right, #334155, #1e293b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          color: 'white',
        }}
      >
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <svg
            height="100"
            viewBox="0 0 24 24"
            fill="none"
            style={{ marginRight: '20px' }}
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 16C11.2091 16 13 14.2091 13 12C13 9.79086 11.2091 8 9 8C6.79086 8 5 9.79086 5 12C5 14.2091 6.79086 16 9 16Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="#22c55e"
            />
            <path
              d="M15 16C17.2091 16 19 14.2091 19 12C19 9.79086 17.2091 8 15 8C12.7909 8 11 9.79086 11 12C11 14.2091 12.7909 16 15 16Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="#3b82f6"
            />
          </svg>
          <span style={{ fontWeight: 'bold' }}>BrainWise.pro</span>
        </div>
        <div style={{ fontSize: '28px', textAlign: 'center', maxWidth: '700px' }}>
          Advanced brain health monitoring and assessment platform
        </div>
        <div 
          style={{
            fontSize: '20px',
            marginTop: '30px',
            padding: '12px 30px',
            borderRadius: '50px',
            background: '#3b82f6',
            fontWeight: 'bold',
          }}
        >
          Take control of your brain health today
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 