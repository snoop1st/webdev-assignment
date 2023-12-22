const featuresData = {
    "001": "Engine cc: 1500; Transmission: Manual; Seats: 5; Doors: 5; Fuel: Petrol; Cost: 40€/day",
    "002": "Engine cc: 2000; Transmission: Automatic; Seats: 5; Doors: 5; Fuel: Petrol; Cost: 90€/day",
    "003": "Engine cc: 4000; Transmission: Automatic; Seats: 5; Doors: 5; Fuel: Petrol; Cost: 70€/day",
    "004": "Engine cc: 1600; Transmission: Manual; Seats: 5; Doors: 3; Fuel: Petrol; Cost: 420€/day",
    "005": "Engine cc: 0; Transmission: Automatic; Seats: 5; Doors: 5; Fuel: Electric; Cost: 1€/day"
};

document.addEventListener('DOMContentLoaded', function () {
    const categoryId = getParameterByName('id');
    console.log('Selected Category ID:', categoryId);
    fetchCategoryArticles(categoryId);
});

function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function fetchCategoryArticles(categoryId) {
    console.log('Fetching articles for Category ID:', categoryId);
    const categoryFilenames = getCategoryFilenames(categoryId);
    console.log('Category Filenames:', categoryFilenames);

    if (categoryId === 'ενοικιάσεις αυτοκινήτων') {
        const categoryFilenames = getCategoryFilenames(categoryId);
        console.log('Category Filenames:', categoryFilenames);

        Promise.all(categoryFilenames.map(filename =>
            fetch(filename)
                .then(response => response.text())
                .catch(error => {
                    console.error(`Error fetching category HTML for ${filename}:`, error);
                    return null;
                })
        ))
            .then(categoryHtmls => {
                console.log('Fetched HTMLs for Category ID:', categoryId);
                displayCategoryArticles(categoryId, categoryHtmls);
                initializeImageCarousel();
            });
    } else {
        Promise.all(categoryFilenames.map(filename =>
            fetch(filename)
                .then(response => response.text())
                .catch(error => {
                    console.error(`Error fetching category HTML for ${filename}:`, error);
                    return null;
                })
        ))
            .then(categoryHtmls => {
                console.log('Fetched HTMLs for Category ID:', categoryId);
                displayCategoryArticles(categoryId, categoryHtmls);
                initializeImageCarousel();
            });
    }
}

function initializeImageCarousel() {
    const imageCarousels = document.querySelectorAll('.image-carousel');

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

function createFeaturesTable(featuresString) {
    const featuresArray = featuresString.split('; ');

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

function displayCategoryArticles(categoryId, categoryHtmls) {
    const parser = new DOMParser();
    const categoryArticles = categoryHtmls.flatMap(categoryHtml => {
        if (categoryHtml && categoryId === 'ενοικιάσεις αυτοκινήτων') {
            const categoryDoc = parser.parseFromString(categoryHtml, 'text/html');
            const articles = Array.from(categoryDoc.querySelectorAll('article'));

            articles.forEach(article => {
                const advertisementId = article.querySelector('p').textContent.trim().split(' ')[1];
                const featuresString = featuresData[advertisementId];
                const featuresTable = createFeaturesTable(featuresString);

                const featuresTablePlaceholder = article.querySelector(`#features-table-${advertisementId}`);
                featuresTablePlaceholder.appendChild(featuresTable);
            });

            return articles;
        } else if (categoryHtml) {
            const categoryDoc = parser.parseFromString(categoryHtml, 'text/html');
            return Array.from(categoryDoc.querySelectorAll('article'));
        } else {
            return [];
        }
    });

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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
