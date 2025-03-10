/**
 * SIRIUS COUTURE - Main JavaScript File
 * This script provides functionality for all pages of the SIRIUS COUTURE website
 */

document.addEventListener('DOMContentLoaded', function() {
    // ======== COMMON FUNCTIONALITY FOR ALL PAGES ========
    
    // Mobile Navigation Toggle
    setupMobileNavigation();
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Newsletter subscription form
    setupNewsletterForm();
    
    // Show/hide back-to-top button
    setupBackToTop();
    
    // ======== PAGE-SPECIFIC FUNCTIONALITY ========
    
    // Products page functionality
    if (document.querySelector('.product-filter')) {
        setupProductFilters();
        setupProductModals();
    }
    
    // Home page slider (if present)
    if (document.querySelector('.hero-slider')) {
        setupHeroSlider();
    }
    
    // Contact form validation (if present)
    if (document.getElementById('contact-form')) {
        setupContactForm();
    }
    
    // Events page countdown timers (if present)
    if (document.querySelector('.event-countdown')) {
        setupEventCountdowns();
    }
    
    // About page animation (if present)
    if (document.querySelector('.about-section')) {
        setupAboutAnimations();
    }
});

/**
 * Mobile Navigation Setup
 * Handles mobile menu toggle functionality
 */
function setupMobileNavigation() {
    // Create mobile menu button if it doesn't exist
    if (!document.querySelector('.mobile-menu-btn')) {
        const header = document.querySelector('header');
        const mobileBtn = document.createElement('button');
        mobileBtn.className = 'mobile-menu-btn';
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        header.appendChild(mobileBtn);
        
        // Create mobile menu container
        const nav = document.querySelector('nav');
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = nav.innerHTML;
        header.appendChild(mobileMenu);
    }
    
    // Toggle mobile menu
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            if (mobileMenu.classList.contains('active')) {
                mobileBtn.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

/**
 * Smooth Scrolling
 * Enables smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only process if it's a valid ID selector
            if (targetId !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for header height
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Newsletter Form Setup
 * Handles newsletter subscription form validation and submission
 */
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const emailValue = emailInput.value.trim();
            
            // Simple email validation
            if (emailValue === '' || !isValidEmail(emailValue)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            showMessage('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
        });
    }
}

/**
 * Back-to-Top Button
 * Adds a back-to-top button that appears when scrolling down
 */
