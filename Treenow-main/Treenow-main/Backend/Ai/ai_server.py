import os
import numpy as np
import tensorflow as tf
import requests
from io import BytesIO
from flask import Flask, request, jsonify
from pymongo import MongoClient
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator, img_to_array, load_img

# Create Flask App
app = Flask(__name__)

# MongoDB Configuration
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "tree_care_db"
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Create 'uploads' directory if not exists
if not os.path.exists('uploads'):
    os.makedirs('uploads')

# ===========================
# 🛠️ Model Training Section
# ===========================

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
MODEL_PATH = 'model/tree_care_model.h5'

# Define Input Shape
input_shape = (224, 224, 3)
inputs = Input(shape=input_shape)

# CNN Model
x = Conv2D(32, (3, 3), activation='relu')(inputs)
x = MaxPooling2D(2, 2)(x)
x = Conv2D(64, (3, 3), activation='relu')(x)
x = MaxPooling2D(2, 2)(x)
x = Conv2D(128, (3, 3), activation='relu')(x)
x = MaxPooling2D(2, 2)(x)
x = Flatten()(x)
x = Dense(128, activation='relu')(x)
x = Dropout(0.5)(x)

# Output 1: Tree Type Classification
tree_type_output = Dense(4, activation='softmax', name='tree_type')(x)

# Output 2: Tree Problem Classification
tree_problem_output = Dense(5, activation='softmax', name='tree_problem')(x)

# Build Multi-Output Model
model = Model(inputs=inputs, outputs=[tree_type_output, tree_problem_output])
model.compile(optimizer='adam',
              loss={'tree_type': 'categorical_crossentropy', 'tree_problem': 'categorical_crossentropy'},
              metrics=['accuracy'])

# ===========================
# 📚 Load Data from MongoDB
# ===========================

def fetch_and_save_images(collection_name, label_field, folder_name):
    """Fetch images from MongoDB and save them locally for training."""
    collection = db[collection_name]
    folder_path = f'dataset/{folder_name}'
    
    # Create directories if not exists
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    for doc in collection.find():
        label = doc[label_field]
        image_url = doc['image_url']
        label_folder = f'{folder_path}/{label}'
        
        if not os.path.exists(label_folder):
            os.makedirs(label_folder)

        # Download and save image
        response = requests.get(image_url)
        if response.status_code == 200:
            img_path = f'{label_folder}/{doc["_id"]}.jpg'
            with open(img_path, 'wb') as f:
                f.write(response.content)

# Fetch Images from MongoDB
fetch_and_save_images('tree_types', 'tree_type', 'tree_type')
fetch_and_save_images('tree_problems', 'problem_type', 'tree_problems')

# ===========================
# 🚀 Model Training
# ===========================

# Data Augmentation and Loading
datagen = ImageDataGenerator(rescale=1.0 / 255)

# Load Tree Type Data
tree_type_data = datagen.flow_from_directory(
    'dataset/tree_type',
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

# Load Tree Problem Data
tree_problem_data = datagen.flow_from_directory(
    'dataset/tree_problems',
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

# Train the Model
print("Training Model... ⏳")
history = model.fit(
    tree_type_data,
    steps_per_epoch=len(tree_type_data),
    epochs=EPOCHS,
    validation_data=tree_problem_data,
    validation_steps=len(tree_problem_data)
)

# Save the Model
if not os.path.exists('model'):
    os.makedirs('model')
model.save(MODEL_PATH)
print(f"✅ Model Trained and Saved as '{MODEL_PATH}'")

# ===========================
# 🚀 Flask API Section
# ===========================

# Load Trained Model
model = load_model(MODEL_PATH)

# Define Class Names
tree_type_classes = list(tree_type_data.class_indices.keys())
tree_problem_classes = list(tree_problem_data.class_indices.keys())

@app.route('/')
def home():
    return "🌳 Tree Care AI is running! Use /predict to analyze tree images."

@app.route('/predict', methods=['POST'])
def predict():
    # Check if file is sent
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded. Please provide an image."})

    file = request.files['file']
    filename = os.path.join('uploads', file.filename)
    file.save(filename)

    # Load and preprocess the image
    img = load_img(filename, target_size=IMG_SIZE)
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Make prediction
    predictions = model.predict(img_array)

    # Get Predictions
    predicted_tree_type = tree_type_classes[np.argmax(predictions[0])]
    predicted_tree_problem = tree_problem_classes[np.argmax(predictions[1])]

    # Prepare response
    result = {
        "tree_type": predicted_tree_type,
        "problem_detected": predicted_tree_problem,
        "confidence_tree_type": f"{np.max(predictions[0]) * 100:.2f}%",
        "confidence_problem": f"{np.max(predictions[1]) * 100:.2f}%"
    }

    return jsonify(result)

# Run Flask App
if __name__ == '__main__':
    app.run(debug=True, port=3000)
