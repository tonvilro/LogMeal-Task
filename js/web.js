function handleImageUpload() {
    let input = document.getElementById("upload-image");
    let image = input.files[0];

    let formData = new FormData();
    formData.append('image', image);

    fetch('http://127.0.0.1:5000/upload_image', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.msg);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