function setupBackToTop() {
    // Create back-to-top button if it doesn't exist
    if (!document.querySelector('.back-to-top')) {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
    }
    
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Product Filters Setup
 * Handles product filtering on the collections page
 */
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productSections = document.querySelectorAll('.product-section');
    
    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Show or hide product sections based on filter
            productSections.forEach(section => {
                if (filterValue === 'all' || section.getAttribute('data-category') === filterValue) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Product Modal Setup
 * Handles product detail modal functionality
 */
function setupProductModals() {
    const modal = document.getElementById('product-modal');
    const modalDetails = document.getElementById('modal-details');
    const closeModal = document.querySelector('.close-modal');
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    
    // If modal elements don't exist, create them
    if (!modal) {
        // Create modal container
        const newModal = document.createElement('div');
        newModal.id = 'product-modal';
        newModal.className = 'modal';
        
        // Create modal content
        newModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div id="modal-details"></div>
            </div>
        `;
        
        document.body.appendChild(newModal);
    }
    
    // Get elements (might have been just created)
    const modalElement = document.getElementById('product-modal');
    const modalDetailsElement = document.getElementById('modal-details');
    const closeModalElement = document.querySelector('.close-modal');
    
    // View details button click events
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get product information from parent element
            const product = this.closest('.product-item');
            const productName = product.querySelector('h3').textContent;
            const productPrice = product.querySelector('p').textContent;
            const productImage = product.querySelector('img').src;
            const productAlt = product.querySelector('img').alt;
            
            // Populate modal with product details
            modalDetailsElement.innerHTML = `
                <div class="modal-product">
                    <div class="modal-product-image">
                        <img src="${productImage}" alt="${productAlt}" />
                    </div>
                    <div class="modal-product-info">
                        <h2>${productName}</h2>
                        <p class="price">${productPrice}</p>
                        <div class="product-description">
                            <p>Experience the perfect blend of style and comfort with this stunning piece from our collection. Crafted with premium materials and exceptional attention to detail.</p>
                        </div>
                        <div class="product-meta">
                            <div class="size-selection">
                                <h4>Size</h4>
                                <div class="size-options">
                                    <button>S</button>
                                    <button>M</button>
                                    <button>L</button>
                                    <button>XL</button>
                                </div>
                            </div>
                            <div class="quantity-selector">
                                <h4>Quantity</h4>
                                <div class="quantity-controls">
                                    <button class="quantity-decrease">-</button>
                                    <input type="number" value="1" min="1" max="10">
                                    <button class="quantity-increase">+</button>
                                </div>
                            </div>
                        </div>
                        <button class="add-to-cart-btn">Add to Cart</button>
                    </div>
                </div>
            `;
            
            // Show modal
            modalElement.style.display = 'block';
            
            // Setup quantity selectors in modal
            setupQuantitySelectors();
            
            // Setup add to cart functionality
            setupAddToCart();
        });
    });
    
    // Close modal when clicking the X
    if (closeModalElement) {
        closeModalElement.addEventListener('click', function() {
            modalElement.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === modalElement) {
            modalElement.style.display = 'none';
        }
    });
}

/**
 * Quantity Selectors Setup
 * Handles quantity increase/decrease in product modals
 */
function setupQuantitySelectors() {
    const decreaseBtn = document.querySelector('.quantity-decrease');
    const increaseBtn = document.querySelector('.quantity-increase');
    const quantityInput = document.querySelector('.quantity-controls input');
    
    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
            }
        });
        
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
        });
    }
}

/**
 * Add to Cart Setup
 * Handles add to cart functionality
 */
function setupAddToCart() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productName = document.querySelector('.modal-product-info h2').textContent;
            const quantity = document.querySelector('.quantity-controls input').value;
            
            // Save to cart (localStorage)
            addProductToCart(productName, quantity);
            
            // Close modal
            document.getElementById('product-modal').style.display = 'none';
            
            // Show success message
            showMessage(`${productName} added to cart!`, 'success');
            
            // Update cart counter
            updateCartCounter();
        });
    }
}

/**
 * Add Product to Cart
 * Adds a product to the cart in localStorage
 */
function addProductToCart(productName, quantity) {
    let cart = JSON.parse(localStorage.getItem('siriusCart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.name === productName);
    
    if (existingProductIndex > -1) {
        // Update quantity if product already exists
        cart[existingProductIndex].quantity = parseInt(cart[existingProductIndex].quantity) + parseInt(quantity);
    } else {
        // Add new product to cart
        cart.push({
            name: productName,
            quantity: parseInt(quantity)
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('siriusCart', JSON.stringify(cart));
}

/**
 * Update Cart Counter
 * Updates the cart counter in the header
 */
function updateCartCounter() {
    let cart = JSON.parse(localStorage.getItem('siriusCart')) || [];
    let totalItems = 0;
    
    // Calculate total items in cart
    cart.forEach(item => {
        totalItems += parseInt(item.quantity);
    });
    
    // Create or update cart counter
    let cartCounter = document.querySelector('.cart-counter');
    
    if (!cartCounter) {
        // Create cart icon and counter if they don't exist
        const nav = document.querySelector('nav ul');
        
        if (nav) {
            const cartItem = document.createElement('li');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <a href="#" class="cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="cart-counter">${totalItems}</span>
                </a>
            `;
            nav.appendChild(cartItem);
        }
    } else {
        // Update existing counter
        cartCounter.textContent = totalItems;
    }
}

/**
 * Home Page Hero Slider
 * Sets up the image slider on the home page
 */
function setupHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    const slides = slider.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    
    // Create navigation dots if they don't exist
    if (!dotsContainer) {
        const newDotsContainer = document.createElement('div');
        newDotsContainer.className = 'slider-dots';
        slider.appendChild(newDotsContainer);
    }
    
    // Get dots container (might have been just created)
    const dots = document.querySelector('.slider-dots');
    
    // Create dots for each slide
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = index === 0 ? 'dot active' : 'dot';
        dot.addEventListener('click', () => goToSlide(index));
        dots.appendChild(dot);
    });
    
    // Show the first slide
    showSlide(currentSlide);
    
    // Set up auto-rotation
    let slideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
    
    // Stop rotation on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    // Resume rotation on mouse leave
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    });
    
    // Create navigation arrows
    const prevButton = document.createElement('button');
    prevButton.className = 'slider-arrow prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.addEventListener('click', prevSlide);
    
    const nextButton = document.createElement('button');
    nextButton.className = 'slider-arrow next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.addEventListener('click', nextSlide);
    
    slider.appendChild(prevButton);
    slider.appendChild(nextButton);
    
    // Slider navigation functions
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.style.zIndex = '0';
        });
        
        // Show current slide
        slides[index].style.opacity = '1';
        slides[index].style.zIndex = '1';
        
        // Update dots
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }
    
    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }
    
    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }
    
    function goToSlide(index) {
        showSlide(index);
    }
}

