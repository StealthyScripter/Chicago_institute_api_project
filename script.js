function loadContent(page) {
    fetch(page + '.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('content-container').innerHTML = html;
      });
  }

  
async function extractAndDisplayAllData() {
  try {
      const response = await fetch("https://api.artic.edu/api/v1/artworks?page=1&limit=12");
      const data = await response.json();

      if (data && data.data && data.data.length > 0) {
          const artContainer = document.getElementById('main-art-container');
          if (artContainer) {
              data.data.forEach((artwork, index) => {
                  const image = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg`;
                  let description = artwork.description;
                  if (!description) {
                      description = `Author: ${artwork.artist_title}`;
                  } else {
                      const firstParagraph = description.split('\n\n')[0];
                      description = firstParagraph;
                  }

                  const div = document.createElement('div');
                  div.classList.add('art-framework');
                  div.innerHTML = `
                      <img src="${image}" alt="Art ${index + 1}">
                      <p>${description}</p>
                  `;
                  artContainer.appendChild(div);
              });
          } else {
              console.error('Div with id "main-art-container" not found.');
          }
      } else {
          console.error('Data is missing or incorrect:', data);
      }
  } catch(error) {
      console.error('Error fetching data:', error);
  }
}

extractAndDisplayAllData();