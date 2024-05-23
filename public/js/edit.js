document.querySelector('#add-img').src = 'resources/placeholder.jpg';
let isbn = document.querySelector('#isbn').value;
fetch(`/api/new-img?isbn=${isbn}`)
    .then(response => response.json())
    .then(data => {
        const bookImage = document.querySelector('#add-img');
        if (bookImage) {
            bookImage.src = data.path;
        }
    })
    .catch(error => {
        console.error('Error fetching image URL:', error);
    });




      