// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const firstButton = document.querySelector('.firstButton');
    const formDiv = document.getElementById('formDiv');
    const dealForm = document.getElementById('dealForm');
    const tabs = document.querySelectorAll('.tab');
    const backStep = document.querySelector('.backStep');
    const nextStep = document.querySelector('.nextStep');
    const loaderDiv = document.querySelector('.loaderDiv');

    // Address elements
    const postcodeBtn = document.getElementById('postcodeBtn');
    const propertyDiv = document.querySelector('.propertyDiv');
    const selectedDiv = document.querySelector('.selectedDiv');
    const selectedAddress = document.querySelector('.selectedAddress');
    const selectedAddressError = document.querySelector('.selectedAddressError');

    // Previous address elements
    const addAddressBtn = document.querySelector('.addAddress');
    const removeAddressBtn = document.querySelector('.removeAddress');
    const prevAddressDiv = document.querySelector('.prevAddressDiv');
    const prevPostcodeBtn = document.getElementById('prevpostcodeBtn');
    const prevPropertyDiv = document.querySelector('.prevpropertyDiv');
    const prevSelectedDiv = document.querySelector('.prevselectedDiv');

    // Form state
    let currentTab = 0;
    let formData = {
        currentAddress: '',
        previousAddress: '',
        bankruptcy: '',
        title: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        marketing: false
    };

    // Validation functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    function validatePhone(phone) {
        const re = /^(?:(?:\+|00)44|0)7\d{9}$/;
        return re.test(phone.replace(/\s+/g, ''));
    }

    function validatePostcode(postcode) {
        const re = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
        return re.test(postcode);
    }

    function validateDOB(day, month, year) {
        const date = new Date(year, month - 1, day);
        const now = new Date();
        const minAge = 18;
        const maxAge = 100;
        
        if (date > now) return false;
        
        const age = (now - date) / (1000 * 60 * 60 * 24 * 365.25);
        return age >= minAge && age <= maxAge;
    }

    // Form submission handling
    // Handle step navigation
    function showTab(n) {
        const tabs = document.querySelectorAll('.tab');
        const nextStep = document.querySelector('.nextStep');
        const backStep = document.querySelector('.backStep');

        tabs.forEach((tab, index) => {
            if (index === n) {
                tab.classList.remove('hidden');
            } else {
                tab.classList.add('hidden');
            }
        });

        // Update button states
        if (n === 0) {
            backStep.classList.add('hidden');
            if (formData.currentAddress) {
                nextStep.classList.remove('hidden');
                nextStep.textContent = 'Continue';
            } else {
                nextStep.classList.add('hidden');
            }
        } else {
            backStep.classList.remove('hidden');
            nextStep.textContent = 'Submit';
            nextStep.classList.remove('bg-green-500', 'hover:bg-green-600');
        }
    }

    function handleFormSubmission() {
    // Show loader
    loaderDiv.classList.remove('hidden');
    dealForm.classList.add('hidden');

        // Set submission time
        const submissionTime = new Date().toLocaleString('en-GB', { 
            timeZone: 'Europe/London',
            hour12: false 
        });
        document.getElementById('submission_time').value = submissionTime;

        // Gather form data
        const formDataToSubmit = new FormData(dealForm);
        
        // Add additional data
        formDataToSubmit.append('currentAddress', formData.currentAddress);
        if (formData.previousAddress) {
            formDataToSubmit.append('previousAddress', formData.previousAddress);
        }

        // Submit to your API endpoint
        fetch('YOUR_API_ENDPOINT', {
            method: 'POST',
            body: formDataToSubmit
        })
        .then(response => response.json())
        .then(data => {
            // Redirect to success page or show success message
            window.location.href = 'thankyou.html';
        })
        .catch(error => {
            console.error('Error:', error);
            loaderDiv.classList.add('hidden');
            dealForm.classList.remove('hidden');
            alert('There was an error submitting your form. Please try again.');
        });
    }

    function validateCurrentStep() {
        if (currentTab === 0) {
            // Validate first step (address)
            if (!formData.currentAddress) {
                selectedAddressError.classList.remove('hidden');
                return false;
            }
            
            if (!prevAddressDiv.classList.contains('hidden') && !formData.previousAddress) {
                document.querySelector('.prevselectedAddressError').classList.remove('hidden');
                return false;
            }
            
            return true;
        } else {
            // Validate second step
            const bankruptcy = document.querySelector('input[name="bankruptcy"]:checked');
            const title = document.querySelector('input[name="title"]:checked');
            const firstNameInput = document.getElementById('first-name');
            const lastNameInput = document.getElementById('last-name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const dayInput = document.getElementById('dayOfBirth');
            const monthInput = document.getElementById('monthOfBirth');
            const yearInput = document.getElementById('yearOfBirth');
            const marketingInput = document.querySelector('input[type="checkbox"].form-checkbox');

            const firstName = firstNameInput ? firstNameInput.value.trim() : '';
            const lastName = lastNameInput ? lastNameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const day = dayInput ? dayInput.value : '';
            const month = monthInput ? monthInput.value : '';
            const year = yearInput ? yearInput.value : '';
            const marketing = marketingInput ? marketingInput.checked : false;
            
            let isValid = true;
            
            if (!bankruptcy) {
                document.querySelector('.error-div').textContent = 'Please select your bankruptcy status';
                isValid = false;
            }
            
            if (!title) {
                document.querySelector('.error-div').textContent = 'Please select your title';
                isValid = false;
            }
            
            if (!firstName || !lastName) {
                document.querySelector('.name-error').classList.remove('hidden');
                isValid = false;
            }
            
            if (!validateEmail(email)) {
                document.querySelector('.email-error').classList.remove('hidden');
                isValid = false;
            }
            
            if (!validatePhone(phone)) {
                document.querySelector('.phone-error').classList.remove('hidden');
                isValid = false;
            }
            
            if (!validateDOB(day, month, year)) {
                document.querySelector('.dob-error').classList.remove('hidden');
                isValid = false;
            }
            
            return isValid;
        }
    }

    // Show initial form when "Find My Agreements" is clicked
    firstButton.addEventListener('click', function() {
        document.getElementById('formdiv').classList.remove('hidden');
        firstButton.classList.add('hidden');
        // Hide continue button initially until address is selected
        document.querySelector('.nextStep').classList.add('hidden');
    });

    // Set the landing time when the page loads
    const landingTime = new Date().toLocaleString('en-GB', { 
        timeZone: 'Europe/London',
        hour12: false 
    });
    document.querySelector('.landing_time').value = landingTime;

        // Postcode lookup functionality
    function handlePostcodeLookup(postcode, propertyDivSelector, propertySelector, spinnerSelector) {
        if (!postcode || postcode.length < 5) return; // Don't search for very short postcodes

        const spinner = document.querySelector(spinnerSelector);
        const propertyDiv = document.querySelector(propertyDivSelector);
        const propertyContainer = document.querySelector(propertySelector);
        const nextStep = document.querySelector('.nextStep');

        spinner.classList.remove('hidden');
        nextStep.classList.add('hidden');
        
        // API configuration
        const apiKey = "Mu2P8Fp9G0W8ZKNwTo44IQ25787";
        const url = `https://api.getaddress.io/find/${postcode}?api-key=${apiKey}&expand=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                spinner.classList.add('hidden');
                propertyDiv.classList.remove('hidden');
                
                // Clear previous options
                propertyContainer.innerHTML = '';
                
                // Add default option
                const defaultOption = document.createElement('a');
                defaultOption.value = '';
                // defaultOption.textContent = 'Select your address';
                propertyContainer.appendChild(defaultOption);
                
                // Add address options
                if (data.addresses && data.addresses.length > 0) {
                    data.addresses.forEach((address) => {
                        const option = document.createElement('a');
                        option.href = '#';
                        
                        // Format address parts
                        const addressParts = [
                            address.line_1,
                            address.line_2,
                            address.line_3,
                            address.line_4,
                            address.locality,
                            address.town_or_city,
                            address.county,
                            postcode.toUpperCase()
                        ].filter(Boolean); // Remove empty values
                        
                        // Create formatted address
                        const formattedAddress = addressParts.join(', ');
                        
                        // Add data attributes
                        option.className = 'address-link';
                        option.setAttribute('data-fulladdress', formattedAddress);
                        option.setAttribute('data-street', address.thoroughfare || address.line_1 || '');
                        option.setAttribute('data-city', address.town_or_city || '');
                        option.setAttribute('data-province', address.county || '');
                        option.setAttribute('data-building', address.building_number || address.building_name || '');
                        option.setAttribute('data-pxl', '_n' + Math.floor(Math.random() * 1000));
                        
                        option.textContent = formattedAddress;
                        propertyContainer.appendChild(option);
                    });
                    
                    // Style the select container
                    propertyContainer.className = 'property';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                spinner.classList.add('hidden');
                alert('Error finding address. Please try again.');
            });
    }

    // Current address postcode input handling
    document.getElementById('postcode').addEventListener('input', function(e) {
        const postcode = e.target.value.trim();
        if (postcode && postcode.length >= 5) {
            handlePostcodeLookup(postcode, '.propertyDiv', '#property', '.spinner-border');
        }
    });

    // Handle Find button click for current address
    postcodeBtn.addEventListener('click', function() {
        const postcode = document.getElementById('postcode').value.trim();
        if (postcode) {
            handlePostcodeLookup(postcode, '.propertyDiv', '#property', '.spinner-border');
        }
    });

    // Handle current address selection
    document.getElementById('property').addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.classList.contains('address-link')) {
            const selectedValue = e.target.getAttribute('data-fulladdress');
            const nextStep = document.querySelector('.nextStep');
            
            if (selectedValue) {
                selectedDiv.classList.remove('hidden');
                selectedDiv.style.display = 'block';
                selectedDiv.setAttribute('data-pxl', '_n108');
                
                // Update the heading
                const heading = selectedDiv.querySelector('h4');
                if (!heading) {
                    const h4 = document.createElement('h4');
                    h4.className = 'text-lg mb-0 mt-5 text-left';
                    h4.setAttribute('data-pxl', '_n109');
                    h4.textContent = 'Selected Address';
                    selectedDiv.insertBefore(h4, selectedDiv.firstChild);
                }
                
                // Update selected address
                selectedAddress.className = 'selectedAddress text-left text-sm';
                selectedAddress.setAttribute('data-pxl', '_n110');
                selectedAddress.textContent = selectedValue;
                
                // Update error message styling
                selectedAddressError.className = 'selectedAddressError text-red-400 text-sm hidden';
                selectedAddressError.setAttribute('data-pxl', '_n111');
                selectedAddressError.textContent = 'Please select your Address';
                
                formData.currentAddress = selectedValue;
                
                // Show and update continue button
                nextStep.classList.remove('hidden');
                nextStep.textContent = 'Continue';
                nextStep.classList.add("nextStep", "bg-accent2", "text-xl", "w-auto", "px-10", "text-center", "py-4", "rounded-lg", "font-bold", "text-white");
                
                // Hide the address options after selection
                propertyDiv.classList.add('hidden');
            } else {
                nextStep.classList.add('hidden');
            }
        }
    });

    // Previous address handling
    addAddressBtn.addEventListener('click', function() {
        prevAddressDiv.classList.remove('hidden');
        removeAddressBtn.classList.remove('hidden');
        addAddressBtn.classList.add('hidden');
    });

    removeAddressBtn.addEventListener('click', function() {
        prevAddressDiv.classList.add('hidden');
        removeAddressBtn.classList.add('hidden');
        addAddressBtn.classList.remove('hidden');
        
        // Clear previous address data
        document.getElementById('prevpostcode').value = '';
        document.querySelector('.prevproperty').innerHTML = '';
        document.querySelector('.prevselectedAddress').textContent = '';
        formData.previousAddress = '';
        
        prevPropertyDiv.classList.add('hidden');
        prevSelectedDiv.classList.add('hidden');
    });

    // Previous address postcode lookup
    prevPostcodeBtn.addEventListener('click', function() {
        const prevPostcode = document.getElementById('prevpostcode').value.trim();
        if (prevPostcode) {
            handlePostcodeLookup(prevPostcode, '.prevpropertyDiv', '#prevproperty', '.spinner-border2');
        }
    });

    // Handle previous address selection
    document.getElementById('prevproperty').addEventListener('change', function(e) {
        const selectedValue = e.target.value;
        if (selectedValue) {
            prevSelectedDiv.classList.remove('hidden');
            document.querySelector('.prevselectedAddress').textContent = selectedValue;
            document.querySelector('.prevselectedAddressError').classList.add('hidden');
            formData.previousAddress = selectedValue;
        }
    });

    // Next/Previous buttons
    nextStep.addEventListener('click', function() {
        if (!validateCurrentStep()) {
            return false;
        }

        if (currentTab === tabs.length - 1) {
            // Handle form submission
            handleFormSubmission();
        } else {
            currentTab++;
            showTab(currentTab);
        }
    });

    backStep.addEventListener('click', function() {
        if (currentTab > 0) {
            currentTab--;
            showTab(currentTab);
        }
    });

    // Clear validation errors when inputs change
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            const errorDiv = this.parentElement.querySelector('.error-div');
            if (errorDiv) {
                errorDiv.textContent = '';
            }
        });
    });

    // --- Signature Pad Functionality ---
    const signaturePad = document.getElementById('signature-pad');
    const clearSignatureBtn = document.querySelector('[data-action="click->new-form#clearSignature"]');
    const signatureInput = document.querySelector('.hiddenInputFieldSignature');
    let drawing = false;
    let lastX = 0;
    let lastY = 0;

    if (signaturePad && clearSignatureBtn && signatureInput) {
        const ctx = signaturePad.getContext('2d');
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 2;

        function getPointerPos(e) {
            let rect = signaturePad.getBoundingClientRect();
            if (e.touches && e.touches.length > 0) {
                return {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                };
            } else {
                return {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            }
        }

        function startDraw(e) {
            drawing = true;
            const pos = getPointerPos(e);
            lastX = pos.x;
            lastY = pos.y;
        }

        function draw(e) {
            if (!drawing) return;
            e.preventDefault();
            const pos = getPointerPos(e);
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            lastX = pos.x;
            lastY = pos.y;
        }

        function endDraw() {
            drawing = false;
            // Save signature to hidden input
            signatureInput.value = signaturePad.toDataURL('image/png');
        }

        // Mouse events
        signaturePad.addEventListener('mousedown', startDraw);
        signaturePad.addEventListener('mousemove', draw);
        signaturePad.addEventListener('mouseup', endDraw);
        signaturePad.addEventListener('mouseleave', endDraw);

        // Touch events
        signaturePad.addEventListener('touchstart', function(e) { startDraw(e); });
        signaturePad.addEventListener('touchmove', function(e) { draw(e); });
        signaturePad.addEventListener('touchend', function(e) { endDraw(e); });

        // Clear button
        clearSignatureBtn.addEventListener('click', function() {
            ctx.clearRect(0, 0, signaturePad.width, signaturePad.height);
            signatureInput.value = '';
        });
    }

});
