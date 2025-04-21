"""
Video DeepFake Detection Utility

Uses simulated analysis to detect AI-generated or manipulated videos.
Easily extendable to real models (e.g., OpenCV + deep learning).
"""

import os
import random
import time

def check_fake_video(video_path):
    """
    Analyze a video to detect if it's AI-generated or manipulated.

    Args:
        video_path (str): Path to the video file.

    Returns:
        dict: Analysis results with confidence score and details.
    """
    # Simulate longer processing time for video
    time.sleep(2.5)

    # Validate input file
    if not os.path.exists(video_path):
        return {
            "error": "Video file not found",
            "confidence_score": 0,
            "is_fake": False
        }

    # Use file size to seed randomness
    file_size = os.path.getsize(video_path)
    seed = file_size % 100
    random.seed(seed)

    # Random fake confidence score
    confidence = round(random.uniform(0.4, 0.9), 3)
    is_fake = confidence > 0.5

    # Generate analysis description
    if is_fake:
        indicators = [
            "inconsistent facial movements",
            "unnatural blinking patterns",
            "audio-visual desynchronization",
            "temporal inconsistencies between frames",
            "edge artifacts around face regions",
            "unnatural head movements",
            "lighting inconsistencies across frames",
            "abnormal mouth movements when speaking"
        ]
        selected = random.sample(indicators, random.randint(2, 4))
        analysis_text = (
            "This video shows signs of deepfake manipulation. "
            "Detected indicators include " + ", ".join(selected) + "."
        )
    else:
        analysis_text = (
            "This video appears to be authentic. "
            "No significant signs of manipulation detected. "
            "Motion patterns and audio-visual synchronization appear consistent."
        )

    return {
        "confidence_score": confidence,
        "is_fake": is_fake,
        "analysis": analysis_text,
        "fallback_used": True  # mark it as simulated
    }
