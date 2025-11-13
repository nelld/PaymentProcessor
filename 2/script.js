// Announce to screen readers via live region
function announce(message) {
    const liveRegion = document.getElementById('liveRegion');
    if (liveRegion) {
        liveRegion.textContent = message;
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// Card number formatting with validation
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formattedValue;
    
    // Detect card type and show icon
    detectCardType(value);
    
    // Validate card number
    if (value.length >= 13) {
        validateCardNumber(input, value);
    }
}

// Detect card type based on number
function detectCardType(number) {
    const cardTypeIcon = document.getElementById('cardTypeIcon');
    
    // Card type patterns
    const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
        discover: /^6(?:011|5)/,
        diners: /^3(?:0[0-5]|[68])/,
        jcb: /^35/
    };
    
    let cardType = null;
    for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(number)) {
            cardType = type;
            break;
        }
    }
    
    // Display card icon
    if (cardType) {
        const icons = {
            visa: `<svg width="32" height="10" viewBox="0 0 32 10"><path fill="#1434CB" d="M13.3.4l-2.2 9.1h-2.2L11.1.4h2.2zm8.8 5.9l1.2-3.2.7 3.2h-1.9zm2.5 3.2h2l-1.8-9.1h-1.8c-.4 0-.8.2-.9.6l-3.2 8.5h2.3l.5-1.3h2.9v1.3zM9.6 3.8c0-.2.2-.3.6-.3.6 0 1.4.2 2 .5l.3-1.9c-.7-.2-1.4-.4-2.2-.4-2.3 0-3.9 1.2-3.9 2.9 0 1.3 1.1 2 2 2.4.9.5 1.2.8 1.2 1.2 0 .6-.7.9-1.4.9-.9 0-1.8-.2-2.6-.6l-.4 2c.6.3 1.6.5 2.7.5 2.5 0 4-1.2 4-3 0-2.3-3.3-2.4-3.3-3.4zM32 .4l-3.4 9.1h-2.3l1.7-4.5-1.5-4.1c-.1-.3-.4-.5-.8-.5h-3.9l-.1.3c.8.2 1.7.5 2.2.8.3.2.4.4.5.8L27.1 9.5h2.3L32 .4z"/></svg>`,
            mastercard: `<svg width="32" height="20" viewBox="0 0 32 20"><circle cx="11" cy="10" r="9" fill="#EB001B"/><circle cx="21" cy="10" r="9" fill="#F79E1B"/><path d="M16 4.686c1.434 1.342 2.333 3.25 2.333 5.364 0 2.114-.9 4.022-2.333 5.364A7.43 7.43 0 0 1 13.667 10c0-2.114.9-4.022 2.333-5.364z" fill="#FF5F00"/></svg>`,
            amex: `<svg width="32" height="20" viewBox="0 0 32 20"><rect width="32" height="20" rx="2" fill="#006FCF"/><text x="16" y="14" text-anchor="middle" fill="white" font-size="8" font-weight="bold" font-family="Inter, sans-serif">AMEX</text></svg>`,
            discover: `<svg width="32" height="20" viewBox="0 0 32 20"><rect width="32" height="20" rx="2" fill="#FF6000"/><circle cx="24" cy="10" r="8" fill="#FFA500"/></svg>`
        };
        
        cardTypeIcon.innerHTML = icons[cardType] || '';
    } else {
        cardTypeIcon.innerHTML = '';
    }
}

// Luhn algorithm for card validation
function validateCardNumber(input, number) {
    let sum = 0;
    let isEven = false;
    
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i));
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    const isValid = (sum % 10) === 0;
    
    if (isValid) {
        input.style.borderColor = '#10b981';
    } else if (number.length >= 16) {
        input.style.borderColor = '#ef4444';
    }
}

// Format expiry date
function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    input.value = value;
    
    // Validate expiry
    if (value.length === 5) {
        validateExpiry(input, value);
    }
}

// Validate expiry date
function validateExpiry(input, value) {
    const [month, year] = value.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    let isValid = true;
    
    if (monthNum < 1 || monthNum > 12) {
        isValid = false;
    } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        isValid = false;
    }
    
    input.style.borderColor = isValid ? '#10b981' : '#ef4444';
}

