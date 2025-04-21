import streamlit as st
import os
import uuid
from utils.image_checker import check_fake_image
from utils.video_checker import check_fake_video
from utils.audio_checker import check_fake_audio
from utils.text_checker import check_fake_text

# Streamlit page configuration
st.set_page_config(page_title="Authentic AI", layout="wide")

# Upload directory setup
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Save uploaded file locally
def save_uploaded_file(uploaded_file):
    filename = f"{uuid.uuid4().hex}_{uploaded_file.name}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(uploaded_file.read())
    return filepath

# Page functions
def image_page():
    st.header("🖼️ Image Authentic Detection")
    file = st.file_uploader("Upload an image", type=["png", "jpg", "jpeg", "webp"])
    if file and st.button("Analyze"):
        with st.spinner("Analyzing..."):
            filepath = save_uploaded_file(file)
            result = check_fake_image(filepath)
            st.success("Analysis complete!")
            st.metric("Confidence Score", f"{result['confidence_score']*100:.2f}%")
            st.write(result['analysis'])
            os.remove(filepath)

def video_page():
    st.header("🎥 Video Authentic Detection")
    file = st.file_uploader("Upload a video", type=["mp4", "avi", "mov", "webm"])
    if file and st.button("Analyze"):
        with st.spinner("Analyzing..."):
            filepath = save_uploaded_file(file)
            result = check_fake_video(filepath)
            st.success("Analysis complete!")
            st.metric("Confidence Score", f"{result['confidence_score']*100:.2f}%")
            st.write(result['analysis'])
            os.remove(filepath)

def audio_page():
    st.header("🔊 Audio Authentic Detection")
    file = st.file_uploader("Upload an audio file", type=["mp3", "wav", "m4a", "ogg"])
    if file and st.button("Analyze"):
        with st.spinner("Analyzing..."):
            filepath = save_uploaded_file(file)
            result = check_fake_audio(filepath)
            st.success("Analysis complete!")
            st.metric("Confidence Score", f"{result['confidence_score']*100:.2f}%")
            st.write(result['analysis'])
            os.remove(filepath)

def text_page():
    st.header("📝 Text AI Detection")
    text = st.text_area("Paste text here to analyze")
    if st.button("Analyze"):
        if text.strip():
            with st.spinner("Analyzing..."):
                result = check_fake_text(text)
                st.success("Analysis complete!")
                st.metric("Confidence Score", f"{result['confidence_score']*100:.2f}%")
                st.write(result['analysis'])
        else:
            st.warning("Please enter some text to analyze.")

def home_page():
    st.markdown(
        """
        <style>
        .title {
            font-size: 3em;
            font-weight: bold;
            text-align: center;
            color: #4CAF50;
        }
        .sub {
            font-size: 1.2em;
            text-align: center;
            margin-bottom: 2rem;
        }
        .menu-button {
            display: block;
            width: 100%;
            padding: 20px;
            font-size: 1.2rem;
            background-color: #4CAF50;
            color: white;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 10px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .menu-button:hover {
            background-color: #45a049;
        }
        </style>
        """, unsafe_allow_html=True
    )
    st.markdown('<div class="title">🧠 Authentic AI</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub">Detect AI-generated content in images, videos, audio, and text with a single platform.</div>', unsafe_allow_html=True)
    st.markdown("---")
    
    # Menu on the home page
    st.markdown("### 🔍 Get Started")
    st.info("Use the buttons below to choose the type of content you'd like to analyze.")

    # Create menu buttons
    menu_options = ["Image", "Video", "Audio", "Text"]
    selected_page = st.radio("Select the content type to analyze", menu_options, index=0, horizontal=True)

    return selected_page

# Run the app
selected_page = home_page()

if selected_page == "Image":
    image_page()
elif selected_page == "Video":
    video_page()
elif selected_page == "Audio":
    audio_page()
elif selected_page == "Text":
    text_page()
