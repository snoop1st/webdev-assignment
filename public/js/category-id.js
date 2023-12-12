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
        // Add more cases for other categories
        case null:
            // Handle null category (category.html with no id) show articles from all categories
            return ['car-rentals.html', 'boat-rentals.html', 'home-rentals.html', 'commercial-rentals.html'];
        default:
            // Handle unknown category
            return [under-construction.html];
    }
}

function displayCategoryArticles(categoryId, categoryHtmls) {
    console.log('Displaying articles for Category HTMLs:', categoryHtmls);
    const parser = new DOMParser();
    const categoryArticles = categoryHtmls.flatMap(categoryHtml => {
        if (categoryHtml) {
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
        // Add more cases for other categories
        case 'ενοικιάσεις αυτοκινήτων':
            return 'Ενοικιάσεις Αυτοκινήτων';
        case 'ενοικιάσεις σκαφών':
            return 'Ενοικιάσεις Σκαφών';
        case 'ενοικιάσεις κατοικιών':
            return 'Ενοικιάσεις Κατοικιών';
        case 'ενοικιάσεις επαγγελματικών χώρων':
            return 'Ενοικιάσεις Επαγγελματικών Χώρων';
        default:
            // Handle unknown category
            return 'Ενοικιάσεις';
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
