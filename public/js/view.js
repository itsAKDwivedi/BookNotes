
document.addEventListener("DOMContentLoaded", function() {
    
    const isbn = document.querySelector('#server-data').value;
    fetch('/api/new-img?isbn='+isbn)
        .then(response => response.json())
        .then(data => {
            const bookImage = document.querySelector('#book-cover');
            if (bookImage) {
                bookImage.src = data.path;
            }
        })
        .catch(error => {
            console.error('Error fetching image URL:', error);
        });

});