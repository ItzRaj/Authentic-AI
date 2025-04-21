"""
Text DeepFake Detection Utility

This module provides functionality to detect AI-generated text.
"""
import random
import time
import hashlib

def check_fake_text(text):
    """
    Analyze text to detect if it's AI-generated.
    
    Args:
        text (str): Text content to analyze
        
    Returns:
        dict: Analysis results with confidence score and details
    """
    # In a real implementation, this would use NLP models
    # For this demo, we'll simulate analysis with random results
    
    # Simulate processing time
    time.sleep(1.2)
    
    # Check if text is empty
    if not text or len(text.strip()) == 0:
        return {
            "error": "No text provided for analysis",
            "confidence_score": 0,
            "is_fake": False
        }
    
    # Use text hash to seed random for consistent results with same text
    text_hash = hashlib.md5(text.encode()).hexdigest()
    seed = int(text_hash[:8], 16)
    random.seed(seed)
    
    # Generate confidence score with some relation to text length and complexity
    # This creates more realistic behavior than pure randomness
    text_length = len(text)
    word_count = len(text.split())
    
    # In reality, longer AI texts often have more patterns to detect
    length_factor = min(1.0, text_length / 5000)
    complexity_factor = min(1.0, word_count / 1000)
    
    base_confidence = random.uniform(0.3, 0.9)
    confidence = (base_confidence + length_factor + complexity_factor) / 3
    confidence = min(0.95, max(0.3, confidence))  # Keep between 0.3 and 0.95
    
    is_fake = confidence > 0.5
    
    # Prepare analysis details
    if is_fake:
        analysis = (
            "This text shows characteristics consistent with AI generation. "
            "Our analysis detected "
        )
        
        # List possible AI text indicators
        indicators = [
            "repetitive phrasing patterns",
            "unusually consistent tone throughout",
            "statistical word distribution matching AI patterns",
            "lack of stylistic variation",
            "predictable sentence structures",
            "uniform paragraph lengths",
            "generic transitional phrases",
            "limited idiomatic expressions",
            "context-insensitive vocabulary choices"
        ]
        
        # Select 2-4 random indicators
        num_indicators = random.randint(2, 4)
        selected_indicators = random.sample(indicators, num_indicators)
        
        analysis += ", ".join(selected_indicators) + "."
    else:
        analysis = (
            "This text appears to be human-written based on our linguistic analysis. "
            "We detected natural stylistic variations and semantic coherence consistent with human writing."
        )
    
    return {
        "confidence_score": confidence,
        "is_fake": is_fake,
        "analysis": analysis
    }