// Format CVV
function formatCVV(input) {
    input.value = input.value.replace(/\D/g, '');
}

// Format CVV for saved cards with validation
function formatSavedCardCVV(input) {
    input.value = input.value.replace(/\D/g, '');
    
    // Visual feedback for CVV
    if (input.value.length >= 3) {
        input.style.borderColor = '#10b981';
    } else {
        input.style.borderColor = '';
    }
}

// Handle card selection - show/hide CVV fields
function handleCardSelection() {
    const selectedCard = document.querySelector('input[name="payment-method"]:checked');
    const allCVVWrappers = document.querySelectorAll('.cvv-input-wrapper');
    
    // Hide all CVV fields first
    allCVVWrappers.forEach(wrapper => {
        wrapper.classList.remove('active');
    });
    
    // Show CVV field for selected card
    if (selectedCard) {
        const cardValue = selectedCard.value;
        const cvvWrapper = document.getElementById(`cvv-${cardValue}`);
        if (cvvWrapper) {
            cvvWrapper.classList.add('active');
            // Focus on CVV input after a short delay for animation
            setTimeout(() => {
                const cvvInput = cvvWrapper.querySelector('.cvv-input');
                if (cvvInput) {
                    cvvInput.focus();
                }
            }, 300);
        }
        
        // Keep selected item visible when collapsed
        const selectedWrapper = selectedCard.closest('.saved-card-wrapper');
        if (selectedWrapper) {
            keepSelectedVisible(selectedWrapper);
        }
    }
    
    // Auto-collapse the list after selection
    collapsePaymentList();
}

// Handle payment selection (for non-card methods)
function handlePaymentSelection() {
    // For non-card payment methods (bank accounts)
    // No CVV needed, just selection is enough
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
    
    // Hide all CVV fields when non-card method is selected
    const allCVVWrappers = document.querySelectorAll('.cvv-input-wrapper');
    allCVVWrappers.forEach(wrapper => {
        wrapper.classList.remove('active');
    });
    
    // Keep selected item visible when collapsed
    if (selectedMethod) {
        const selectedWrapper = selectedMethod.closest('.saved-payment-wrapper');
        if (selectedWrapper) {
            keepSelectedVisible(selectedWrapper);
        }
    }
    
    // Auto-collapse the list after selection
    collapsePaymentList();
}

// Toggle add payment method section
function toggleAddPaymentSection() {
    const section = document.getElementById('addPaymentSection');
    const button = document.getElementById('addPaymentBtn');
    const btnText = button.querySelector('.btn-text');
    const addIcon = button.querySelector('.add-icon');
    const closeIcon = button.querySelector('.close-icon');
    
    const isActive = section.classList.toggle('active');
    
    if (isActive) {
        // When expanded
        btnText.textContent = 'Hide Options';
        addIcon.style.display = 'none';
        closeIcon.style.display = 'block';
        button.setAttribute('aria-expanded', 'true');
    } else {
        // When collapsed
        btnText.textContent = 'Add Payment Method';
        addIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        button.setAttribute('aria-expanded', 'false');
    }
}

// Add payment method based on type
function addPaymentMethod(type) {
    console.log('Adding payment method:', type);
    
    // Close the section
    const section = document.getElementById('addPaymentSection');
    if (section) {
        section.classList.remove('active');
    }
    
    // Handle based on type
    switch(type) {
        case 'credit':
            toggleNewCardForm('credit');
            break;
        case 'debit':
            toggleNewCardForm('debit');
            break;
        case 'card':
            toggleNewCardForm('credit');
            break;
        case 'bank':
            toggleNewBankForm();
            break;
        case 'link':
            showNotification('Setup Link - Coming soon');
            break;
        case 'bancontact':
            showNotification('Add Bancontact - Coming soon');
            break;
        case 'sofort':
            showNotification('Add Sofort - Coming soon');
            break;
        default:
            showNotification('Payment method setup - Coming soon');
    }
}

