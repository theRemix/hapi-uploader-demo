(document => {
  const uploadForm = document.querySelector('#upload_form');
  const resultContainer = document.querySelector('#result');

  uploadForm.addEventListener('submit', e => {
    e.preventDefault();
    console.debug('Submitting Form');
    resultContainer.innerHTML = ''; // clear last submission

    const body = new FormData();
    const fileField = uploadForm.querySelector('#image_upload');

    body.append(fileField.getAttribute('name'), fileField.files[0]);

    fetch('/api/upload', {
      method: 'POST',
      body
    })
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(res => {
      const imageEl = document.createElement('img');
      imageEl.src = res.publicPath;
      resultContainer.appendChild(imageEl);

      const messageEl = document.createElement('p');
      messageEl.innerText = `${res.originalName} successfully uploaded to ${res.publicPath}`;
      resultContainer.appendChild(messageEl);
      console.debug('Done');
    });
  });

})(document);