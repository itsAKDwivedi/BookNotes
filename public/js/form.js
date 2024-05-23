(() => {
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
  
        form.classList.add('was-validated')
      }, false)
    })

    document.querySelector('#cancel-button').addEventListener('click', () => {
      window.location.href = '/';
    });

    const textarea = document.querySelector('#notes');

    document.querySelector('#boldButton').addEventListener('click', () => {
        textarea.value += '<b>Bolded Text</b>';
    });
    document.querySelector('#italicButton').addEventListener('click', () => {
      textarea.value += '<i>Italic Text</i>';
    });
    document.querySelector('#underlineButton').addEventListener('click', () => {
      textarea.value += '<u>Underlined Text</u>';
    });
    document.querySelector('#paraButton').addEventListener('click', () => {
      textarea.value += '<br><br>';
    });
    document.querySelector('#hrButton').addEventListener('click', () => {
      textarea.value += '<br><hr>';
    });

})();


document.querySelector('#add-thumbnail').addEventListener('click', function(){
  document.querySelector('#add-img').src = 'resources/placeholder.jpg';
  let isbn = document.querySelector('#isbn').value;
  console.log(isbn)
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
})