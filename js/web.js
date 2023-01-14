
// Show available image on page load
window.onload = function() {
    displayImages();
};

function handleImageUpload() {
    let input = document.getElementById("upload-image");
    let image = input.files[0];

    let formData = new FormData();
    formData.append('image', image);

    let responseData;

    fetch('http://127.0.0.1:5000/upload_image', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Reload the page to update and reorganize gallery
        location.reload()
        // Give feedback to the user
        console.log(data.msg)
        alert(data.msg)
    })
    .catch(error => {
        alert('The server is not available. Run web.py and try again!');
    });
}

function displayImages() {
  // Make API call to retrieve image URLs
  fetch('http://127.0.0.1:5000/list_images')
    .then(response => response.blob())
    .then(blob => JSZip.loadAsync(blob))
    .then(zip => {
      // Get the image viewer element
      const imageViewer = document.getElementById('image-viewer');

      // Loop through the files in the zip
      zip.forEach(function (relativePath, zipEntry) {
        // Get the file data as a Blob
        zip.file(relativePath).async("blob").then(function (blob) {

            console.log(relativePath);

            const img = document.createElement('img');
            img.src = URL.createObjectURL(blob);
            img.classList.add("img-responsive");
            img.classList.add("img-padding"); // add padding class

            // Create View Image button
            const viewButton = document.createElement("button");
            viewButton.innerText = "View Image";
            viewButton.classList.add("btn");
            viewButton.classList.add("btn-dark");
            viewButton.addEventListener("click", function () {
                window.open(relativePath, "Image", "height=720, width=1280");
            });

            // Create View Image Details button
            const detailsButton = document.createElement("button");
            detailsButton.innerText = "View Image Details";
            detailsButton.classList.add("btn");
            detailsButton.classList.add("btn-light");
            detailsButton.addEventListener("click", function() {
                // Remove path. We just want the file name
                view_image_details(relativePath.replace(/^.*[\\\/]/, ''));
            });

            // Create Delete Image button
            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.classList.add("btn");
            deleteButton.classList.add("btn-danger");
            deleteButton.addEventListener("click", function() {
                // Remove path. We just want the file name
                delete_image(relativePath.replace(/^.*[\\\/]/, ''));
            });

            const div = document.createElement("div");
            div.appendChild(img);
            div.appendChild(viewButton);
            div.appendChild(detailsButton);
            div.appendChild(deleteButton);
            div.classList.add("text-center"); // center the button
            imageViewer.appendChild(div);
        });
      });
    })
    .catch(error => {
        alert('The server is not available. Run web.py and try again!');
    });
}

function view_image_details(filename) {
    const windowSizeX = 480;
    const windowSizeY = 220;
    const leftW = (screen.width / 2) - (windowSizeX / 2);
    const topW = (screen.height / 2) - (windowSizeY / 2);
    const newWindow = window.open('', "Image Details", `left=${leftW},top=${topW}, height=${windowSizeY}, width=${windowSizeX}`);
    fetch(`http://127.0.0.1:5000/analyze_image/${filename}`)
        .then(response => response.json())
        .then(data => {

            let noExtensionFilename = filename.replace(/\.[^/.]+$/, "")

            let content = `<!DOCTYPE html>
                            <html lang="en">
                                <head>
                                    <meta charset="UTF-8" />
                                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                    <link rel="icon" href="img/webLogo.png">
                                    <title>Image Details</title>
                                    <!-- Bootstrap -->
                                    <link rel="stylesheet" href="css/bootstrap.min.css">
                                </head>
                                
                                <body style="width: 50%; margin: 0 auto;">
                                    <div class="hero-unit" style="padding-bottom: 20px; padding-top: 10px">
                                        <h1 style="justify-content: center">Image Details</h1>
                                    </div>
                                    <p style="justify-content: center">Image ID: ${noExtensionFilename}</p>
                                    <p style="justify-content: center">Height: ${data.height}px</p>
                                    <p style="justify-content: center">Width: ${data.width}px</p>
                                </body>
                            </html>`
            newWindow.document.write(content);
        })
        .catch(error => {
        alert('The server is not available. Run web.py and try again!');
    });
}

function delete_image(filename) {
    fetch(`http://127.0.0.1:5000/delete_image/${filename}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        // Reload the page to update and reorganize gallery
        location.reload()

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

function refresh_page() {
    location.reload();
}