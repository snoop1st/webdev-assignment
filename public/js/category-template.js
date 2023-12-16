// category-template.js
document.addEventListener('DOMContentLoaded', function () {
    const categoryTemplateSource = document.getElementById('category-template').innerHTML;
    const categoryTemplate = Handlebars.compile(categoryTemplateSource);

    // Mock data for testing
    const categories = [
    ];

    const templateData = { categories };
    const templateHtml = categoryTemplate(templateData);

    // Append the template HTML to a container
    const templateContainer = document.getElementById('dynamic-categories');
    templateContainer.innerHTML = templateHtml;
});
