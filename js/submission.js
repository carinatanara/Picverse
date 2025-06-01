document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('submission-form');
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('photo');
    const titleInput = document.getElementById('title');
    const emailInput = document.getElementById('email');
    const descriptionInput = document.getElementById('description');

    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            updateUploadAreaText(files[0]);
        }
    });

    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            updateUploadAreaText(e.target.files[0]);
        }
    });

    function updateUploadAreaText(file) {
        const uploadText = document.querySelector('.upload-text');
        const uploadSubtext = document.querySelector('.upload-subtext');
        
        if (file) {
            uploadText.textContent = `Selected: ${file.name}`;
            uploadSubtext.textContent = `Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        clearErrors();
        
        let isValid = true;
        const errors = [];

        if (!fileInput.files || fileInput.files.length === 0) {
            showError(uploadArea, 'Please select an image to upload');
            errors.push('Image is required');
            isValid = false;
        } else {
            const file = fileInput.files[0];
            const maxSize = 10 * 1024 * 1024; // 10MB
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            
            if (file.size > maxSize) {
                showError(uploadArea, 'File size must be less than 10MB');
                errors.push('File too large');
                isValid = false;
            }
            
            if (!allowedTypes.includes(file.type)) {
                showError(uploadArea, 'Please upload a valid image (PNG, JPG, GIF)');
                errors.push('Invalid file type');
                isValid = false;
            }
        }

        if (!titleInput.value.trim()) {
            showError(titleInput, 'Title is required');
            errors.push('Title is required');
            isValid = false;
        } else if (titleInput.value.trim().length < 3) {
            showError(titleInput, 'Title must be at least 3 characters');
            errors.push('Title too short');
            isValid = false;
        }

        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            errors.push('Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email address');
            errors.push('Invalid email format');
            isValid = false;
        }

        if (!descriptionInput.value.trim()) {
            showError(descriptionInput, 'Description is required');
            errors.push('Description is required');
            isValid = false;
        } else if (descriptionInput.value.trim().length < 10) {
            showError(descriptionInput, 'Description must be at least 10 characters');
            errors.push('Description too short');
            isValid = false;
        }

        if (isValid) {
            showSuccess();
            // form.submit();
        } else {
            console.log('Validation errors:', errors);
        }
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(element, message) {
        element.style.borderColor = '#dc3545';
        element.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
        
        let errorMsg = element.parentElement.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.color = '#dc3545';
            errorMsg.style.fontSize = '0.8rem';
            errorMsg.style.marginTop = '0.3rem';
            element.parentElement.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }

    function clearErrors() {
        const inputs = [titleInput, emailInput, descriptionInput];
        inputs.forEach(input => {
            input.style.borderColor = '#ddd';
            input.style.boxShadow = '';
        });
        
        uploadArea.style.borderColor = '#ccc';
        
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }

    function showSuccess() {
        const successMsg = document.createElement('div');
        successMsg.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2rem;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                text-align: center;
                z-index: 1000;
            ">
                <h3 style="color: var(--green-color); margin-bottom: 1rem; text-align: left;">Success!</h3>
                <p style="color: var(--gray-color); margin-bottom: 1rem;">Your artwork has been submitted successfully!</p>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="
                            margin-top: 1rem;
                            padding: 0.5rem 1rem;
                            background: var(--green-color);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                        ">Close</button>
            </div>
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 999;
            " onclick="this.parentElement.remove()"></div>
        `;
        
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            form.reset();
            document.querySelector('.upload-text').textContent = 'Click to upload or drag and drop';
            document.querySelector('.upload-subtext').textContent = 'PNG, JPG, JPEG up to 10MB';
        }, 2000);
    }

    titleInput.addEventListener('blur', function() {
        if (this.value.trim() && this.value.trim().length >= 3) {
            this.style.borderColor = 'var(--green-color)';
        }
    });

    emailInput.addEventListener('blur', function() {
        if (this.value.trim() && isValidEmail(this.value.trim())) {
            this.style.borderColor = 'var(--green-color)';
        }
    });

    descriptionInput.addEventListener('blur', function() {
        if (this.value.trim() && this.value.trim().length >= 10) {
            this.style.borderColor = 'var(--green-color)';
        }
    });
});