/**
 * Contact Form Setup
 * Handles contact form validation and submission
 */
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const nameInput = this.querySelector('input[name="name"]');
            const emailInput = this.querySelector('input[name="email"]');
            const messageInput = this.querySelector('textarea[name="message"]');
            
            // Validate form inputs
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                showFormError(nameInput, 'Please enter your name');
                isValid = false;
            } else {
                clearFormError(nameInput);
            }
            
            if (!isValidEmail(emailInput.value.trim())) {
                showFormError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearFormError(emailInput);
            }
            
            if (!messageInput.value.trim()) {
                showFormError(messageInput, 'Please enter your message');
                isValid = false;
            } else {
                clearFormError(messageInput);
            }
            
            // If form is valid, submit it
            if (isValid) {
                // Simulate form submission
                showMessage('Your message has been sent! We\'ll get back to you soon.', 'success');
                contactForm.reset();
            }
        });
    }
}

/**
 * Event Countdowns Setup
 * Sets up countdown timers for upcoming events
 */
function setupEventCountdowns() {
    const countdownElements = document.querySelectorAll('.event-countdown');
    
    countdownElements.forEach(countdown => {
        const eventDate = new Date(countdown.getAttribute('data-date'));
        
        // Update the countdown every second
        const countdownInterval = setInterval(() => {
            // Get current date and time
            const now = new Date().getTime();
            
            // Find the distance between now and the event date
            const distance = eventDate - now;
            
            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Display the result
            countdown.innerHTML = `
                <div class="countdown-item"><span>${days}</span> Days</div>
                <div class="countdown-item"><span>${hours}</span> Hours</div>
                <div class="countdown-item"><span>${minutes}</span> Minutes</div>
                <div class="countdown-item"><span>${seconds}</span> Seconds</div>
            `;
            
            // If the countdown is finished, display expired message
            if (distance < 0) {
                clearInterval(countdownInterval);
                countdown.innerHTML = '<div class="event-expired">This event has already taken place</div>';
            }
        }, 1000);
    });
}

/**
 * About Page Animations
 * Sets up animations for the about page
 */
function setupAboutAnimations() {
    // Add animation classes when elements come into view
    const animatedElements = document.querySelectorAll('.about-section .animate-on-scroll');
    
    // Observe elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Start observing elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Show Message
 * Displays a temporary message to the user
 * @param {string} message - The message to display
 * @param {string} type - Message type (success, error, info)
 */
function showMessage(message, type = 'info') {
    // Remove any existing message
    const existingMessage = document.querySelector('.message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message-popup ${type}`;
    messageElement.textContent = message;
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'message-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', function() {
        messageElement.remove();
    });
    
    messageElement.appendChild(closeButton);
    document.body.appendChild(messageElement);
    
    // Automatically remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(messageElement)) {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(messageElement)) {
                    messageElement.remove();
                }
            }, 500);
        }
    }, 5000);
}

/**
 * Show Form Error
 * Displays an error message for a form input
 * @param {Element} input - The input element
 * @param {string} message - The error message
 */
function showFormError(input, message) {
    input.classList.add('error');
    
    // Remove any existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    input.parentElement.appendChild(errorElement);
}

/**
 * Clear Form Error
 * Removes error styling and messages from a form input
 * @param {Element} input - The input element
 */
function clearFormError(input) {
    input.classList.remove('error');
    
    // Remove error message
    const errorMessage = input.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Validate Email
 * Checks if an email address is valid
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}