import os
import requests
from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
from column_summary import get_column_summary
from data_cleaning import do_cleaning
from ml_pipeline import run_ml_pipeline
import pandas as pd

app = Flask(__name__)
CORS(app)

PINATA_API_KEY = '8b59dd10a177b4181d4e'
PINATA_API_SECRET = "515b0d4c7a4cbb190bfa1df4ab12e388917b7defc373115d404b94942e911f4f"

#hash key list

target_column = "price"
api = Api(app)

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {"message": "Hello from Flask!"}
    return jsonify(data)
# Upload the CSV file to Pinata
@app.route('/upload_csv', methods=['POST'])
def upload_csv_to_pinata():
    # Get the uploaded file
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Save the file to the server
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_API_SECRET,
    }
    files = {'file': (file.filename, file.stream, file.content_type)}

    response = requests.post(url, headers=headers, files=files)
    if response.status_code == 200:
        ipfs_hash =response.json()["IpfsHash"]
        return jsonify({"message": "File uploaded successfully", "ipfs_hash": ipfs_hash}), 200
    else:
        return jsonify({"error": "Failed to upload file", "details": response.json()}), 500

# Download the CSV file from Pinata
@app.route('/get_csv/<ipfs_hash>', methods=['GET'])
def get_csv_from_pinata(ipfs_hash):
    url = f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}"
    response = requests.get(url)

    if response.status_code == 200:
        # Serve the CSV content as a file

        return response.content, 200, {
            "Content-Disposition": f"attachment; filename={ipfs_hash}.csv",
            "Content-Type": "text/csv",
        }
    else:
        return jsonify({"error": "Failed to retrieve file", "details": response.json()}), 500



@app.route('/column_summary', methods=['POST'])
def column_summary():
    column_summary = pd.DataFrame()
    # Get the uploaded file
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the file to the server
    file.save("data.csv")
    df = pd.read_csv("data.csv")

 
    column_summary = get_column_summary(df)

    return jsonify(column_summary)

#cleaning the data
@app.route('/clean_data', methods=['POST'])
def clean_data():
    # Get the uploaded file
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the file to the server
    file.save("data.csv")
    df = pd.read_csv("data.csv")
    df = do_cleaning(df, target_column)
    df.to_csv("cleaned_data.csv", index=False)
    return jsonify({"message": "Data cleaned successfully", "file": "cleaned_data.csv"})

# Run the ml application
@app.route('/run_ml', methods=['POST'])
def run_ml():
    # Get the uploaded file
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Get the target column from the request (form or JSON)
    target_column = request.form.get('target_column')
    if not target_column:
        return jsonify({"error": "No target column specified"}), 400

    # Save the file to the server
    file.save("data.csv")
    df = pd.read_csv("data.csv")

    # Run the ML pipeline
    model_comparison, feature_importance = run_ml_pipeline(df, target_column)
    
    # Return the results as JSON
    return jsonify({"model_comparison": model_comparison, "feature_importance": feature_importance})




if __name__ == '__main__':
    app.run(debug=True)


