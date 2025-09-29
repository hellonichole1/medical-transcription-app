'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const DynamicRecorder = dynamic(
  () => import('./components/RecorderComponent'),
  { ssr: false }
)

export default function Home() {
  return (
    <div>
      <DynamicRecorder />
    </div>
  )
}
