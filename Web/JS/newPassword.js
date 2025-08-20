document.addEventListener('DOMContentLoaded', function() {
            const toggleNewPassword = document.getElementById('toggleNewPassword');
            const newPassword = document.getElementById('newPassword');
            
            toggleNewPassword.addEventListener('click', function() {
                const type = newPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                newPassword.setAttribute('type', type);
                
                // Toggle eye icon
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
            
            // Toggle password visibility for confirm password field
            const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
            const confirmPassword = document.getElementById('confirmPassword');
            
            toggleConfirmPassword.addEventListener('click', function() {
                const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                confirmPassword.setAttribute('type', type);
                
                // Toggle eye icon
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
            
            // Form submission handling (optional)
            const form = document.getElementById('newPasswordForm');
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                if (newPassword.value !== confirmPassword.value) {
                    showStatusMessage('Passwords do not match', 'error');
                    return;
                }
                try{    
                    const email=localStorage.getItem("email");
                    const formData={
                        email:email,
                        newPassword:newPassword.value
                    }
                    const response = await fetch(`${window.API_CONFIG.USER}/reset-password`,{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                    });
                    if(response.ok)
                    {
                        showStatusMessage('Password reset successfully!', 'success');
                        localStorage.removeItem('email');
                        setTimeout(()=>{
                            window.location.href="signUp.html";
                        },1000)
                    }
                    else{
                        errorMessage=(await response.text() || 'Fail!');
                        throw new Error(errorMessage)
                    }  
            }   
            catch(errorMessage){
                showStatusMessage(errorMessage.message,'error');
            }
            });
            
            function showStatusMessage(message, type) {
                const statusElement = document.getElementById('statusMessage');
                statusElement.textContent = message;
                statusElement.style.display = 'block';
                statusElement.style.backgroundColor = type === 'error' ? '#ffebee' : '#e8f5e9';
                statusElement.style.color = type === 'error' ? '#c62828' : '#2e7d32';
            }
        });