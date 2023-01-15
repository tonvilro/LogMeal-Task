// Configuration imported through HTML


// Show available images on page load
window.onload = function() {
    displayImages();
};


/**
 * handleImageUpload - function to handle image upload
 *
 * @returns {undefined}
 */
function handleImageUpload() {
    // Get the input element with the ID "upload-image"
    let input = document.getElementById("upload-image");
    // Get the first file in the input
    let image = input.files[0];
    // Get the value of the element with the ID "upload-image-url"
    let imageUrl = document.getElementById("upload-image-url").value;

    // Create a new FormData object
    let formData = new FormData();
    if (imageUrl) {
        // If an image URL is provided, append it to the form data
        formData.append('image_url', imageUrl);
    } else {
        // If no image URL is provided, append the image file to the form data
        formData.append('image', image);
    }

    // Send a POST request to the backend with the form data
    fetch(`${backendUrl}/upload_image`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Reload the page to update and reorganize gallery
        refresh_page()
        // Give feedback to the user
        console.log(data.msg)
        alert(data.msg)
    })
    .catch(error => {
        alert('The server is not available. Run web.py and try again!');
    });
}


/**
 * displayImages - function to display images on the page
 *
 * @returns {undefined}
 */
function displayImages() {
  // Make API call to retrieve image URLs
  fetch(`${backendUrl}/list_images`)
    .then(response => response.blob())
    .then(blob => JSZip.loadAsync(blob))
    .then(zip => {
      // Get the image viewer element
      const imageViewer = document.getElementById('image-viewer');

      // Loop through the files in the zip
      zip.forEach(function (relativePath, zipEntry) {
        // Get the file data as a Blob
        zip.file(relativePath).async("blob").then(function (blob) {

            // Get Image ID without path
            let imageID = relativePath.replace(/^.*[\\\/]/, '');

            // Create an image element
            const img = document.createElement('img');
            // Set the source of the image to the blob URL
            img.src = URL.createObjectURL(blob);
            // Add responsive and padding class to the image
            img.classList.add("img-responsive");
            img.classList.add("img-padding");

            // Create a text element to display the image ID
            const ImageIdText = document.createElement("p");
            // Show ID without extension
            ImageIdText.innerText = "Image ID: " + remove_file_extension(imageID);
            // Add class to the text element
            ImageIdText.classList.add("img-id-text");

            // Create View Image Details button
            const detailsButton = document.createElement("button");
            detailsButton.innerText = "View Image Details";
            detailsButton.classList.add("btn");
            detailsButton.classList.add("btn-light");
            // Add click event listener to button
            detailsButton.addEventListener("click", function() {
                view_image_details(imageID);
            });

            // Create Delete Image button
            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.classList.add("btn");
            deleteButton.classList.add("btn-danger");
            // Add click event listener to button
            deleteButton.addEventListener("click", function() {
                delete_image(imageID);
            });

            // Create a div element to hold the image, text and buttons
            const div = document.createElement("div");
            // Append the image, text and buttons to the div
            div.appendChild(img);
            div.appendChild(ImageIdText);
            div.appendChild(detailsButton);
            div.appendChild(deleteButton);
            // Add class to center the div
            div.classList.add("text-center");
            // Append the div to the image viewer element
            imageViewer.appendChild(div);
        });
      });
    })
    .catch(error => {
        alert('The server is not available. Run web.py and try again!');
    });
}


/**
 * view_image_details - function to display image details in a new window
 *
 * @param {string} filename - the name of the image file
 * @returns {undefined}
 */
function view_image_details(filename) {
    // Set the size and position of the new window
    const windowSizeX = 480;
    const windowSizeY = 250;
    const leftW = (screen.width / 2) - (windowSizeX / 2);
    const topW = (screen.height / 2) - (windowSizeY / 2);
    // Open a new window
    const newWindow = window.open('', "Image Details", `left=${leftW},top=${topW}, height=${windowSizeY}, width=${windowSizeX}`);
    // Make an API call to retrieve the image details
    fetch(`${backendUrl}/analyze_image/${filename}`)
        .then(response => response.json())
        .then(data => {

            // Get the image filename without the extension
            let noExtensionFilename = remove_file_extension(filename)
            // Get the image file extension
            let extension = get_file_extension(filename)

            // Create the content of the new window
            let content = `<!DOCTYPE html>
                            <html lang="en">
                                <head>
                                    <meta charset="UTF-8" />
                                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                    <link rel="icon" href="img/webLogo.png">
                                    <title>Image Details</title>
                                    <!-- Bootstrap CSS -->
                                    <link rel="stylesheet" href="css/bootstrap.min.css">
                                </head>
                                
                                <body style="width: 50%; margin: 0 auto; background-color: #FDF4ED">
                                    <div class="hero-unit" style="padding-bottom: 20px; padding-top: 10px">
                                        <h1 style="justify-content: center">Image Details</h1>
                                    </div>
                                    <p style="justify-content: center">Image ID: ${noExtensionFilename}</p>
                                    <p style="justify-content: center">Height: ${data.height}px</p>
                                    <p style="justify-content: center">Width: ${data.width}px</p>
                                    <p style="justify-content: center">Type: ${extension}</p>
                                </body>
                            </html>`
            // Write the content to the new window
            newWindow.document.write(content);
        })
        .catch(error => {
        alert('The server is not available. Run web.py and try again!');
    });
}


/**
 * delete_image - function to delete an image
 *
 * @param {string} filename - the name of the image file
 * @returns {undefined}
 */
function delete_image(filename) {
    // Make a DELETE request to the server to delete the image
    fetch(`${backendUrl}/delete_image/${filename}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        // Reload the page to update and reorganize gallery
        refresh_page()

        if (data.error) {
            alert(data.msg);
        } else {
            alert(data.msg);
        }
    })
    .catch(error => {
        alert('The server is not available. Run web.py and try again!');
    });
}


/**
 * deleteAllImages - function to delete all images
 *
 * @returns {undefined}
 */
function deleteAllImages() {
    // Make a DELETE request to the server to delete all images
    fetch(`${backendUrl}/delete_all_images`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        // Reload the page to update and reorganize gallery
        refresh_page()
        // log the response message in the console
        console.log(data.msg)
        // alert the response message
        alert(data.msg)
    })
    .catch(error => {
        alert('The server is not available. Run web.py and try again!');
    });
}

/**
 * remove_file_extension - function to remove the file extension from a filename
 *
 * @param {string} filename - the name of the file
 * @returns {string} - the filename without the extension
 */
function remove_file_extension(filename) {
    return filename.replace(/\.[^/.]+$/, "");
}


/**
 * get_file_extension - function to get the file extension from a filename
 *
 * @param {string} filename - the name of the file
 * @returns {string} - the file extension in uppercase
 */
function get_file_extension(filename) {
    let extension = filename.split('.').pop();
    return extension.toUpperCase();
}


/**
 * refresh_page - function to refresh the current page
 *
 * @returns {undefined}
 */
function refresh_page() {
    location.reload();
}