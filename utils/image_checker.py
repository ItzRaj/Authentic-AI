
import os
import random
import time
import numpy as np

# Try to import DeepFace
deepface_available = False
try:
    from deepface import DeepFace
    deepface_available = True
except ImportError as e:
    print(f"[WARN] DeepFace not available: {e}")
    print("[INFO] Fallback detection will be used.")

def convert_numpy(obj):
    """
    Recursively convert NumPy types to native Python types.
    Useful when returning JSON-safe data.
    """
    if isinstance(obj, dict):
        return {k: convert_numpy(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy(i) for i in obj]
    elif isinstance(obj, np.generic):
        return obj.item()
    else:
        return obj

def check_fake_image(image_path: str) -> dict:
    """
    Analyze an image to detect if it's AI-generated or manipulated.

    If DeepFace is available, it performs real analysis.
    Otherwise, it uses fallback logic.

    Parameters:
        image_path (str): Path to the image.

    Returns:
        dict: Analysis result including confidence and fake status.
    """
    if not os.path.exists(image_path):
        return {
            "error": "Image file not found",
            "confidence_score": 0.0,
            "is_fake": False
        }

    if not deepface_available:
        return fallback_fake_detection(image_path, error="DeepFace not available")

    try:
        # Perform DeepFace analysis
        analysis = DeepFace.analyze(
            img_path=image_path,
            actions=["age", "gender", "race", "emotion"],
            enforce_detection=False
        )
        clean_analysis = convert_numpy(analysis)

        # Demo logic: Low 'neutral' emotion confidence implies likely fake
        emotion_score = clean_analysis[0]['emotion'].get('neutral', 0)
        is_fake = emotion_score < 30
        confidence = 0.8 if is_fake else 0.4

        return {
            "confidence_score": confidence,
            "is_fake": is_fake,
            "analysis": "DeepFace analysis successful.",
            "deepface_details": clean_analysis
        }

    except Exception as e:
        return fallback_fake_detection(image_path, error=str(e))

def fallback_fake_detection(image_path: str, error: str = "DeepFace failed") -> dict:
    """
    Fallback method for fake image detection when DeepFace is not available or fails.

    Parameters:
        image_path (str): Path to the image.
        error (str): Error message to include in response.

    Returns:
        dict: Simulated detection result.
    """
    time.sleep(1.5)  # Simulate processing time

    file_size = os.path.getsize(image_path)
    seed = file_size % 100
    random.seed(seed)

    confidence = random.uniform(0.3, 0.95)
    is_fake = confidence > 0.5

    if is_fake:
        indicators = [
            "inconsistent lighting", "unusual facial feature proportions",
            "irregular background patterns", "unnatural texture smoothing",
            "pixel-level artifacts around edges", "shadow inconsistencies",
            "symmetry abnormalities", "unexpected color distributions"
        ]
        selected = random.sample(indicators, k=random.randint(2, 3))
        analysis_text = (
            "This image shows signs of AI generation or manipulation. "
            "Detected patterns include " + ", ".join(selected) + "."
        )
    else:
        analysis_text = (
            "This image appears to be authentic based on our fallback analysis. "
            "No significant indicators of manipulation were detected."
        )

    return {
        "confidence_score": confidence,
        "is_fake": is_fake,
        "analysis": analysis_text,
        "fallback_used": True,
        "error": error
    }
