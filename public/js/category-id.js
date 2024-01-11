const featuresData = {
    "001": "Engine cc: 1500; Transmission: Manual; Seats: 5; Doors: 5; Fuel: Petrol; Cost: 40€/day",
    "002": "Engine cc: 2000; Transmission: Automatic; Seats: 5; Doors: 5; Fuel: Petrol; Cost: 90€/day",
    "003": "Engine cc: 4000; Transmission: Automatic; Seats: 5; Doors: 5; Fuel: Petrol; Cost: 70€/day",
    "004": "Engine cc: 1600; Transmission: Manual; Seats: 5; Doors: 3; Fuel: Petrol; Cost: 420€/day",
    "005": "Engine cc: 0; Transmission: Automatic; Seats: 5; Doors: 5; Fuel: Electric; Cost: 1€/day"
};

// Show which category-id is loaded eg enoikiaseis-autokiniton.html
document.addEventListener('DOMContentLoaded', function () {
    const categoryId = getParameterByName('id');
    //console.log('Selected Category ID:', categoryId);
    fetchCategoryArticles(categoryId);  // Fetch articles for the selected category
});

// Function to retrieve the parameter (the category-id) from the URL
function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to fetch the articles for the selected category
function fetchCategoryArticles(categoryId) {
    //console.log('Fetching articles for Category ID:', categoryId); // Log for testing purposes
    let categoryFilenames = getCategoryFilenames(categoryId);
    //console.log('Category Filenames:', categoryFilenames); // Log for testing purposes

    // For the assignment, we only have to handle one category, in this case we did for the enoikiaseis-autokinhton
    categoryFilenames = (categoryId === 'ενοικιάσεις αυτοκινήτων') ? getCategoryFilenames(categoryId) : categoryFilenames;

    // Fetch the HTML for each category
    Promise.all(categoryFilenames.map(filename =>
        fetch(filename)
            .then(response => response.text())
            .catch(error => {   // Handle errors
                console.error(`Error fetching category HTML for ${filename}:`, error);
                return null;
            })
    ))
        .then(categoryHtmls => {
            displayCategoryArticles(categoryId, categoryHtmls); // Display the articles for the selected category
            initializeImageCarousel();  // Initialize the image carousel
        });
    
}

// Function to initialize the image carousel
function initializeImageCarousel() {
    // Get all the image carousels
    const imageCarousels = document.querySelectorAll('.image-carousel');

    // For each image carousel, initialize the carousel
    imageCarousels.forEach(carousel => {
        let slideIndex = 0;

        function changeSlide(n) {
            showSlide(slideIndex += n, carousel);
        }

        function showSlide(index, carousel) {
            const images = carousel.querySelectorAll('.carousel-image');
            slideIndex = (index + images.length) % images.length;

            images.forEach((image, i) => {
                image.style.display = i === slideIndex ? 'block' : 'none';
            });
        }

        const prevButtons = carousel.querySelectorAll('.prev');
        const nextButtons = carousel.querySelectorAll('.next');

        prevButtons.forEach(button => button.addEventListener('click', () => changeSlide(-1)));
        nextButtons.forEach(button => button.addEventListener('click', () => changeSlide(1)));

        // Initialize with the first image
        showSlide(0, carousel);
    });
}

// Function to get the category filenames for each category
function getCategoryFilenames(categoryId) {
    switch (categoryId) {
        case 'οχήματα':
            return ['car-rentals.html', 'boat-rentals.html'];
        case 'ακίνητα':
            return ['home-rentals.html', 'commercial-rentals.html'];
        case 'ενοικιάσεις αυτοκινήτων':
            return ['car-rentals.html'];
        case 'ενοικιάσεις σκαφών':
            return ['boat-rentals.html'];
        case 'ενοικιάσεις κατοικιών':
            return ['home-rentals.html'];
        case 'ενοικιάσεις επαγγελματικών χώρων':
            return ['commercial-rentals.html'];
        case null:
            // Handle null category (category.html with no id) show articles from all categories
            return ['car-rentals.html', 'boat-rentals.html', 'home-rentals.html', 'commercial-rentals.html'];
        default:
            // Handle unknown category
            return ['under-construction.html'];
    }
}

// Function to create the features table for each article, uses the table in the begginning of the file
function createFeaturesTable(featuresString) {
    const featuresArray = featuresString.split('; '); // Split the features string into an array of features
    const table = document.createElement('table');

    featuresArray.forEach((feature) => {
        const [featureName, featureValue] = feature.split(': ');

        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);

        cell1.innerHTML = featureName;
        cell2.innerHTML = featureValue;
    });

    return table;
}

// Function to display the articles for the selected category
function displayCategoryArticles(categoryId, categoryHtmls) {
    const parser = new DOMParser();
    const categoryArticles = categoryHtmls.flatMap(categoryHtml => {
        if (categoryHtml && categoryId === 'ενοικιάσεις αυτοκινήτων') {
            const categoryDoc = parser.parseFromString(categoryHtml, 'text/html');  // Parse the HTML file
            const articles = Array.from(categoryDoc.querySelectorAll('article'));   // Get all the articles

            // For each article, get the advertisement id and create the features table
            articles.forEach(article => {
                const advertisementId = article.querySelector('p').textContent.trim().split(' ')[1];
                const featuresString = featuresData[advertisementId];
                const featuresTable = createFeaturesTable(featuresString);

                const featuresTablePlaceholder = article.querySelector(`#features-table-${advertisementId}`);
                featuresTablePlaceholder.appendChild(featuresTable);
            });

            return articles;
        } else if (categoryHtml) {  // Handle all the other categories
            const categoryDoc = parser.parseFromString(categoryHtml, 'text/html');
            return Array.from(categoryDoc.querySelectorAll('article'));
        } else {
            return [];
        }
    });

    // Shuffle the articles for a more realistic result
    shuffleArray(categoryArticles);

    const rentalsSection = document.querySelector('.rentals-section');
    rentalsSection.innerHTML = '';
    // Set the category title dynamically in the <h2> element
    const categoryTitle = getCategoryTitleFromId(categoryId);
    const categoryHeader = document.createElement('h2');
    categoryHeader.textContent = categoryTitle;
    rentalsSection.appendChild(categoryHeader);

    // Set the page title dynamically
    document.title = `${categoryTitle} - Κατηγορίες`;

    categoryArticles.forEach(article => {
        rentalsSection.appendChild(article.cloneNode(true));

    });
}

// Function to get the category title from the category id, 
//could have been done better and more dynamically 
function getCategoryTitleFromId(categoryId) {
    switch (categoryId) {
        case 'οχήματα':
            return 'Ενοικιάσεις Οχημάτων';
        case 'ακίνητα':
            return 'Ενοικιάσεις Ακινήτων';
        case 'ενοικιάσεις αυτοκινήτων':
            return 'Ενοικιάσεις Αυτοκινήτων';
        case 'ενοικιάσεις σκαφών':
            return 'Ενοικιάσεις Σκαφών';
        case 'ενοικιάσεις κατοικιών':
            return 'Ενοικιάσεις Κατοικιών';
        case 'ενοικιάσεις επαγγελματικών χώρων':
            return 'Ενοικιάσεις Επαγγελματικών Χώρων';
        default:
            return;
    }
}

// Not required but it's shuffling the ads for a more realistic approach
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
