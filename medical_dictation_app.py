
import streamlit as st
import base64
from google.oauth2 import service_account
from google.cloud import speech_v1p1beta1 as speech

st.title("🩺 OffLabel Medical Dictation App")

audio_file = st.file_uploader("Record your audio and upload here:", type=["wav", "mp3", "m4a"])

if audio_file is not None:
    st.audio(audio_file, format='audio/wav')

    # Convert audio file to base64 for transcription
    audio_content = audio_file.read()
    audio_b64 = base64.b64encode(audio_content).decode('utf-8')

    st.write("Audio file loaded and ready for transcription.")
