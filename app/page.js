
'use client'

import React, { useState } from 'react'
import { ReactMic } from 'react-mic'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [record, setRecord] = useState(false)
  const [transcript, setTranscript] = useState('')

  const startRecording = () => setRecord(true)
  const stopRecording = () => setRecord(false)

  const onStop = async (recordedBlob) => {
    try {
      const audioFile = new File([recordedBlob.blob], 'recording.wav', {
        type: 'audio/wav',
      })

      const formData = new FormData()
      formData.append('file', audioFile)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setTranscript(data.transcript)
    } catch (error) {
      console.error('Error:', error)
      setTranscript('Error in transcription. Try again.')
    }
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Medical Dictation Transcriber 🩺🎙️</h1>
      <ReactMic
        record={record}
        onStop={onStop}
        mimeType="audio/wav"
        strokeColor="#000000"
        backgroundColor="#FF4081"
      />
      <div style={{ marginTop: '20px' }}>
        <button onClick={startRecording}>Start Recording 🎤</button>
        <button onClick={stopRecording} style={{ marginLeft: '10px' }}>
          Stop Recording ⏹️
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>Transcription:</h2>
        <p>{transcript}</p>
      </div>
    </div>
  )
}
