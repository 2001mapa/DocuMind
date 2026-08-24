import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Left Square */}
        <div
          style={{
            position: 'absolute',
            left: '-8px',
            top: '-8px',
            width: '24px',
            height: '24px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
          }}
        />
        {/* Bottom Right Square */}
        <div
          style={{
            position: 'absolute',
            right: '-8px',
            bottom: '-8px',
            width: '24px',
            height: '24px',
            border: '3px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '6px',
          }}
        />
        {/* Center Dot */}
        <div
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: 'white',
            borderRadius: '3px',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
