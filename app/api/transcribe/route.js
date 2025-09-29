import { NextResponse } from 'next/server'
import { SpeechClient } from '@google-cloud/speech'

export async function POST(request) {
  const data = await request.formData()
  const audioFile = data.get('file')

  // Convert uploaded audio to base64
  const audioBytes = Buffer.from(await audioFile.arrayBuffer()).toString('base64')

  // Load Google credentials from environment variable
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)

  // Initialize the Speech client
  const client = new SpeechClient({ credentials })

  // Build the request for Google Speech-to-Text
  const audio = { content: audioBytes }

  // ✅ FIX: Let Google auto-detect the sample rate and use WEBM_OPUS (browser default)
  const config = {
  encoding: 'WEBM_OPUS',
  sampleRateHertz: 48000,
  languageCode: 'en-US',
  model: 'medical_dictation',
  useEnhanced: true,
}

  const [response] = await client.recognize({ audio, config })
  const transcript = response.results.map(result => result.alternatives[0].transcript).join('\n')

  return NextResponse.json({ transcript })
}
