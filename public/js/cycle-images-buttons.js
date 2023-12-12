document.addEventListener('DOMContentLoaded', function () {
    // Get all carousel containers
    const carousels = document.querySelectorAll('.image-carousel');

    // Initialize each carousel
    carousels.forEach((carousel, index) => {
        let slideIndex = 0;

        // Show the initial slide for each carousel
        showSlide(carousel, slideIndex);

        // Attach event listeners for next and previous buttons
        const prevButton = carousel.querySelector('.prev');
        const nextButton = carousel.querySelector('.next');

        prevButton.addEventListener('click', () => changeSlide(carousel, -1));
        nextButton.addEventListener('click', () => changeSlide(carousel, 1));
    });

    function changeSlide(carousel, n) {
        const images = carousel.querySelectorAll('.carousel-image');
        showSlide(carousel, (slideIndex += n));
    }

    function showSlide(carousel, index) {
        const images = carousel.querySelectorAll('.carousel-image');
        slideIndex = (index + images.length) % images.length;

        images.forEach((image, i) => {
            image.style.display = i === slideIndex ? 'block' : 'none';
        });
    }
});