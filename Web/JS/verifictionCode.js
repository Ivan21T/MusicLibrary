document.addEventListener('DOMContentLoaded', function() {
    emailjs.init('42CDgQR6M-VclRTEw');
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
    codeInputs.firstElementChild.focus();
    
    // Verify button click handler
    verifyBtn.addEventListener('click', async function() {
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
        try{
             const email = localStorage.getItem('email');
             const formData = {
                email:email,
                code:code
            };
            const response = await fetch(`${window.API_CONFIG.USER}/check-otp`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if(response.ok)
            {
                showStatus('Verification successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'newPassword.html';
                }, 1500);
            }
            else{
                errorMessage=(await response.text() || 'Fail!');
                throw new Error(errorMessage)
            }
        }
        catch(errorMessage){
            showStatus(errorMessage.message,'error');
        }
    });
    
    // Resend code link
    resendLink.addEventListener('click', async function() {
        try{
                const email=localStorage.getItem('email');
                const response = await fetch(`${window.API_CONFIG.USER}/send-otp`,{
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(email)
                    });
                if (!response.ok) {
                errorMessage=(await response.text()) || 'Fail to send email!';
                throw new Error(errorMessage);
                }
                const otp = await response.json();
                const expiryDate = new Date(otp.expiryTime);
                const emailParams={
                    email:otp.email,
                    passcode:otp.otp,
                    time: expiryDate.toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                }).replace(",", "")
            }
                const responseEmailJS = await emailjs.send(
                'service_9yme9bl',    
                'template_bccn50k',   
                emailParams);
                if(responseEmailJS.status===200)
                {
                    showStatus("Success!Please check your email!",'success');
                }
                else{
                    throw new Error("Failed to send email!")
                }
    }
    catch(error)
    {
        showStatus(error.message,'error')
    }
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