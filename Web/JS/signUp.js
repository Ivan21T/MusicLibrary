  document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            const forgotForm = document.getElementById('forgot-form');
            const loginError = document.getElementById('login-error');
            const registerSuccess = document.getElementById('register-success');
            const forgotSuccess = document.getElementById('forgot-success');
            const backToHomeBtn = document.getElementById('back-to-home');
            const musicNotesContainer = document.getElementById('music-notes');
            
            // Music notes
            const noteIcons = ['♪', '♫', '♩', '♬', '♭', '♮', '♯'];
            
            function createMusicNote() {
                const note = document.createElement('div');
                note.className = 'music-note';
                note.textContent = noteIcons[Math.floor(Math.random() * noteIcons.length)];
                note.style.left = Math.random() * 100 + '%';
                note.style.top = Math.random() * 100 + '%';
                note.style.animationDuration = (Math.random() * 3 + 2) + 's';
                note.style.animationDelay = Math.random() * 2 + 's';
                musicNotesContainer.appendChild(note);
                
                // Remove note after animation completes
                setTimeout(() => {
                    note.remove();
                }, 5000);
            }
            
            // Create initial music notes
            for (let i = 0; i < 15; i++) {
                setTimeout(createMusicNote, i * 400);
            }
            
            // Continue creating notes periodically
            setInterval(createMusicNote, 600);
            
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
                    
                    // Reset messages
                    loginError.style.display = 'none';
                    registerSuccess.style.display = 'none';
                    forgotSuccess.style.display = 'none';
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
                window.location.href = 'home.html'; // Link to your main page
            });
            
            // Form submissions (simulated)
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                // Simulate login error
                loginError.style.display = 'flex';
                this.classList.add('shake');
                setTimeout(() => this.classList.remove('shake'), 500);
            });
            
            document.getElementById('registerForm').addEventListener('submit', function(e) {
                e.preventDefault();
                // Simulate successful registration
                registerSuccess.style.display = 'flex';
                setTimeout(() => switchForms(registerForm, loginForm), 2000);
            });
            
            document.getElementById('forgotForm').addEventListener('submit', function(e) {
                e.preventDefault();
                // Simulate successful password reset request
                forgotSuccess.style.display = 'flex';
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