// Show payment options menu (for all payment types)
function showPaymentOptions(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const menu = document.getElementById('cardOptionsMenu');
    const button = event.currentTarget;
    
    // Store the payment item element for later use
    currentCardElement = button.closest('.saved-payment-item') || button.closest('.saved-card-wrapper');
    
    // Close menu if already open
    if (menu.classList.contains('active')) {
        closeCardOptionsMenu();
        return;
    }
    
    // Position the menu relative to the button
    const buttonRect = button.getBoundingClientRect();
    const menuWidth = 200;
    
    let left = buttonRect.left - menuWidth + 10;
    let top = buttonRect.bottom + 5;
    
    if (left < 10) {
        left = buttonRect.right - 10;
    }
    
    if (top + 200 > window.innerHeight) {
        top = buttonRect.top - 180;
    }
    
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.classList.add('active');
    
    setTimeout(() => {
        document.addEventListener('click', handleClickOutsideMenu);
    }, 0);
}

// Toggle order summary (mobile)
function toggleSummary() {
    const summary = document.querySelector('.order-summary');
    const header = document.querySelector('.summary-header');
    const isCollapsed = summary.classList.toggle('collapsed');
    
    // Update aria-expanded for accessibility
    header.setAttribute('aria-expanded', !isCollapsed);
}

// Toggle show more cards
function toggleShowMoreCards() {
    const hiddenCards = document.querySelectorAll('.saved-card-wrapper.hidden-card');
    const button = document.getElementById('showMoreCardsBtn');
    const buttonText = document.getElementById('showMoreText');
    const isExpanded = button.classList.contains('expanded');
    
    if (isExpanded) {
        // Collapse - hide cards
        hiddenCards.forEach(card => {
            card.classList.remove('show');
        });
        button.classList.remove('expanded');
        buttonText.textContent = `Show all cards (${hiddenCards.length})`;
    } else {
        // Expand - show cards
        hiddenCards.forEach(card => {
            card.classList.add('show');
        });
        button.classList.add('expanded');
        buttonText.textContent = 'Show default only';
    }
}

// Toggle show more payment methods (unified list)
function toggleShowMorePayments() {
    const hiddenMethods = document.querySelectorAll('.saved-payment-wrapper.hidden-method, .saved-card-wrapper.hidden-card');
    const button = document.getElementById('showMoreCardsBtn');
    const buttonText = document.getElementById('showMoreText');
    const isExpanded = button.classList.contains('expanded');
    
    if (isExpanded) {
        // Collapse - hide payment methods
        hiddenMethods.forEach(method => {
            method.classList.remove('show');
        });
        button.classList.remove('expanded');
        button.setAttribute('aria-expanded', 'false');
        buttonText.textContent = `Show all payment methods (${hiddenMethods.length})`;
        announce(`${hiddenMethods.length} payment methods hidden`);
    } else {
        // Expand - show payment methods
        hiddenMethods.forEach(method => {
            method.classList.add('show');
        });
        button.classList.add('expanded');
        button.setAttribute('aria-expanded', 'true');
        buttonText.textContent = 'Show less';
        announce(`${hiddenMethods.length} additional payment methods shown`);
        
        // Focus the currently selected payment method for keyboard navigation
        setTimeout(() => {
            const selectedRadio = document.querySelector('input[name="payment-method"]:checked');
            if (selectedRadio) {
                selectedRadio.focus();
            }
        }, 100);
    }
}

// Keep selected payment method visible after collapse
function keepSelectedVisible(selectedWrapper) {
    // Move selected item to the top of the list
    const parentList = selectedWrapper.parentElement;
    if (parentList) {
        parentList.prepend(selectedWrapper);
    }
    
    // First, hide ALL payment methods (mark them all as hidden)
    const allCards = document.querySelectorAll('.saved-card-wrapper');
    const allPayments = document.querySelectorAll('.saved-payment-wrapper');
    
    allCards.forEach(card => {
        if (!card.classList.contains('hidden-card')) {
            card.classList.add('hidden-card');
        }
    });
    
    allPayments.forEach(payment => {
        if (!payment.classList.contains('hidden-method')) {
            payment.classList.add('hidden-method');
        }
    });
    
    // Then, make ONLY the selected item visible
    selectedWrapper.classList.remove('hidden-method', 'hidden-card');
    
    // Update count in button
    updateShowMoreButtonCount();
}

