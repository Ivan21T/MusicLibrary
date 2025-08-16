 document.addEventListener('DOMContentLoaded', function() {
            const newPasswordForm = document.getElementById('newPasswordForm');
            const toggleNewPassword = document.getElementById('toggleNewPassword');
            const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
            const newPassword = document.getElementById('newPassword');
            const confirmPassword = document.getElementById('confirmPassword');
            const backButton = document.getElementById('backButton');
            const statusMessage = document.getElementById('statusMessage');
            
            // Get verification code from URL
            const urlParams = new URLSearchParams(window.location.search);
            const verificationCode = urlParams.get('code');
            
            // Toggle password visibility
            toggleNewPassword.addEventListener('click', function(e) {
                e.preventDefault();
                const type = newPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                newPassword.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
            });
            
            toggleConfirmPassword.addEventListener('click', function(e) {
                e.preventDefault();
                const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                confirmPassword.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
            });
            
            // Show status message
            function showStatus(message, isError = false) {
                statusMessage.textContent = message;
                statusMessage.className = isError ? 'status-message status-error' : 'status-message status-success';
                statusMessage.style.display = 'block';
            }
            
            // Form submission
            newPasswordForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const password = newPassword.value;
                const confirm = confirmPassword.value;
                
                if (password !== confirm) {
                    showStatus('Passwords do not match', true);
                    return;
                }
                
                if (password.length < 8) {
                    showStatus('Password must be at least 8 characters', true);
                    return;
                }
                
                // In a real app, you would send this to your backend with the verification code
                console.log('Setting new password:', password, 'with code:', verificationCode);
                
                // Show success and redirect
                showStatus('Password changed successfully! Redirecting to login...');
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            });
            
            // Back button
            backButton.addEventListener('click', function(e) {
                e.preventDefault();
                window.history.back();
            });
        });