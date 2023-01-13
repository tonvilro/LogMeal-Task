import os
from flask import Flask, jsonify, request

app = Flask(__name__)
ImageFolder = 'Images'
app.config['UPLOAD_FOLDER'] = ImageFolder


@app.route('/')
def main():
    return jsonify('Welcome to the Log Meal Task!')


# TODO: Review HTTP conventions
@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'ERROR': 'No image provided'}), 400
    image = request.files['image']

    if image.filename == '':
        return jsonify({'ERROR': 'No image sent'}), 400

    if not allowed_file(image.filename):
        return jsonify({'ERROR': 'Invalid image extension. Accepted extensions: JPG, JPEG, PNG, GIF'}), 400

    image.save(os.path.join(app.config['UPLOAD_FOLDER'], image.filename))
    return jsonify({'SUCCESS': 'We got your image!'}), 200


def allowed_file(filename):
    allowedExtensions = {'jpq', 'jpeg', 'png', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowedExtensions


if __name__ == '__main__':
    app.run()
