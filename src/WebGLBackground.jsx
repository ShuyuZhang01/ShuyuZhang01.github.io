import React from 'react'
import { Canvas } from '@react-three/fiber'
import BackgroundEffect from './BackgroundEffect'

export default function WebGLBackground({ children }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* WebGL Background */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1,
        opacity: 0.3
      }}>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <BackgroundEffect count={2000} size={0.01} color="#fbbf24" />
        </Canvas>
      </div>
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
} 