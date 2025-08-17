document.addEventListener('DOMContentLoaded', function() {
    emailjs.init('42CDgQR6M-VclRTEw');
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotForm = document.getElementById('forgot-form');
    const backToHomeBtn = document.getElementById('back-to-home');
    
    // Toggle buttons
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    const showForgotBtn = document.getElementById('show-forgot-password');
    const showLoginFromForgotBtn = document.getElementById('show-login-from-forgot');
    
    // Password toggles
    const toggleLoginPassword = document.getElementById('toggle-login-password');
    const toggleRegisterPassword = document.getElementById('toggle-register-password');
    const toggleRegisterConfirm = document.getElementById('toggle-register-confirm');
    
    // Form elements
    const loginPassword = document.getElementById('login-password');
    const registerPassword = document.getElementById('register-password');
    const registerConfirm = document.getElementById('register-confirm');
    
    // Toggle password visibility
    function setupPasswordToggle(toggle, input) {
        toggle.addEventListener('click', function() {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    setupPasswordToggle(toggleLoginPassword, loginPassword);
    setupPasswordToggle(toggleRegisterPassword, registerPassword);
    setupPasswordToggle(toggleRegisterConfirm, registerConfirm);
    
    // Switch between forms
    function switchForms(hideForm, showForm) {
        hideForm.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            hideForm.style.display = 'none';
            showForm.style.display = 'block';
            showForm.style.animation = 'fadeIn 0.5s ease-out';
        }, 300);
    }
    
    showRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        switchForms(loginForm, registerForm);
    });
    
    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        switchForms(registerForm, loginForm);
    });
    
    showForgotBtn.addEventListener('click', function(e) {
        e.preventDefault();
        switchForms(loginForm, forgotForm);
    });
    
    showLoginFromForgotBtn.addEventListener('click', function(e) {
        e.preventDefault();
        switchForms(forgotForm, loginForm);
    });
    
    // Back to home button
    backToHomeBtn.addEventListener('click', function() {
        window.location.href = 'home.html'; 
    });
    
    // Show alert function
    function showAlert(message, type) {
        const alertContainer = document.getElementById('alert-container');
        
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert-message ${type}`;
        
        // Add icon based on type
        const icon = document.createElement('i');
        icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
        alert.appendChild(icon);
        
        // Add message text
        const text = document.createElement('span');
        text.textContent = message;
        alert.appendChild(text);
        
        // Add to container
        alertContainer.appendChild(alert);
        
        // Trigger animation
        setTimeout(() => {
            alert.classList.add('show');
        }, 10);
        
        // Remove after 5 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 5000);
    }
    
    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const formData={
            email:email,
            password:password
        }
        
        try {
            const response = await fetch(`${window.API_CONFIG.USER}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                errorMessage=(await response.text()) || 'Login failed!';
                
                throw new Error(errorMessage);
            }
            
            const user = await response.json();
            sessionStorage.setItem('user', JSON.stringify(user));
            
            window.location.href = 'home.html';
            
        } catch (error) {
            showAlert(error.message, 'error');
            this.classList.add('shake');
            setTimeout(() => this.classList.remove('shake'), 500);
        }
    });
    
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            username: document.getElementById('register-name').value,
            email: document.getElementById('register-email').value,
            password: document.getElementById('register-password').value,
            confirmPassword: document.getElementById('register-confirm').value
        };

        if (formData.password !== formData.confirmPassword) {
            showAlert("Passwords don't match!", 'error');
            return;
        }

        if (formData.password.length < 8) {
            showAlert("Password must be at least 8 characters", 'error');
            return;
        }


        delete formData.confirmPassword;

        try {
            const response = await fetch(`${window.API_CONFIG.USER}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                errorMessage=(await response.text()) || 'Registration failed!';
                throw new Error(errorMessage);
            }

            showAlert('Registration successful!', 'success');
            this.reset();
            setTimeout(() => {
                switchForms(registerForm, loginForm);
            }, 2000);

        } catch (error) {
            showAlert(error.message, 'error');
        }
    });
    
    // Forgot password form submission
    document.getElementById('forgotForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('forgot-email').value;
        
        try {
            const response = await fetch(`${window.API_CONFIG.USER}/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(email)
            });
            
            if (!response.ok) {
                errorMessage=(await response.text()) || 'Fail to send email!';
                throw new Error(errorMessage);
            }
            const otp = await response.json();
            const emailParams={
                email:otp.email,
                passcode:otp.otp,
                time:otp.expiryTime
            }
            const responseEmailJS = await emailjs.send(
            'service_9yme9bl',    
            'template_bccn50k',   
            emailParams);
            if(responseEmailJS.status===200)
            {
                showAlert('Password reset link sent! Please check your email.', 'success');
                this.reset();
                setTimeout(() => {
                window.location.href = "verificationCode.html";
                }, 1500);
            }
            else{
                throw new Error("Failed to send email!")
            }
            
        } catch (error) {
            showAlert(error.message, 'error');
        }
    });
    
    // Add fadeOut animation dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});