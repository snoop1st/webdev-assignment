document.addEventListener('DOMContentLoaded', function () {
    fetchCategories();

    function fetchCategories() {
        fetch('categories.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch categories.html: ${response.status} - ${response.statusText}`);
                }
                return response.text();
            })
            .then(categoriesHtml => parseCategories(categoriesHtml))
            .catch(error => console.error(error));
    }

    function parseCategories(categoriesHtml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(categoriesHtml, 'text/html');
        const categoryElements = doc.querySelectorAll('.categories-section article');
        const categories = Array.from(categoryElements).map(categoryElement => {
            const title = categoryElement.querySelector('h3').textContent.trim();
            const image = categoryElement.querySelector('img').getAttribute('src');

            const subcategoriesElements = categoryElement.querySelectorAll('ul li');
            const subcategories = Array.from(subcategoriesElements).map(subcategoryElement => {
                const subcategoryTitle = subcategoryElement.textContent.trim();
                const subcategoryLink = subcategoryElement.querySelector('a').getAttribute('href');
                return { subcategoryTitle, subcategoryLink };
            });

            return { title, image, subcategories };
        });

        renderCategories(categories);
    }

    function renderCategories(categories) {
        const dynamicCategories = document.getElementById('dynamic-categories');
        dynamicCategories.innerHTML = '';

        categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.classList.add('categories-section');
            const categoryId = getCategoryID(category.title);

            categoryElement.innerHTML = `
                <article>
                    <h3>${category.title}</h3>
                    <a href="category.html?id=${categoryId}">
                        <img src="${category.image}" alt="${category.title}" style="width: 80px; height: 80px;">
                    </a>
                    <ul>
                        ${category.subcategories.map(subcategory => `<li><a href="${subcategory.subcategoryLink}">${subcategory.subcategoryTitle}</a></li>`).join('')}
                    </ul>
                </article>
            `;
            dynamicCategories.appendChild(categoryElement);
        });
    }

    function getCategoryID(categoryTitle) {
        // Your logic to determine category ID based on category title
        // For now, it simply converts to lowercase and adds "category-" prefix
        return categoryTitle.toLowerCase();
    }
});
