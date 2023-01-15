# LogMeal-Task
## Fullstack Programming Task LogMeal Job Position!
by Ton Vilà Roset

### Functionalities:
The task developed has the following functionalities, based on the endpoints defined in web.py:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;***GET /*** -> Returns a welcome message.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;***POST /upload_image*** -> Accepts image file or image url, saves the image and returns a json response with the image ID and a message. Only accepts image files with extensions JPG, JPEG, PNG, and GIF.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;***GET /analyze_image/<image_id>*** -> Accepts image ID, returns a json response with the image height and width.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;***GET /list_images*** -> Returns a zip response with all the images saved on the server.<br>

### How to run it:
There are a couple of ways to run it:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;***1-*** Directly running the backend service from the terminal. Go to the backend directory found in the root of the project and run web.py:
```
python web.py
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Once the backend service is running open the index.html file with a browser. You are all set.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;***2-*** Running the logmeal-task container. You will need to have Docker and Docker Compose installed. Copy locally the project and run in the root dir: 
```
docker-compose up
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Once the container is running the backend will be running the frontend will be available at http://localhost/
### Developing steps followed:
To develop the given task, I followed these steps:

Started by building the REST API. I did not have experience on Flask, but I did have experience on REST APIs. Started by defining the endpoints. Once defined I started coding each one of them. Using Postman to try on the go each on of them. The Postman collection to make test requests is available in the repository.

The second part of the project was to focus on the frontend. First, creating a html base layout connected with a javascript file to handle requests and define some necessary functions and parameters. Once everything was correctly connected and tested. I started giving some format to everything. Added Bootstrap to be able to add better looking components and give the page a more solid look. To be able to issue local requests CORS had to be correctly configured.

The last step was documenting some functions that were still not commented. Creating the containers for the two separate services and join them using a docker compose file was a bit more tedious since I had no previous experience at all. After doing my research and some problems getting Docker Desktop I was able to make it work.

On the way I added a couple extra functionalities like being able to Download or Deleting the pictures.
