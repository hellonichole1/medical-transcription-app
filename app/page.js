'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const useReactMediaRecorder = dynamic(
  () => import('react-media-recorder').then((mod) => mod.useReactMediaRecorder),
  { ssr: false }
)

export default function Home() {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true })

  const transcribeAudio = async (audioBlobUrl) => {
    const audioBlob = await fetch(audioBlobUrl).then((r) => r.blob())
    const audioFile = new File([audioBlob], 'recording.wav', {
      type: 'audio/wav',
    })

    const formData = new FormData()
    formData.append('file', audioFile)

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      document.getElementById('transcription').innerText = data.transcript
    } catch (error) {
      console.error('Error:', error)
      document.getElementById('transcription').innerText =
        'Error transcribing audio.'
    }
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Medical Dictation Transcriber 🩺🎙️</h1>

      <div style={{ margin: '20px' }}>
        <button onClick={startRecording}>Start Recording 🎤</button>
        <button onClick={stopRecording} style={{ marginLeft: '10px' }}>
          Stop Recording ⏹️
        </button>
      </div>

      <p>Status: {status}</p>

      {mediaBlobUrl && (
        <div>
          <audio src={mediaBlobUrl} controls />
          <div>
            <button
              onClick={() => transcribeAudio(mediaBlobUrl)}
              style={{ marginTop: '10px' }}
            >
              Transcribe Audio ✨
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h2>Transcription 📝:</h2>
        <p id="transcription">—</p>
      </div>
    </div>
  )
}
