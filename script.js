const LIMIT = 2;
let page = 2;



function loadContent(page) {
    fetch(page + '.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('content-container').innerHTML = html;
        
        if (page === 'artists'){
            fetchArtist ();
            
        } else if (page === 'events') {
            fetchEvents();
        
        } else if (page === 'about') {
            document.getElementById('pageNumber').style.display = 'none';
        }

    
    });
    
  }
  
async function extractAndDisplayAllData() {
  try {
    const artContainer = document.getElementById('main-art-container');
    if (artContainer) {
        artContainer.innerHTML = '';
    } else {
        console.error('Div with id "main-art-container" not found.');
    }

      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${LIMIT}`);
      const data = await response.json();
      const displayedArtworks = new Set();
      const displayedArtworksTitle = new Set();
      console.log(displayedArtworksTitle)

      if (data && data.data && data.data.length > 0) {
          const artContainer = document.getElementById('main-art-container');
          if (artContainer) {

            let displayedCount = 0;
              data.data.forEach((artwork, index) => {
                
                if (artwork.image_id !== null && !displayedArtworks.has(artwork.id) && !displayedArtworksTitle.has(artwork.title)) {
                  displayedArtworks.add(artwork.id);
                  displayedArtworksTitle.add(artwork.title);
                  const id = artwork.id;
                  const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg`;
                  const artTitle = artwork.title;
                  const artist = artwork.artist_titles;
                  const artworkType = artwork.artwork_type_title;
                  const collection = artwork.department_title;
                  const start = artwork.date_start;
                  const end = artwork.date_end;


                  const div = document.createElement('div');
                  div.classList.add('art-framework');
                  div.innerHTML = `
                      <img src="${imageUrl}" alt="Art ${index + 1}">
                      <p style=font-style:italic;> Title: ${artTitle}</p>
                     
                      <p>Artist: ${artist} ${id}</p>
                      <p>Artwork Type: ${artworkType}</p>
                      <p>Department: ${collection}</p>
                      <p>${start} - ${end}</p>

                  `;
                  artContainer.appendChild(div);

                  displayedCount ++;

                  if (displayedCount >= LIMIT) {
                    return;
                  }

                }
              });
              if (displayedCount < LIMIT) {
                page++;
                extractAndDisplayAllData();
              }
              document.getElementById('pageNumber').style.display = 'flex';
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
              div.classList.add('container');
              div.innerHTML = `
          <img src="${artist_imageUrl}" alt="${artist_name} picture">
          <p id="artist-name">${artist_name}</p>`;
          artistContainer.appendChild(div);
          document.getElementById('pageNumber').style.display = 'none';
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


async function fetchEvents() {
    try {
        const response = await fetch("https://api.artic.edu/api/v1/events");
        const eventsData = await response.json();

        const currentDate = new Date();
        let eventsAdded = false;

        eventsData.data.forEach(single_event => {
            const event_start_date = new Date(single_event.start_date);

          if (event_start_date >= currentDate) {
            eventsAdded = true;

            const event_name = single_event.title;
            const event_description = single_event.short_description;
            const event_image = single_event.image_url;
            const event_access = single_event.buy_button_text;
            const event_access_cap = single_event.buy_button_caption;
            const event_location = single_event.location;
            const event_start_time = single_event.start_time;

            const div = document.createElement('div');
            div.classList.add('event_container');
            div.innerHTML = `
            <div>
                <h2>${event_name}</h2>
                <img src="${event_image}" alt="">
                ${event_description ? `<p>${event_description}</p>` : ''}
                ${event_start_date ? `<p>${formatDateTime(event_start_date)}  at ${event_start_time}</p>` : ''}
                ${event_location ? `<p>${event_location}</p>` : ''}
                ${event_access ? `<button  >${event_access}</button>` : ''}
            </div>
            `;
            const contentContainer = document.getElementById("content-container");
            document.getElementById('pageNumber').style.display = 'none';

            if (contentContainer) {
                contentContainer.appendChild(div);
            } else {
                console.error('Dive with id "content-container" not found.')
            }

          }
        });
        if (!eventsAdded) {
            const contentContainer = document.getElementById("content-container");
            if (contentContainer) {
                const noEventsMessage = document.createElement('div');
                noEventsMessage.classList.add('no_events_message');
                noEventsMessage.innerHTML = `<p>There No upcoming events</p>`;
                contentContainer.appendChild(noEventsMessage);
            }
        }
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    
    const options = { 
        weekday: dateTime.getDay() ? 'long' : undefined, 
        year: dateTime.getFullYear() ? 'numeric' : undefined, 
        month: dateTime.getMonth() !== null ? 'long' : undefined, 
        day: dateTime.getDate() ? 'numeric' : undefined
    };

    // Format the date and time
    return dateTime.toLocaleString(undefined, options);
}
  
  document.addEventListener('DOMContentLoaded', function() {
    extractAndDisplayAllData();
    getNumberOfPages();
});

let totalPages;
async function getNumberOfPages() {
    try {
        // Fetch data from the API with a limit of 1 to get pagination info
        const response = await fetch("https://api.artic.edu/api/v1/artworks/search?query[term][is_public_domain]=true&limit=1");
        const data = await response.json();

        if (data && data.pagination) {
            totalPages = data.pagination.total_pages;
            const totalItems = data.pagination.total;
            if (pageNumber) {
                const div = document.getElementById("pageNumber")
                div.innerHTML = `
                <button id="previous" onclick="advancePages('previous')">Previous</button>
                <p> Page: ${page} of ${totalPages}</p>
                <button id = "next" onclick="advancePages('next')">Next</button>
                `;
                if (page === 1) {
                    document.getElementById('previous').style.display = 'none';
                } else if (page === totalPages) {
                    document.getElementById('next').style.display = 'none';
                }
            }
        } else {
            console.error('Pagination information is missing:', data);
            return 0;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return 0;
    }
}
function advancePages(command) {
   if (command === "next" && page !== totalPages) {
        page ++;
        extractAndDisplayAllData();
    } else if (command === "previous" && page !== 1) {
        page --;
        extractAndDisplayAllData();
       
    }
    
}
