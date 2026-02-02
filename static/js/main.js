/**
 * Gace Builds - Main JavaScript
 * jQuery-based functionality for a professional small business website
 * 
 * Features:
 * - Mobile navigation toggle
 * - Smooth scrolling
 * - Content filtering (services, blog)
 * - Pagination
 * - Form validation
 * - FAQ accordion
 */

$(document).ready(function() {
    'use strict';

    // ========================================
    // Mobile Navigation Toggle
    // ========================================
    const $navToggle = $('#navToggle');
    const $navMenu = $('#navMenu');
    
    $navToggle.on('click', function() {
        $(this).toggleClass('active');
        $navMenu.toggleClass('active');
    });
    
    // Close menu when clicking a link
    $navMenu.find('a').on('click', function() {
        $navToggle.removeClass('active');
        $navMenu.removeClass('active');
    });
    
    // Close menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.nav').length) {
            $navToggle.removeClass('active');
            $navMenu.removeClass('active');
        }
    });

    // ========================================
    // Smooth Scrolling
    // ========================================
    $('a[href^="#"]').on('click', function(e) {
        const targetId = $(this).attr('href');
        
        if (targetId === '#') return;
        
        const $target = $(targetId);
        
        if ($target.length) {
            e.preventDefault();
            
            const headerHeight = $('#header').outerHeight() || 70;
            const targetPosition = $target.offset().top - headerHeight - 20;
            
            $('html, body').animate({
                scrollTop: targetPosition
            }, 600, 'swing');
        }
    });

    // ========================================
    // Header Scroll Effect
    // ========================================
    const $header = $('#header');
    let lastScrollTop = 0;
    
    $(window).on('scroll', function() {
        const scrollTop = $(this).scrollTop();
        
        if (scrollTop > 100) {
            $header.css('box-shadow', '0 2px 20px rgba(0, 0, 0, 0.1)');
        } else {
            $header.css('box-shadow', '0 2px 10px rgba(0, 0, 0, 0.08)');
        }
        
        lastScrollTop = scrollTop;
    });

    // ========================================
    // Content Filtering (Services & Blog)
    // ========================================
    // Services filter
    $('.services-full .filter-btn').on('click', function() {
        const filter = $(this).data('filter');
        
        // Update active button
        $('.services-full .filter-btn').removeClass('active');
        $(this).addClass('active');
        
        // Filter items
        const $services = $('.service-detail');
        
        if (filter === 'all') {
            $services.fadeIn(300);
        } else {
            $services.each(function() {
                const category = $(this).data('category');
                if (category === filter) {
                    $(this).fadeIn(300);
                } else {
                    $(this).fadeOut(300);
                }
            });
        }
    });
    
    // Blog filter
    $('.blog-filter .filter-btn').on('click', function() {
        const filter = $(this).data('filter');
        
        // Update active button
        $('.blog-filter .filter-btn').removeClass('active');
        $(this).addClass('active');
        
        // Filter items - works with both old and new class names
        const $articles = $('.blog-listing-card, .blog-card-full');
        
        if (filter === 'all') {
            $articles.fadeIn(300);
        } else {
            $articles.each(function() {
                const category = $(this).data('category');
                if (category === filter) {
                    $(this).fadeIn(300);
                } else {
                    $(this).fadeOut(300);
                }
            });
        }
        
        // Reset pagination
        currentPage = 1;
        updatePagination();
    });

    // ========================================
    // Blog Pagination
    // ========================================
    const ITEMS_PER_PAGE = 6;
    let currentPage = 1;
    
    function updatePagination() {
        // Get all articles (support both class names)
        const $allArticles = $('.blog-listing-card, .blog-card-full');
        
        // Get only visible articles (after filtering)
        const $visibleArticles = $allArticles.filter(function() {
            return $(this).css('display') !== 'none' || !$(this).data('filtered-out');
        });
        
        // Check current filter
        const activeFilter = $('.blog-filter .filter-btn.active').data('filter');
        
        let $articlesToShow;
        if (activeFilter && activeFilter !== 'all') {
            $articlesToShow = $allArticles.filter(function() {
                return $(this).data('category') === activeFilter;
            });
        } else {
            $articlesToShow = $allArticles;
        }
        
        const totalPages = Math.ceil($articlesToShow.length / ITEMS_PER_PAGE);
        
        // Hide all articles first
        $allArticles.hide();
        
        // Show articles for current page
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        
        $articlesToShow.slice(startIndex, endIndex).fadeIn(300);
        
        // Update pagination buttons
        const $pagination = $('#pagination');
        if ($pagination.length === 0) return;
        
        const $prevBtn = $pagination.find('.prev');
        const $nextBtn = $pagination.find('.next');
        const $numbers = $pagination.find('.pagination-numbers');
        
        // Show/hide pagination based on total pages
        if (totalPages <= 1) {
            $pagination.hide();
        } else {
            $pagination.show();
        }
        
        $prevBtn.prop('disabled', currentPage === 1);
        $nextBtn.prop('disabled', currentPage >= totalPages);
        
        // Update page numbers
        $numbers.empty();
        for (let i = 1; i <= totalPages; i++) {
            const $btn = $('<button>')
                .addClass('pagination-num')
                .text(i)
                .toggleClass('active', i === currentPage)
                .on('click', function() {
                    currentPage = i;
                    updatePagination();
                    scrollToSection('.blog-section');
                });
            $numbers.append($btn);
        }
    }
    
    // Pagination button handlers
    $('.pagination .prev').on('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            scrollToSection('.blog-section');
        }
    });
    
    $('.pagination .next').on('click', function() {
        const $allArticles = $('.blog-listing-card, .blog-card-full');
        const activeFilter = $('.blog-filter .filter-btn.active').data('filter');
        
        let $articlesToShow;
        if (activeFilter && activeFilter !== 'all') {
            $articlesToShow = $allArticles.filter(function() {
                return $(this).data('category') === activeFilter;
            });
        } else {
            $articlesToShow = $allArticles;
        }
        
        const totalPages = Math.ceil($articlesToShow.length / ITEMS_PER_PAGE);
        
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            scrollToSection('.blog-section');
        }
    });
    
    // Initialize pagination if on blog page
    if ($('#blogGrid').length) {
        updatePagination();
    }
    
    // Helper function to scroll to section
    function scrollToSection(selector) {
        const $target = $(selector);
        if ($target.length) {
            const headerHeight = $('#header').outerHeight() || 70;
            $('html, body').animate({
                scrollTop: $target.offset().top - headerHeight - 20
            }, 400);
        }
    }

    // ========================================
    // FAQ Accordion
    // ========================================
    $('.faq-question').on('click', function() {
        const $item = $(this).closest('.faq-item');
        const isActive = $item.hasClass('active');
        
        // Close all other items
        $('.faq-item').removeClass('active');
        
        // Toggle current item
        if (!isActive) {
            $item.addClass('active');
        }
    });

    // ========================================
    // Contact Form Validation
	// ========================================
	function showError($input, message, isNotCaptcha) {
		if (isNotCaptcha == undefined) isNotCaptcha = false;
		// Clear previous errors
		$('form').removeClass('error');
		$('.form-group').removeClass('error');
		$('.error-message').stop().hide();
		$('.success-message').stop().hide();

		const $group = $input.closest('.form-group').length ? $input.closest('.form-group') : $input.parent();
		if (isNotCaptcha == false) {
			$group.addClass('error');
		}
		// console.log('Showing error for group:', $group, 'Message:', message);
		$group.find('.error-message').text(message).show().delay(3000).fadeOut(1000, function() {
			$group.removeClass('error');
		});
	}

	function showSuccess($input, message) {
		// Clear previous errors
		$('form').removeClass('error');
		$('.form-group').removeClass('error');
		$('.error-message').stop().hide();
		$('.success-message').stop().hide();

		const $group = $input.closest('.form-group').length ? $input.closest('.form-group') : $input.parent();
		$group.addClass('success');
		// console.log('Showing success for group:', $group, 'Message:', message);
		$group.find('.success-message').text(message).show().delay(3000).fadeOut(1000, function () {
			$group.removeClass('success');
		});
	}

    const $contactForm = $('#contactForm');
    if ($contactForm.length) {
        $contactForm.on('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            $('.form-group').removeClass('error');
            $('.error-message').stop().hide();
			$('#formSuccess').stop().hide();
			$('#formError').stop().hide();
			$('.g-recaptcha > div').css({border: 'none'});
            
            let isValid = true;
            
            // Validate name
            const $name = $('#name');
            if (!$name.val().trim()) {
                showError($name, 'Please enter your name');
                isValid = false;
            } else if ($name.val().trim().length < 2) {
                showError($name, 'Name must be at least 2 characters');
                isValid = false;
            }
            
            // Validate email
            const $email = $('#email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!$email.val().trim()) {
                showError($email, 'Please enter your email');
                isValid = false;
            } else if (!emailRegex.test($email.val())) {
                showError($email, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate phone (optional but format check if provided)
            const $phone = $('#phone');
            if ($phone.val().trim()) {
                const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
                if (!phoneRegex.test($phone.val())) {
                    showError($phone, 'Please enter a valid phone number');
                    isValid = false;
                }
            }
            
            // Validate service selection
            const $service = $('#service');
            if (!$service.val()) {
                showError($service, 'Please select a service');
                isValid = false;
            }
            
            // Validate message
            const $message = $('#message');
            if (!$message.val().trim()) {
                showError($message, 'Please tell us about your project');
                isValid = false;
            } else if ($message.val().trim().length < 20) {
                showError($message, 'Please provide more details (at least 20 characters)');
                isValid = false;
            }
            
            // Validate privacy checkbox
            const $privacy = $('input[name="privacy"]');
            if (!$privacy.is(':checked')) {
                showError($privacy, 'Please agree to the privacy policy');
                isValid = false;
            }
            
			if (isValid) {
				const submitBtn = $(e.target).find('button[type="submit"]');
				submitBtn.prop('disabled', true).text('Sending Message...');
				submitQuote(e, function () {
					submitBtn.prop('disabled', false).text('Send Message');
					// Show success message (frontend only as requested)
					$('#formSuccess').fadeIn(300, function () {
						// Scroll to success message
						scrollToSection('#formSuccess');
					}).delay(3000).fadeOut(300, function () {
						scrollToSection('main');
					});
					$contactForm.hide().delay(3000).fadeIn(1000);
				}, function (message) {
					submitBtn.prop('disabled', false).text('Send Message');
					$('#formError').find('.messageError').text(message);
					$('#formError').fadeIn(300, function () {
						// Scroll to error message
						scrollToSection('#formError');
					}).delay(7000).fadeOut(300, function () {
						scrollToSection('.contact-section');
						$('.g-recaptcha > div').css({ border: 'none' });
					});
				});
            }
        });
        
        // Clear error on input
        $contactForm.find('input, select, textarea').on('input change', function() {
            $(this).closest('.form-group').removeClass('error');
            $(this).closest('.form-group').find('.error-message').hide();
        });
    }

    // ========================================
    // Newsletter Form
    // ========================================
    const $newsletterForm = $('#newsletterForm');
	if ($newsletterForm.length) {
        $newsletterForm.on('submit', function(e) {
			e.preventDefault();

			$('.g-recaptcha > div').css({ border: 'none' });
            
            const $email = $(this).find('input[type="email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test($email.val())) {
				showError($email, 'Please enter a valid email address');
                return;
            }

			const submitBtn = $(e.target).find('button[type="submit"]');
			submitBtn.prop('disabled', true).text('Sending...');
			submitQuote(e, function () {
				submitBtn.prop('disabled', false).text('Subscribe');
				showSuccess($email, 'Thank you for subscribing! We\'ll send you helpful tips for growing your business online.');
				// Show success (frontend only)
				$email.val('');
			}, function (message) {
				submitBtn.prop('disabled', false).text('Subscribe');
				showError($email, message);
				$('.g-recaptcha > div').css({ border: 'none' });
			}, function (formData) {
				$('#g-recaptcha-response').val(grecaptcha.getResponse());
				formData.append('g-recaptcha-response', grecaptcha.getResponse());
			});
        });
    }

	async function submitQuote(e, successCallback, errorCallback, optionalCallback) {
		const form = e.target;
		const formData = new FormData(form);
		formData.append('apiKey', 'sf_k265gn8mmlkg2f2ji7ghi5m9');

		if (typeof optionalCallback === 'function') {
			optionalCallback(formData);
		}

		const jsonObject = Object.fromEntries(formData.entries());
		// console.log('Form Data:', Object.fromEntries(formData.entries()));

		try {
			const response = await fetch('https://api.staticforms.dev/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(jsonObject),
			});

			const result = await response.json();
			// console.log('API Response:', result);

			if (result.success || (result.message && result.message.toLowerCase().indexOf('successfully') !== -1)) {
				successCallback();
				form.reset();
			} else {
				if (result.error && result.error.toLowerCase().indexOf('captcha verification failed') !== -1) {
					$('.g-recaptcha > div').css({ border: '1px solid #DC3545' });
				}
				errorCallback('Error: ' + result.error || 'Failed to submit the form. Please try again later.');
			}
		} catch (error) {
			errorCallback('An error occurred while submitting the form. Please try again later.');
		}
	}

    // ========================================
    // Blog Article Expand/Collapse
    // ========================================
    $('.blog-card-full h2 a').on('click', function(e) {
        e.preventDefault();
        
        const $card = $(this).closest('.blog-card-full');
        const isExpanded = $card.hasClass('expanded');
        
        if (isExpanded) {
            $card.removeClass('expanded');
        } else {
            // Collapse other expanded cards
            $('.blog-card-full').removeClass('expanded');
            $card.addClass('expanded');
            
            // Scroll to card
            const headerHeight = $('#header').outerHeight() || 70;
            $('html, body').animate({
                scrollTop: $card.offset().top - headerHeight - 20
            }, 400);
        }
    });

    // ========================================
    // Lazy Loading Images (Performance)
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        $('img[data-src]').each(function() {
            imageObserver.observe(this);
        });
    }

    // ========================================
    // Service Hash Navigation
    // ========================================
    // Handle direct links to service sections
    if (window.location.hash) {
        const hash = window.location.hash;
        const $target = $(hash);
        
        if ($target.length) {
            setTimeout(function() {
                const headerHeight = $('#header').outerHeight() || 70;
                $('html, body').animate({
                    scrollTop: $target.offset().top - headerHeight - 20
                }, 600);
            }, 100);
        }
    }

    // ========================================
    // Accessibility: Focus Management
    // ========================================
    // Skip to main content functionality
    $('body').prepend('<a href="#hero" class="sr-only" id="skipLink">Skip to main content</a>');
    
    $('#skipLink').on('focus', function() {
        $(this).removeClass('sr-only');
    }).on('blur', function() {
        $(this).addClass('sr-only');
    });

    // ========================================
    // Console Welcome Message
    // ========================================
    console.log('%cGace Builds', 'font-size: 24px; font-weight: bold; color: #0066CC;');
    console.log('%cProfessional web development for Filipino small businesses', 'font-size: 14px; color: #666;');
    console.log('%cContact us: gacebuildsapp@gmail.com', 'font-size: 12px; color: #999;');
});
