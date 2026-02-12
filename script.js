// JavaScript for Cafetería Deliciosa

document.addEventListener('DOMContentLoaded', function() {
    // Form validation and submission
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');

    // Contact form handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (validateEmail(email)) {
            // Simulate form submission
            alert('¡Gracias por tu mensaje, ' + name + '! Te responderemos pronto.');
            contactForm.reset();
        } else {
            alert('Por favor, ingresa un email válido.');
        }
    });

    // Newsletter form handler
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('newsletterEmail').value;
        
        if (validateEmail(email)) {
            alert('¡Gracias por suscribirte! Recibirás nuestras novedades pronto.');
            newsletterForm.reset();
        } else {
            alert('Por favor, ingresa un email válido.');
        }
    });

    // Email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add fade-in animation to sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Menu tabs functionality (Bootstrap handles this, but we can add custom behavior)
    const menuTabs = document.querySelectorAll('#menuTabs .nav-link');
    menuTabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            console.log('Menu section changed to: ' + e.target.id);
        });
    });

    // Gallery carousel auto-play enhancement
    const galleryCarousel = document.getElementById('galleryCarousel');
    if (galleryCarousel) {
        // Pause on hover
        galleryCarousel.addEventListener('mouseenter', function() {
            const carousel = bootstrap.Carousel.getInstance(galleryCarousel);
            carousel.pause();
        });
        
        galleryCarousel.addEventListener('mouseleave', function() {
            const carousel = bootstrap.Carousel.getInstance(galleryCarousel);
            carousel.cycle();
        });
    }

    // Lazy loading for images (basic implementation)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Add loading animation to buttons
    const buttons = document.querySelectorAll('button[type="submit"]');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.form.checkValidity()) {
                this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                this.disabled = true;

                // Simulate async operation
                setTimeout(() => {
                    this.innerHTML = 'Enviar Mensaje';
                    this.disabled = false;
                }, 2000);
            }
        });
    });

    // Order modal functionality
    const menuItems = document.querySelectorAll('.menu-item');
    const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
    const itemNameEl = document.getElementById('itemName');
    const ingredientsListEl = document.getElementById('ingredientsList');
    const sizeFieldEl = document.getElementById('sizeField');
    const submitOrderBtn = document.getElementById('submitOrder');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const name = this.dataset.name;
            const ingredients = this.dataset.ingredients;
            const price = this.dataset.price;

            itemNameEl.textContent = name;

            // Clear previous ingredients
            ingredientsListEl.innerHTML = '';

            // Add ingredients as list items
            ingredients.split(', ').forEach(ingredient => {
                const li = document.createElement('li');
                li.textContent = ingredient.trim();
                ingredientsListEl.appendChild(li);
            });

            // Show size field only for drinks (cafes)
            if (this.closest('#cafes')) {
                sizeFieldEl.style.display = 'block';
            } else {
                sizeFieldEl.style.display = 'none';
            }

            // Reset form
            document.getElementById('orderForm').reset();

            // Show modal
            orderModal.show();
        });
    });

    // Handle order submission
    submitOrderBtn.addEventListener('click', function() {
        const form = document.getElementById('orderForm');
        if (form.checkValidity()) {
            const quantity = document.getElementById('quantity').value;
            const size = document.getElementById('size').value;
            const instructions = document.getElementById('instructions').value;

            // Simulate order processing
            alert(`¡Pedido realizado!\nProducto: ${itemNameEl.textContent}\nCantidad: ${quantity}\nTamaño: ${size}\nInstrucciones: ${instructions || 'Ninguna'}`);

            // Close modal
            orderModal.hide();
        } else {
            alert('Por favor, completa todos los campos requeridos.');
        }
    });
});
