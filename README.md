# LogMeal-Task
## Fullstack Programming Task LogMeal Job Position
###### by Ton Vilà Roset

Simple web application that allows users to upload images and perform basic image analysis. The application consists of two parts:

1. A front-end web page built using HTML, CSS, and JavaScript. This page provides a user-friendly interface for interacting with the image upload and analysis functionality.

2. A back-end RESTful API built using Flask and Python. The API handles image uploads, analysis, and listing, and provides a set of endpoints for the front-end to interact with.

![image](readmeHeader.png)

### Functionalities:

List of functionalities:

- The user can upload an image either from their computer or by providing a source URL.
- The user can view all the images uploaded so far and their image IDs.
- The user can view the details of the images uploaded.
- The user can delete an image.
- The user can delete all the images.
- The user can download an image.

The API will return an error message following the HTTP conventions. The error will be communicated to the user on the front-end side.


Functionalities based on the endpoints defined in web.py service:
- ***POST /upload_image:***
   - Accepts image file or image url, saves the image and returns a json response with the image ID and a message. Only accepts image files with extensions JPG, JPEG, PNG, and GIF.
- ***GET /analyze_image/<image_id>:***
   - Accepts image ID, returns a json response with the image height and width.
- ***GET /list_images:***
   - Returns a zip response with all the images saved on the server.
- ***DELETE /delete_image/<image_id:>***
   - Handles image deletion. Expects an image filename (with extension). Returns a JSON response with message on success or failure of deletion.
- ***DELETE /delete_all_images:***
   - Handles deletion of all images in the server. Expects nothing. Returns a JSON response with message on success or failure of deletion.

### How to run it:
There are a couple of ways to run it:

1. Manual command-line execution. Navigate to the root of the project directory and run the following commands:
```
pip install -r ./backend/requirements.txt
python ./backend/web.py
```
2. Docker based execution. Requires: Docker and Docker Compose installed. Navigate to the root of the project directory and run the following command. This will start two separate docker microservices, one for the frontend web page and another for the backend API. Once the container is running the backend will be running and the frontend will be available at http://localhost/.
```
docker-compose up
```

### Developing steps followed:
To develop the given task, in general lines, I followed these steps:

1. Started by building the REST API. I did not have experience on Flask, but I did have experience on REST APIs. Started by defining the endpoints. Once defined I started coding each one of them. Using Postman to try on the go each on of them. The Postman collection to make test requests is available in the repository.

2. The second part of the project was to focus on the frontend. First, creating a html base layout connected with a javascript file to handle requests. Defined and tested some necessary functions and parameters with js. Once everything was correctly connected and tested. I started giving some format to everything. Added Bootstrap to be able to add better looking components and give the page a more solid look. To be able to issue local requests CORS had to be correctly configured.

3. The last step was documenting some functions that were still not commented. Creating the containers for the two separate services, and joining them using a docker compose file, was a bit more tedious since I had no previous experience at all with Docker. After doing my research and some problems installing Docker I was able to make it work.
   - On the way I added a couple extra functionalities like being able to download or delete an image.

4. Test and fix device compatibility. Make sure the project runs everywhere.

That's it. Greetings!<br>
Ton
