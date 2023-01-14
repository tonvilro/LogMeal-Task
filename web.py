import os
import zipfile
from datetime import datetime
from flask import Flask, jsonify, request, abort, send_file
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
# The following line is used to allow requests from our JavaScript code (CORS policy)
cors = CORS(app)

app.config['UPLOAD_FOLDER'] = 'ImageDB'


@app.route('/')
def main():
    return jsonify('Welcome to the Log Meal Task!')


# TODO: Review HTTP conventions
@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'msg': 'No image provided'}), 400
    image = request.files['image']

    if image.filename == '':
        return jsonify({'msg': 'No image sent'}), 400

    if not allowed_file(image.filename):
        return jsonify({'msg': 'Invalid extension. Accepted image extensions: JPG, JPEG, PNG, GIF'}), 400

    # Generate Unique Image ID using actual datetime
    image_id = generate_id(image.filename)

    image.save(os.path.join(app.config['UPLOAD_FOLDER'], image_id))
    return jsonify({'msg': 'We got your image!', 'ID': image_id}), 200


@app.route('/analyze_image/<image_id>', methods=['GET'])
def analyze_image(image_id):
    try:
        folder_path = app.config['UPLOAD_FOLDER']
        image_path = f"{folder_path}/{image_id}"

        with Image.open(image_path) as img:
            width, height = img.size
            return jsonify({'msg': 'Image found!', 'height': height, 'width': width}), 200

    except IOError:
        return jsonify({'msg': f'Image not found: {image_id}'}), 404

    except Exception as e:
        return jsonify({'msg': str(e)}), 500


@app.route('/list_images', methods=['GET'])
def list_images():
    folder_path = app.config['UPLOAD_FOLDER']

    # Delete previous zip file (not really necessary)
    os.remove("images.zip")

    # Zip file Initialization
    image_zip = zipfile.ZipFile('images.zip', 'w', compression=zipfile.ZIP_STORED)

    # zip all the files which are inside in the folder
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            image_zip.write(folder_path + '/' + file)
    image_zip.close()

    # We send the binary file, so we can remove the zip file from the folder
    with open("images.zip", "rb") as f:
        file_binary = f.read()
    os.remove("images.zip")

    # send files
    try:
        return send_file(file_binary, as_attachment=True)
    except FileNotFoundError:
        abort(404)


def allowed_file(filename):
    allowedExtensions = {'jpg', 'jpeg', 'png', 'gif'}
    return get_file_extension(filename) in allowedExtensions


def generate_id(filename):
    # It will be enough with the seconds since we are uploading one image at a time
    newId = datetime.now().strftime('%Y%m%d%H%M%S')
    fileExtension = '.' + get_file_extension(filename)
    return newId + fileExtension


def get_file_extension(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower()


def remove_file_extension(filename):
    return '.'.join(filename.rsplit('.')[:-1])


if __name__ == '__main__':
    app.run()
