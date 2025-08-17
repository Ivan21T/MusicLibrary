document.addEventListener('DOMContentLoaded', function() {
    const codeInputs = document.getElementById('codeInputs');
    const verifyBtn = document.getElementById('verifyBtn');
    const resendLink = document.getElementById('resendLink');
    const statusMessage = document.getElementById('statusMessage');
    
    // Generate 6 input boxes
    for (let i = 0; i < 6; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.className = 'code-input';
        input.dataset.index = i;
        
        // Only allow digits
        input.addEventListener('input', function(e) {
            // Remove non-digit characters
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Auto-focus next input when a digit is entered
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
    codeInputs.firstChild.focus();
    
    // Verify button click handler
    verifyBtn.addEventListener('click', function() {
        const inputs = document.querySelectorAll('.code-input');
        let code = '';
        
        // Collect all digits
        inputs.forEach(input => {
            code += input.value;
        });
        
        // Validate code length
        if (code.length !== 6) {
            showStatus('Please enter a complete 6-digit code', 'error');
            return;
        }
        
        // Here you would typically verify with your backend
        // For demo, we'll just show success
        showStatus('Verification successful! Redirecting...', 'success');
        
        // Redirect after 1.5 seconds (simulate verification)
        setTimeout(() => {
            window.location.href = 'new-password.html?code=' + code;
        }, 1500);
    });
    
    // Resend code link
    resendLink.addEventListener('click', function() {
        showStatus('New verification code sent to your email', 'success');
    });
    
    // Show status message
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }
});