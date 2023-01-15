import os
import urllib
import zipfile
from datetime import datetime
from flask import Flask, jsonify, request, abort, send_file
from flask_cors import CORS
from PIL import Image
from urllib.request import urlretrieve

# Initialize the Flask application
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS)
cors = CORS(app)

# Set the path for saving images
app.config['UPLOAD_FOLDER'] = 'ImageDB'


@app.route('/')
def main():
    """
    Main route for the application, returns a welcome message.
    """
    return jsonify('Welcome to the Log Meal Task!')


@app.route('/upload_image', methods=['POST'])
def upload_image():
    """
    Handles image uploads.
    Expects the image file or image url to be sent in the request.
    Accepts image files with extensions JPG, JPEG, PNG, and GIF.
    Returns a json response with the image ID and a message.
    """
    if 'image' not in request.files and 'image_url' not in request.form:
        return jsonify({'msg': 'Error: No image provided'}), 400

    if 'image' in request.files:
        image = request.files['image']

        if image.filename == '':
            return jsonify({'msg': 'Error: No image sent'}), 400

        if not allowed_file(image.filename):
            return jsonify({'msg': 'Error: Invalid extension. Accepted image extensions: JPG, JPEG, PNG, GIF'}), 400

        # Generate Unique Image ID using actual datetime
        image_id = generate_id(image.filename)
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], image_id))
        return jsonify({'msg': f'We got your image!\nID: {image_id}', 'ID': image_id}), 200

    if 'image_url' in request.form:
        image_url = request.form['image_url']
        try:
            urllib.request.urlretrieve(image_url, 'temp.jpg')
            with open('temp.jpg', 'rb') as f:
                image_binary = f.read()
                if image_binary is None:
                    return jsonify({'msg': 'Error: We can not retrieve the provided url, sorry!'}), 400
            os.remove('temp.jpg')
        except:
            return jsonify({'msg': 'Error: We can not retrieve the provided url, sorry!'}), 400
        image_id = generate_id(image_url.rsplit('/', 1)[1])
        with open(os.path.join(app.config['UPLOAD_FOLDER'], image_id), 'wb') as f:
            f.write(image_binary)
        return jsonify({'msg': f'We got your image!\nID: {image_id}', 'ID': image_id}), 200


@app.route('/analyze_image/<image_id>', methods=['GET'])
def analyze_image(image_id):
    """
    Handles image analysis.
    Expects an image filename (with extension).
    Returns a json response with the image height and width.
    """
    try:
        folder_path = app.config['UPLOAD_FOLDER']
        image_path = f"{folder_path}/{image_id}"

        with Image.open(image_path) as img:
            width, height = img.size
            return jsonify({'msg': 'Image found!', 'height': height, 'width': width}), 200

    except IOError:
        return jsonify({'msg': f'Error: Image not found: {image_id}'}), 404

    except Exception as e:
        return jsonify({'msg': f'Error: {str(e)}'}), 500


@app.route('/list_images', methods=['GET'])
def list_images():
    """
    Handles image listing.
    Expects nothing.
    Returns a zip response that contains all the available images.
    """
    folder_path = app.config['UPLOAD_FOLDER']

    # Delete previous zip file (not really necessary)
    if os.path.exists('../images.zip'):
        os.remove("../images.zip")

    # Zip file Initialization
    image_zip = zipfile.ZipFile('../images.zip', 'w', compression=zipfile.ZIP_STORED)

    # zip all the files which are inside in the folder
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            image_zip.write(os.path.join(folder_path, file))
    image_zip.close()

    # send files
    try:
        return send_file('../images.zip', mimetype='zip', as_attachment=True)
    except FileNotFoundError:
        abort(404)


@app.route('/delete_image/<image_id>', methods=['DELETE'])
def delete_image(image_id):
    """
    Handles image deleting.
    Expects an image filename (with extension).
    Returns a json response indicating if there was success or not.
    """
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], image_id)
    if os.path.exists(file_path):
        os.remove(file_path)
        return jsonify({'msg': f'{image_id} was deleted successfully'}), 200
    else:
        return jsonify({'msg': f'Error: {image_id} not found'}), 404


@app.route('/delete_all_images', methods=['DELETE'])
def delete_all_images():
    """
    Handles deleting all images .
    Expects nothing.
    Returns a json response indicating if there was success or not.
    """
    image_folder = app.config['UPLOAD_FOLDER']
    image_files = [f for f in os.listdir(image_folder) if os.path.isfile(os.path.join(image_folder, f))]
    if not image_files:
        return jsonify({'msg': 'Error: No images found'}), 404
    for image_file in image_files:
        os.remove(os.path.join(image_folder, image_file))
    return jsonify({'msg': 'All images have been deleted successfully'}), 200


def allowed_file(filename):
    """
    Check if the file is an allowed image file.
    :param filename: string, name of the file
    :return: boolean, True if the file is an image, False otherwise
    """
    allowedExtensions = {'jpg', 'jpeg', 'png', 'gif'}
    return get_file_extension(filename) in allowedExtensions


def generate_id(filename):
    """
    Generate a unique id for the file.
    :param filename: string, name of the file
    :return: string, unique id for the file
    """
    # It will be enough with the seconds since we are uploading one image at a time
    newId = datetime.now().strftime('%Y%m%d%H%M%S')
    fileExtension = '.' + get_file_extension(filename)
    return newId + fileExtension


def get_file_extension(filename):
    """
    Get the file extension of the file.
    :param filename: string, name of the file
    :return: string, file extension of the file
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower()


def remove_file_extension(filename):
    """
    Remove the file extension from the file name.
    :param filename: string, name of the file
    :return: string, file name without file extension
    """
    return '.'.join(filename.rsplit('.')[:-1])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
