document.addEventListener('DOMContentLoaded', function() {
            const codeInputs = document.getElementById('codeInputs');
            const verifyBtn = document.getElementById('verifyBtn');
            const statusMessage = document.getElementById('statusMessage');
            const toastIcon = statusMessage.querySelector('.toast-icon');
            const toastMessage = statusMessage.querySelector('.toast-message');
            
            // Generate 6 input boxes
            for (let i = 0; i < 6; i++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.className = 'code-input';
                input.dataset.index = i;
                
                // Restrict input to digits only
                input.addEventListener('input', function(e) {
                    this.value = this.value.replace(/[^0-9]/g, '');
                    if (this.value.length === 1 && i < 5) {
                        const nextInput = this.nextElementSibling;
                        if (nextInput) nextInput.focus();
                    }
                });
                
                // Handle backspace to move to previous input
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Backspace' && this.value.length === 0 && i > 0) {
                        const prevInput = this.previousElementSibling;
                        if (prevInput) prevInput.focus();
                    }
                });
                
                codeInputs.appendChild(input);
            }
            
            // Focus first input on load
            if (codeInputs.firstElementChild) {
                codeInputs.firstElementChild.focus();
            }
            
            // Verify button click handler
            verifyBtn.addEventListener('click', function() {
                const inputs = document.querySelectorAll('.code-input');
                let code = '';
                
                // Collect all digits
                inputs.forEach(input => {
                    code += input.value;
                });
                
                // Validate code
                if (code.length !== 6) {
                    showToast('Please enter a complete 6-digit code', 'error');
                    return;
                }
                
                if (!/^\d{6}$/.test(code)) {
                    showToast('Please enter only digits', 'error');
                    return;
                }
                
                // Simulate successful verification
                showToast('Verification successful! Redirecting...', 'success');
                setTimeout(() => {
                        window.location.href = "resetPassword.html";}, 1500);
                
                // Log for debugging (simulating redirect)
                setTimeout(() => {
                    console.log('Would redirect with code:', code);
                }, 1500);
            });
            
            // Show toast notification
            function showToast(message, type) {
                // Set icon based on type
                if (type === 'success') {
                    toastIcon.className = 'toast-icon fas fa-check-circle';
                } else {
                    toastIcon.className = 'toast-icon fas fa-exclamation-circle';
                }
                
                toastMessage.textContent = message;
                statusMessage.className = `toast ${type}`;
                
                // Trigger reflow to restart animation
                void statusMessage.offsetWidth;
                
                statusMessage.classList.add('show');
                
                // Hide after 4 seconds with fade-out
                setTimeout(() => {
                    statusMessage.classList.remove('show');
                }, 4000);
            }
        });