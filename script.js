// Define the API endpoint
const apiUrl = 'https://api.artic.edu/api/v1/artworks?fields=image_id,title,artist_display,date_display,id';

async function fetchArtworks() {
  try {
    let page = 1;
    const limit = 12; // Number of art pieces per page
    let hasMoreArtworks = true;

    while (hasMoreArtworks) {
      const response = await fetch(`${apiUrl}&page=${page}&limit=${limit}`);
      const data = await response.json();
      const artworks = data.data;

      if (artworks.length === 0) {
        hasMoreArtworks = false;
        break;
      }

      const artworksContainer = document.getElementById('artworks-container');

      artworks.forEach((artwork) => {
        const { image_id, title, artist_display, date_display } = artwork;

        if (image_id) {
          const artPiece = `
            <div class="art-piece">
              <img src="https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg" alt="${title}">
              <div class="art-description">
                <p>${title}</p>
                <p>${artist_display} | ${date_display}</p>
              </div>
            </div>
          `;
          artworksContainer.insertAdjacentHTML('beforeend', artPiece);
        }
      });

      page++;
    }
  } catch (error) {
    console.error('Error fetching artworks:', error);
  }
}
