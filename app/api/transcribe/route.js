import { NextResponse } from 'next/server'
import { SpeechClient } from '@google-cloud/speech'

export async function POST(request) {
  const data = await request.formData()
  const audioFile = data.get('file')

  const audioBytes = Buffer.from(await audioFile.arrayBuffer()).toString('base64')

  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)

  const client = new SpeechClient({ credentials })

  const audio = { content: audioBytes }

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 44100,
    languageCode: 'en-US',
  }

  const [response] = await client.recognize({ audio, config })
  const transcript = response.results.map(result => result.alternatives[0].transcript).join('\n')

  return NextResponse.json({ transcript })
}
