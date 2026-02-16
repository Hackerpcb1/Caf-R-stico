// JavaScript for Cafetería Deliciosa

document.addEventListener('DOMContentLoaded', function() {
    // Form validation and submission
    const contactForm = document.getElementById('contactForm');

    // Contact form handler
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (validateEmail(email)) {
                alert('¡Gracias por tu mensaje, ' + name + '! Te responderemos pronto.');
                contactForm.reset();
            } else {
                alert('Por favor, ingresa un email válido.');
            }
        });
    }

    // Email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Real-time status checker
    function checkOpenStatus() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = hours + minutes / 60; // Convert to decimal hours

        // Business hours: Monday (1) to Saturday (6), 6:00 AM - 1:00 PM
        const openTime = 6; // 6:00 AM
        const closeTime = 13; // 1:00 PM
        const isWeekday = day >= 1 && day <= 6; // Monday to Saturday
        const isWithinHours = currentTime >= openTime && currentTime < closeTime;

        // Update both status indicators
        const statusBadges = [
            document.querySelector('#openStatus'),
            document.querySelector('#heroStatus .status-badge')
        ];

        statusBadges.forEach(statusBadge => {
            if (!statusBadge) return;

            const statusText = statusBadge.querySelector('.status-text');
            if (!statusText) return;

            if (isWeekday && isWithinHours) {
                // OPEN
                statusBadge.className = 'status-badge open';
                statusText.textContent = 'Abierto Ahora';
            } else {
                // CLOSED
                statusBadge.className = 'status-badge closed';

                // Calculate next opening time
                let nextOpenMessage = '';
                if (day === 0) {
                    // Sunday - opens Monday
                    nextOpenMessage = 'Abre lunes 6:00 AM';
                } else if (day === 6 && currentTime >= closeTime) {
                    // Saturday after closing - opens Monday
                    nextOpenMessage = 'Abre lunes 6:00 AM';
                } else if (isWeekday && currentTime < openTime) {
                    // Before opening today
                    nextOpenMessage = 'Abre hoy 6:00 AM';
                } else if (isWeekday && currentTime >= closeTime) {
                    // After closing today
                    nextOpenMessage = 'Abre mañana 6:00 AM';
                }

                statusText.textContent = `Cerrado • ${nextOpenMessage}`;
            }
        });
    }

    // Check status immediately and every minute
    checkOpenStatus();
    setInterval(checkOpenStatus, 60000); // Update every minute

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

    // Add loading animation to contact form submit button only
    const contactSubmitBtn = document.querySelector('#contactForm button[type="submit"]');
    if (contactSubmitBtn) {
        contactSubmitBtn.addEventListener('click', function() {
            if (this.form && this.form.checkValidity()) {
                this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                this.disabled = true;

                // Simulate async operation
                setTimeout(() => {
                    this.innerHTML = 'Enviar Mensaje';
                    this.disabled = false;
                }, 2000);
            }
        });
    }

    // Order modal functionality
    const menuItems = document.querySelectorAll('.menu-item');
    const orderModalEl = document.getElementById('orderModal');
    const itemNameEl = document.getElementById('itemName');
    const ingredientsListEl = document.getElementById('ingredientsList');
    const sizeFieldEl = document.getElementById('sizeField');
    const submitOrderBtn = document.getElementById('submitOrder');

    console.log('Order modal element:', orderModalEl);
    console.log('Menu items found:', menuItems.length);

    if (!orderModalEl) {
        console.error('Order modal not found!');
        return;
    }

    const orderModal = new bootstrap.Modal(orderModalEl);

    // Function to open order modal with product info
    function openOrderModal(menuItem) {
        const name = menuItem.dataset.name;
        const ingredients = menuItem.dataset.ingredients;
        const price = menuItem.dataset.price;

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
        if (menuItem.closest('#cafes')) {
            sizeFieldEl.style.display = 'block';
        } else {
            sizeFieldEl.style.display = 'none';
        }

        // Reset form
        document.getElementById('orderForm').reset();

        // Show modal
        orderModal.show();
    }

    // Handle click on "Pedir" buttons
    const orderButtons = document.querySelectorAll('.menu-item .btn-primary');
    console.log('Found order buttons:', orderButtons.length);
    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            console.log('Button clicked!');
            const menuItem = this.closest('.menu-item');
            if (menuItem) {
                console.log('Opening modal for:', menuItem.dataset.name);
                openOrderModal(menuItem);
            }
        });
    });

    // Keep the original card click functionality (optional)
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Only trigger if not clicking on the button
            if (!e.target.closest('.btn-primary')) {
                openOrderModal(this);
            }
        });
    });

    // Handle order submission
    if (submitOrderBtn) {
        submitOrderBtn.addEventListener('click', function() {
            const form = document.getElementById('orderForm');
            if (form && form.checkValidity()) {
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
    }
});
