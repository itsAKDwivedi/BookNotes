document.addEventListener("DOMContentLoaded", function() {
    
    for(let i=0; i<6; i++){
        fetch(`/api/fetch-image?index=${i}`)
            .then(response => response.json())
            .then(data => {
                const bookImage = document.querySelector(`#image${i}`);
                if (bookImage) {
                    bookImage.src = data.path;
                }
            })
        .catch(error => {
            console.error('Error fetching image URL:', error);
        });
    }
});

let deleteButtons = document.querySelectorAll('.delete-button');
deleteButtons.forEach(button=>{
    button.addEventListener('click', function(event){
        event.preventDefault();
        const result = window.confirm("Alert! Notes once deleted cannot be recovered.\n Do you still want to delete?");
        if (result === true) {
            window.location.href = button.getAttribute('href');
        } else {
        }
    })
})