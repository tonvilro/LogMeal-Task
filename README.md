# LogMeal-Task
## Fullstack Programming Task LogMeal Job Position
###### by Ton Vilà Roset

Simple web application that allows users to upload images and perform basic image analysis. The application consists of two parts:

1. A front-end web page built using HTML, CSS, and JavaScript. This page provides a user-friendly interface for interacting with the image upload and analysis functionality.

2. A back-end RESTful API built using Flask and Python. The API handles image uploads, analysis, and listing, and provides a set of endpoints for the front-end to interact with.

![image](readmeHeader.png)

### Functionalities:

- The user can upload an image either from their computer or by providing a source URL.
- The user can view all the images uploaded so far and their image IDs.
- The user can view the details of the images uploaded.
- The user can delete an image.
- The user can delete all the images.
- The user can download an image.

The API will return an error message following the HTTP conventions. The error will be communicated to the user on the front-end side.


Functionalities based on the endpoints defined in web.py service:
- ***POST /upload_image*** -> Accepts image file or image url, saves the image and returns a json response with the image ID and a message. Only accepts image files with extensions JPG, JPEG, PNG, and GIF.
- ***GET /analyze_image/<image_id>*** -> Accepts image ID, returns a json response with the image height and width.
- ***GET /list_images*** -> Returns a zip response with all the images saved on the server.
- ***DELETE /delete_image/<image_id>*** -> Handles image deletion. Expects an image filename (with extension). Returns a JSON response with message on success or failure of deletion.
- ***DELETE /delete_all_images*** ->  Handles deletion of all images in the server. Expects nothing. Returns a JSON response with message on success or failure of deletion.

### How to run it:
There are a couple of ways to run it:

1. Directly running the backend service from the terminal. Go to the backend directory found in the root of the project and run the service with the following command. Once the backend service is running open the index.html file with a browser. You are all set.
```
python web.py
```
2. Running the logmeal-task container. Requires: Docker and Docker Compose installed. Copy locally the project and run in the root directory the following command. This will start two separate docker microservices, one for the frontend web page and another for the backend API. Once the container is running the backend will be running and the frontend will be available at http://localhost/.
```
docker-compose up
```

### Developing steps followed:
To develop the given task, I followed these steps:

1. Started by building the REST API. I did not have experience on Flask, but I did have experience on REST APIs. Started by defining the endpoints. Once defined I started coding each one of them. Using Postman to try on the go each on of them. The Postman collection to make test requests is available in the repository.

2. The second part of the project was to focus on the frontend. First, creating a html base layout connected with a javascript file to handle requests and define some necessary functions and parameters. Once everything was correctly connected and tested. I started giving some format to everything. Added Bootstrap to be able to add better looking components and give the page a more solid look. To be able to issue local requests CORS had to be correctly configured.

3. The last step was documenting some functions that were still not commented. Creating the containers for the two separate services and join them using a docker compose file was a bit more tedious since I had no previous experience at all. After doing my research and some problems getting Docker Desktop I was able to make it work.
   - On the way I added a couple extra functionalities like being able to download or delete an image.


Greetings!<br>
Ton
