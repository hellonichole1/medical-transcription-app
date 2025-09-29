'use client'

import React, { useState } from 'react'
import { ReactMediaRecorder } from 'react-media-recorder'

export default function Home() {
  const [transcript, setTranscript] = useState('')

  const handleStop = async (blobUrl, blob) => {
    try {
      const audioFile = new File([blob], 'recording.webm', {
        type: 'audio/webm',
      })

      const reader = new FileReader()
      reader.readAsDataURL(audioFile)
      reader.onloadend = async () => {
        const base64Audio = reader.result
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Audio }),
        })
        const data = await response.json()
        setTranscript(data.transcription || 'No transcription received.')
      }
    } catch (error) {
      console.error('Transcription error:', error)
      setTranscript('Error in transcription. Try again.')
    }
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Medical Dictation Transcriber 🩺🎙️</h1>
      <ReactMediaRecorder
        audio
        onStop={handleStop}
        render={({ status, startRecording, stopRecording }) => (
          <div>
            <p>Status: {status}</p>
            <button onClick={startRecording}>Start Recording 🎤</button>
            <button onClick={stopRecording} style={{ marginLeft: '10px' }}>
              Stop Recording ⏹️
            </button>
          </div>
        )}
      />
      <div style={{ marginTop: '20px' }}>
        <h2>Transcription:</h2>
        <p>{transcript}</p>
      </div>
    </div>
  )
}
