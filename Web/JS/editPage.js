        
        document.addEventListener("DOMContentLoaded", function() {
            loadDataInInput();
        });

        function loadDataInInput()
        {
            const user=JSON.parse(sessionStorage.getItem("user"));
            const username = user.username;
            const email=user.email
            document.getElementById("username").value = username;
            document.getElementById("email").value = email;
        }
        // Toggle password visibility
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const input = this.previousElementSibling;
                if (input.type === 'password') {
                    input.type = 'text';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    this.classList.remove('fa-eye-slash');
                    this.classList.add('fa-eye');
                }
            });
        });

        // Show/hide password fields
        document.getElementById('change-password').addEventListener('change', function() {
            const passwordFields = document.getElementById('password-fields');
            if (this.checked) {
                passwordFields.classList.add('show');
            } else {
                passwordFields.classList.remove('show');
            }
        });

        // Cancel button functionality
        document.getElementById('cancel-changes').addEventListener('click', function() {
            document.getElementById('profileForm').reset();
            document.getElementById('password-fields').classList.remove('show');
            document.getElementById('change-password').checked = false;
            loadDataInInput();
        });

        //Form submission
        document.getElementById('profileForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const user = JSON.parse(sessionStorage.getItem('user'));
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const isChecked = document.getElementById('change-password').checked;
            const newPassword = document.getElementById("new-password").value.trim();
            const confirmPassword = document.getElementById("confirm-password").value.trim();

            let formData = {};
            let response;

            try {
                if (isChecked) {
                    if (newPassword === "") {
                        throw new Error("You have to put new password!");
                    }
                    if(newPassword.length<8)
                    {
                        throw new Error("The password must be 8 or more symbols!");
                    }
                    if (confirmPassword === "") {
                        throw new Error("You have to confirm your new password!");
                    }
                    if (newPassword !== confirmPassword) {
                        throw new Error("Passwords don't match!");
                    }

                    formData = {
                        userId:user.userId,
                        username:username,
                        email:email,
                        password: newPassword,
                        created: user.created
                    };
                } else {
                    formData = {
                        userId:user.userId,
                        username:username,
                        email:email,
                        password: user.password,
                        created: user.created,
                    };
                }

                response = await fetch(`${window.API_CONFIG.USER}/${user.userId}`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    showAlert("Successfully updated", 'success');
                    const newUserData=await fetch(`${window.API_CONFIG.USER}/${user.userId}`,{
                        method:"GET",
                        headers: { 'Content-Type': 'application/json' }
                    });
                    if (newUserData.ok) {
                        const newUser = await newUserData.json(); 
                        sessionStorage.setItem('user', JSON.stringify(newUser));
                    } 
                    else {
                        showAlert("Failed to fetch updated user data!", 'error');
                    }
                } else {
                    throw new Error("Failed to update!");
                }
            } catch (error) {
                showAlert(error.message, 'error');
            }
        });

        // Back to home button
        document.getElementById('back-to-home').addEventListener('click', function() {
            window.location.href = 'home.html';
        });

        // Show alert function
        function showAlert(message, type) {
            const alertContainer = document.getElementById('alert-container');
            const alert = document.createElement('div');
            alert.className = `alert-message ${type}`;
            
            let icon = 'fa-info-circle';
            if (type === 'success') icon = 'fa-check-circle';
            if (type === 'error') icon = 'fa-exclamation-circle';
            if (type === 'pending') icon = 'fa-sync-alt';
            
            alert.innerHTML = `
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            `;
            
            alertContainer.appendChild(alert);
            
            void alert.offsetWidth;
            
            alert.classList.add('show');
            
            setTimeout(() => {
                alert.classList.remove('show');
                setTimeout(() => {
                    alert.remove();
                }, 300);
            }, 3000);
        }