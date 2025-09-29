import { NextResponse } from 'next/server'
import { SpeechClient } from '@google-cloud/speech'

export async function POST(request) {
  const data = await request.formData()
  const audioFile = data.get('file')

  const audioBytes = Buffer.from(await audioFile.arrayBuffer())

  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)

  const client = new SpeechClient({ credentials })

  // Set up streaming request optimized for medical dictation
  const streamingConfig = {
    config: {
      encoding: 'WEBM_OPUS', // browser-native audio format
      sampleRateHertz: 48000, // correct browser mic default
      languageCode: 'en-US',
      model: 'medical_dictation', // explicitly use medical model
      useEnhanced: true,         // enhanced transcription accuracy
    },
    interimResults: true,        // show words as they come in
  }

  const recognizeStream = client
    .streamingRecognize(streamingConfig)
    .on('error', (error) => console.error('Streaming Error:', error))
    .on('data', (data) => {
      process.stdout.write(
        data.results[0]?.alternatives[0]?.transcript || ''
      )
    })

  recognizeStream.write(audioBytes)
  recognizeStream.end()

  // Stream response back to frontend
  return NextResponse.json({ transcript: 'Streaming initiated...' })
}
