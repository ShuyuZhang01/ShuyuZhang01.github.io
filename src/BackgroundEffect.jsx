import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random'

export default function BackgroundEffect({ count = 1000, size = 0.02, color = '#fbbf24' }) {
  const ref = useRef()
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    random.fill(positions)
    return positions
  }, [count])

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10
    ref.current.rotation.y -= delta / 15
  })

  return (
    <group position={[0, 0, 0]}>
      <Points
        ref={ref}
        positions={positions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color={color}
          size={size}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  )
} 