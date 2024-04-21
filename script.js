function loadMainContent(page) {
    fetch(page + '.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('content-container').innerHTML = html;
      });
  }

function loadContent (page) {
  loadMainContent(page);
  fetchArtist ();
        
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

async function fetchArtist () {
  try {
      const response = await fetch("https://api.artic.edu/api/v1/artists?page=1&limit=32");
      const artist = await response.json();

      const processedNames = new Set();
      artist.data.forEach(single_artist => {
      const artist_name = single_artist.title;
      if(!processedNames.has(artist_name)) {
          processedNames.add(artist_name)
      
      const artist_imageUrl = single_artist.thumbnail_url ? artist.thumbnail_url : defaultImage(artist_name);
      console.log(artist_name, artist_imageUrl);


      if (artistContainer) {
          const div = document.createElement('div');
              div.classList.add('collections');
              div.innerHTML = `
          <img src="${artist_imageUrl}" alt="${artist_name} picture">
          <p id="artist-name">${artist_name}</p>`;
          artistContainer.appendChild(div);
          } else {
          console.error('Div with id "artist Container" not found.');
          }
      }
  });

} catch(error) {
      console.error("The error is: ", error)
  }
}

function defaultImage(artistName) {

const initials = getInitials(artistName);

const {canvas, ctx } = CreateCanvasElement ();

// Draw the initials on the canvas
ctx.fillText(initials, canvas.width / 2, canvas.height / 2);
// Convert the canvas to a data URL
const imageUrl = canvas.toDataURL();
return imageUrl;

}

function getInitials(name) {
  const initials = name.match(/\b\w/g) || [];
  return (initials.shift() + (initials.pop() || '')).toUpperCase();
}

function CreateCanvasElement () {
const canvas = document.createElement('canvas');
canvas.width = 100; // Set the width of the canvas
canvas.height = 100; // Set the height of the canvas

// Get the 2D context of the canvas
const ctx = canvas.getContext('2d');

// Set the background color
ctx.fillStyle = '#f8f8f8'; // Light gray
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Set the text properties
ctx.fillStyle = '#333'; // Dark gray
ctx.font = '30px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

return { canvas, ctx};
}



  
  document.addEventListener('DOMContentLoaded', function() {
    extractAndDisplayAllData();
});