// Update the "Show more" button count
function updateShowMoreButtonCount() {
    const hiddenMethods = document.querySelectorAll('.saved-payment-wrapper.hidden-method, .saved-card-wrapper.hidden-card');
    const buttonText = document.getElementById('showMoreText');
    if (buttonText && hiddenMethods.length > 0) {
        buttonText.textContent = `Show all payment methods (${hiddenMethods.length})`;
    }
}

// Collapse payment list (helper function for auto-collapse)
function collapsePaymentList() {
    const button = document.getElementById('showMoreCardsBtn');
    const isExpanded = button && button.classList.contains('expanded');
    
    if (isExpanded) {
        // Only collapse if currently expanded
        const hiddenMethods = document.querySelectorAll('.saved-payment-wrapper.hidden-method, .saved-card-wrapper.hidden-card');
        const buttonText = document.getElementById('showMoreText');
        
        hiddenMethods.forEach(method => {
            method.classList.remove('show');
        });
        button.classList.remove('expanded');
        
        // Update button text with current count
        updateShowMoreButtonCount();
    }
}

// Toggle new card form
function toggleNewCardForm(cardType = 'credit') {
    const section = document.getElementById('newCardSection');
    const isActive = section.classList.contains('active');
    
    if (isActive) {
        section.classList.remove('active');
        
        // Show payment options again when closing the form
        const paymentSection = document.getElementById('addPaymentSection');
        if (paymentSection && !paymentSection.classList.contains('active')) {
            paymentSection.classList.add('active');
        }
        
        // Scroll to payment options section
        setTimeout(() => {
            const addPaymentBtn = document.querySelector('.add-payment-btn');
            if (addPaymentBtn) {
                addPaymentBtn.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    } else {
        section.classList.add('active');
        
        // Set the card type in hidden field
        const cardTypeInput = document.getElementById('cardType');
        if (cardTypeInput) {
            cardTypeInput.value = cardType;
        }
        
        // Update form title
        const formTitle = document.getElementById('cardFormTitle');
        if (formTitle) {
            formTitle.textContent = cardType === 'debit' ? 'Add New Debit Card' : 'Add New Credit Card';
        }
        
        // Scroll to form
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        // Focus on card number input after animation
        setTimeout(() => {
            document.getElementById('cardNumber').focus();
        }, 400);
    }
}

// Toggle new bank account form
function toggleNewBankForm() {
    const section = document.getElementById('newBankSection');
    const isActive = section.classList.contains('active');
    
    if (isActive) {
        section.classList.remove('active');
        
        // Show payment options again when closing the form
        const paymentSection = document.getElementById('addPaymentSection');
        if (paymentSection && !paymentSection.classList.contains('active')) {
            paymentSection.classList.add('active');
        }
        
        // Scroll to payment options section
        setTimeout(() => {
            const addPaymentBtn = document.querySelector('.add-payment-btn');
            if (addPaymentBtn) {
                addPaymentBtn.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    } else {
        section.classList.add('active');
        
        // Scroll to form
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        // Focus on account holder name input after animation
        setTimeout(() => {
            document.getElementById('accountHolderName').focus();
        }, 400);
    }
}

// Global variable to track current card being acted upon
let currentCardElement = null;

// Show card options menu
function showCardOptions(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const menu = document.getElementById('cardOptionsMenu');
    const button = event.currentTarget;
    
    // Store the card wrapper element for later use
    currentCardElement = button.closest('.saved-card-wrapper');
    
    // Close menu if already open
    if (menu.classList.contains('active')) {
        closeCardOptionsMenu();
        return;
    }
    
    // Position the menu relative to the button
    const buttonRect = button.getBoundingClientRect();
    const menuWidth = 200; // Approximate menu width
    
    // Position to the left of the button by default
    let left = buttonRect.left - menuWidth + 10;
    let top = buttonRect.bottom + 5;
    
    // If menu would go off left edge of screen, show on right side
    if (left < 10) {
        left = buttonRect.right - 10;
    }
    
    // If menu would go off bottom of viewport, show above button
    if (top + 200 > window.innerHeight) {
        top = buttonRect.top - 180;
    }
    
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.classList.add('active');
    
    // Update aria-expanded
    button.setAttribute('aria-expanded', 'true');
    
    // Focus first menu item for keyboard access
    setTimeout(() => {
        const firstItem = menu.querySelector('.card-option-item');
        if (firstItem) firstItem.focus();
    }, 0);
    
    // Add click outside and keyboard listeners
    setTimeout(() => {
        document.addEventListener('click', handleClickOutsideMenu);
        document.addEventListener('keydown', handleMenuKeyboard);
    }, 0);
}

// Close card options menu
function closeCardOptionsMenu() {
    const menu = document.getElementById('cardOptionsMenu');
    const activeButton = document.querySelector('[aria-expanded="true"]');
    
    menu.classList.remove('active');
    
    // Update aria-expanded and return focus
    if (activeButton) {
        activeButton.setAttribute('aria-expanded', 'false');
        activeButton.focus();
    }
    
    document.removeEventListener('click', handleClickOutsideMenu);
    document.removeEventListener('keydown', handleMenuKeyboard);
    currentCardElement = null;
}

// Handle click outside menu
function handleClickOutsideMenu(event) {
    const menu = document.getElementById('cardOptionsMenu');
    if (!menu.contains(event.target)) {
        closeCardOptionsMenu();
    }
}

// Handle keyboard navigation in menu
function handleMenuKeyboard(event) {
    const menu = document.getElementById('cardOptionsMenu');
    if (!menu.classList.contains('active')) return;
    
    const menuItems = Array.from(menu.querySelectorAll('.card-option-item'));
    const currentIndex = menuItems.indexOf(document.activeElement);
    
    switch(event.key) {
        case 'Escape':
            event.preventDefault();
            closeCardOptionsMenu();
            break;
            
        case 'ArrowDown':
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % menuItems.length;
            menuItems[nextIndex].focus();
            break;
            
        case 'ArrowUp':
            event.preventDefault();
            const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
            menuItems[prevIndex].focus();
            break;
            
        case 'Home':
            event.preventDefault();
            menuItems[0].focus();
            break;
            
        case 'End':
            event.preventDefault();
            menuItems[menuItems.length - 1].focus();
            break;
    }
}

// Handle keyboard navigation for saved payment methods
function handlePaymentMethodsKeyboard(event) {
    const activeElement = document.activeElement;
    
    // Check if we're in a payment method card
    const paymentMethodCard = activeElement.closest('.saved-card-wrapper, .saved-payment-wrapper');
    if (!paymentMethodCard) return;
    
    // Handle both arrow keys and Enter key
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        // IMMEDIATELY prevent default and stop all propagation
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        // Get all visible payment method cards (in document order)
        const allCards = [];
        const paymentList = document.querySelector('.saved-payment-list');
        
        if (paymentList) {
            // Get all list items in order
            paymentList.querySelectorAll('li.saved-card-wrapper, li.saved-payment-wrapper').forEach(card => {
                const isHiddenCard = card.classList.contains('hidden-card');
                const isHiddenMethod = card.classList.contains('hidden-method');
                const isShown = card.classList.contains('show');
                
                // Include if: not hidden at all, OR is hidden but currently shown
                if ((!isHiddenCard && !isHiddenMethod) || isShown) {
                    allCards.push(card);
                }
            });
        }
        
        const currentIndex = allCards.indexOf(paymentMethodCard);
        if (currentIndex === -1) return false;
        
        let targetCard = null;
        
        if (event.key === 'ArrowDown') {
            // Move to next payment method (no wrapping)
            if (currentIndex < allCards.length - 1) {
                targetCard = allCards[currentIndex + 1];
            }
        } else if (event.key === 'ArrowUp') {
            // Move to previous payment method (no wrapping)
            if (currentIndex > 0) {
                targetCard = allCards[currentIndex - 1];
            }
        }
        
        if (targetCard) {
            // Focus and select the radio button of the target card
            const radioButton = targetCard.querySelector('input[type="radio"]');
            if (radioButton) {
                radioButton.focus();
                radioButton.checked = true;
                // Trigger the change event to update UI (CVV field, etc.)
                const changeEvent = new Event('change', { bubbles: true });
                radioButton.dispatchEvent(changeEvent);
            }
        }
        
        return false;
    }
    
    // Handle Enter key to select payment method
    if (event.key === 'Enter') {
        const radioButton = paymentMethodCard.querySelector('input[type="radio"]');
        if (radioButton && activeElement === radioButton) {
            event.preventDefault();
            radioButton.checked = true;
            // Trigger the change event to update UI (CVV field, etc.)
            const changeEvent = new Event('change', { bubbles: true });
            radioButton.dispatchEvent(changeEvent);
            return false;
        }
    }
}

// Edit card (placeholder)
function editCard() {
    closeCardOptionsMenu();
    
    if (!currentCardElement) return;
    
    const cardNumber = currentCardElement.querySelector('.card-number')?.textContent || '';
    showNotification(`Edit functionality for ${cardNumber} - Coming soon`);
    
    // In production, this would open an edit modal or form
}

// Remove card
function removeCard() {
    closeCardOptionsMenu();
    
    if (!currentCardElement) return;
    
    const cardNumber = currentCardElement.querySelector('.card-number')?.textContent || '';
    
    const confirmed = confirm(`Are you sure you want to remove card ${cardNumber}?\n\nThis action cannot be undone.`);
    
    if (confirmed) {
        // Check if this was the selected card
        const radio = currentCardElement.querySelector('input[type="radio"]');
        const wasSelected = radio?.checked;
        
        // Remove the card with animation
        currentCardElement.style.opacity = '0';
        currentCardElement.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            currentCardElement.remove();
            
            // If removed card was selected, select the first available card
            if (wasSelected) {
                const firstCard = document.querySelector('.saved-card-wrapper input[type="radio"]');
                if (firstCard) {
                    firstCard.checked = true;
                    handleCardSelection();
                }
            }
            
            // Update the "Show all cards" button count
            const hiddenCards = document.querySelectorAll('.saved-card-wrapper.hidden-card');
            const showMoreBtn = document.getElementById('showMoreCardsBtn');
            const buttonText = document.getElementById('showMoreText');
            
            if (hiddenCards.length === 0 && showMoreBtn) {
                showMoreBtn.style.display = 'none';
            } else if (buttonText) {
                const visibleHiddenCards = Array.from(hiddenCards).filter(card => !card.classList.contains('show'));
                if (visibleHiddenCards.length > 0) {
                    buttonText.textContent = `Show all cards (${visibleHiddenCards.length})`;
                }
            }
            
            showNotification('Card removed successfully');
        }, 300);
    }
}

// Handle Apple Pay
function handleApplePay() {
    // Check if Apple Pay is available
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
        showNotification('Redirecting to Apple Pay...');
        // In production, initialize Apple Pay session here
        setTimeout(() => {
            processPaymentWithAnimation();
        }, 1000);
    } else {
        alert('Apple Pay is not available on this device or browser.');
    }
}

// Handle Google Pay
function handleGooglePay() {
    showNotification('Redirecting to Google Pay...');
    // In production, initialize Google Pay here
    setTimeout(() => {
        processPaymentWithAnimation();
    }, 1000);
}


// Show Terms modal
function showTerms(event) {
    event.preventDefault();
    alert('Terms and Conditions\n\nThis is where your Terms and Conditions would be displayed.\n\nIn a production environment, this would open a modal or navigate to a dedicated Terms and Conditions page with full legal documentation.');
}

// Show Privacy Policy modal
function showPrivacy(event) {
    event.preventDefault();
    alert('Privacy Policy\n\nThis is where your Privacy Policy would be displayed.\n\nIn a production environment, this would open a modal or navigate to a dedicated Privacy Policy page with detailed information about data collection and usage.');
}

// Process payment
function processPayment() {
    // Check terms agreement first
    const termsAgreement = document.getElementById('termsAgreement');
    if (!termsAgreement.checked) {
        alert('Please agree to the Terms and Conditions and Privacy Policy to continue.');
        termsAgreement.focus();
        return;
    }
    
    const selectedCard = document.querySelector('input[name="payment-method"]:checked');
    const newCardSection = document.getElementById('newCardSection');
    
    if (newCardSection.classList.contains('active')) {
        // Validate new card form
        const cardType = document.querySelector('input[name="newCardType"]:checked')?.value;
        const cardNumber = document.getElementById('cardNumber').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCvv = document.getElementById('cardCvv').value;
        const cardName = document.getElementById('cardName').value;
        const billingAddress = document.getElementById('billingAddress').value;
        
        if (!cardType) {
            alert('Please select card type (Credit or Debit)');
            return;
        }
        
        if (!cardNumber || !cardExpiry || !cardCvv || !cardName || !billingAddress) {
            alert('Please fill in all card details');
            return;
        }
        
        if (cardNumber.replace(/\s/g, '').length < 13) {
            alert('Please enter a valid card number');
            return;
        }
        
        if (cardExpiry.length !== 5) {
            alert('Please enter a valid expiry date (MM/YY)');
            return;
        }
        
        if (cardCvv.length < 3) {
            alert('Please enter a valid CVV');
            return;
        }
        
        if (billingAddress.trim().length < 10) {
            alert('Please enter a valid billing address');
            return;
        }
    } else if (!selectedCard) {
        alert('Please select a payment method');
        return;
    } else {
        // Validate CVV for saved card
        const cardValue = selectedCard.value;
        const cvvInput = document.getElementById(`cvv-input-${cardValue.split('-')[1]}`);
        
        if (!cvvInput || !cvvInput.value) {
            alert('Please enter the security code (CVV) for your card');
            if (cvvInput) {
                cvvInput.focus();
            }
            return;
        }
        
        const cvvLength = cvvInput.value.length;
        const minCvvLength = cvvInput.maxLength === '4' ? 4 : 3;
        
        if (cvvLength < minCvvLength) {
            alert(`Please enter a valid ${minCvvLength}-digit security code`);
            cvvInput.focus();
            return;
        }
    }
    
    processPaymentWithAnimation();
}

// Process payment with animation
function processPaymentWithAnimation() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('active');
    
    // Simulate payment processing
    setTimeout(() => {
        overlay.classList.remove('active');
        showSuccessModal();
    }, 2500);
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
}

// Close success modal
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
    
    // Reset form and restore prepopulated values
    document.getElementById('newCardForm').reset();
    document.getElementById('cardName').value = 'JOHN DOE';
    document.getElementById('billingAddress').value = '123 Main Street, Anytown, CA 12345';
    document.getElementById('newCardSection').classList.remove('active');
}

// Go back
function goBack() {
    if (confirm('Are you sure you want to cancel this payment?')) {
        window.history.back();
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #0f172a;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if there are hidden payment methods
    const hiddenMethods = document.querySelectorAll('.saved-payment-wrapper.hidden-method, .saved-card-wrapper.hidden-card');
    const showMoreBtn = document.getElementById('showMoreCardsBtn');
    
    // Hide show more button if no hidden methods
    if (hiddenMethods.length === 0 && showMoreBtn) {
        showMoreBtn.classList.add('hidden');
    }
    
    // Update button text with actual count
    if (showMoreBtn && hiddenMethods.length > 0) {
        const buttonText = document.getElementById('showMoreText');
        buttonText.textContent = `Show all payment methods (${hiddenMethods.length})`;
    }
    
    // Add enter key support for payment
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT' && activeElement.type === 'text') {
                e.preventDefault();
                processPayment();
            }
        }
    });
    
    // Add arrow key navigation for saved payment methods (use capture phase to intercept early)
    document.addEventListener('keydown', handlePaymentMethodsKeyboard, true);
});

// Prevent form submission
document.getElementById('newCardForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
});

