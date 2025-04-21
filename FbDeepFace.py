# Save this as /mount/src/deepfake/utils/fb_deepface_patch.py

from tensorflow import keras
from tensorflow.keras.models import Model, Sequential
from tensorflow.keras.layers import (
    Convolution2D, MaxPooling2D, Flatten, Dense, Dropout,
    Activation, Conv2D
)
import os
import gdown
from deepface.commons import functions

# We'll replace LocallyConnected2D with Conv2D
# LocallyConnected2D is like Conv2D but without weight sharing

def build_model():
    """
    Modified FbDeepFace model that uses Conv2D instead of LocallyConnected2D
    """
    base_model = Sequential()
    base_model.add(Convolution2D(32, (11, 11), activation='relu', name='C1', input_shape=(152, 152, 3)))
    base_model.add(MaxPooling2D(pool_size=3, strides=2, padding='same', name='M2'))
    # Replace LocallyConnected2D with Conv2D (with groups=1 to simulate local connectivity)
    base_model.add(Conv2D(16, (9, 9), activation='relu', name='L3'))
    base_model.add(MaxPooling2D(pool_size=3, strides=2, padding='same', name='M4'))
    # Another Conv2D instead of LocallyConnected2D
    base_model.add(Conv2D(16, (7, 7), activation='relu', name='L5'))
    base_model.add(MaxPooling2D(pool_size=3, strides=2, name='M6'))
    # And another
    base_model.add(Conv2D(16, (5, 5), activation='relu', name='L7'))
    base_model.add(MaxPooling2D(pool_size=3, strides=2, padding='same', name='M8'))
    base_model.add(Flatten(name='F9'))
    base_model.add(Dense(4096, activation='relu', name='F10'))
    base_model.add(Dropout(rate=0.5, name='D11'))
    base_model.add(Dense(4096, activation='relu', name='F12'))
    base_model.add(Dropout(rate=0.5, name='D13'))
    base_model.add(Dense(2622, activation='softmax', name='FF'))
    
    return base_model

def loadModel(url="https://github.com/swghosh/DeepFace/releases/download/weights-vggface-2d-aligned/VGGFace2_DeepFace_weights_val-0.9034.h5"):
    model = build_model()

    # Check if model weights already exist
    home = functions.get_deepface_home()
    output = home + '/.deepface/weights/vgg_face_weights.h5'

    if os.path.exists(output) != True:
        print("Model will be downloaded...")
        gdown.download(url, output, quiet=False)

    # Load weights
    model.load_weights(output)

    return model
