        emailjs.init('42CDgQR6M-VclRTEw');
        //Send email
        function showAlert(message, type) {
            const alertContainer = document.getElementById('alert-container');

            const existingPending = alertContainer.querySelector('.alert-message.pending');
            if (existingPending) {
                existingPending.remove();
            }

            const alert = document.createElement('div');
            alert.className = `alert-message ${type}`;

            const icon = document.createElement('i');
            if (type === 'error') {
                icon.className = 'fas fa-exclamation-circle';
            } else if (type === 'pending') {
                icon.className = 'fas fa-spinner fa-spin';
            } else {
                icon.className = 'fas fa-check-circle';
            }
            alert.appendChild(icon);

            const text = document.createElement('span');
            text.textContent = message;
            alert.appendChild(text);

            alertContainer.appendChild(alert);

            setTimeout(() => {
                alert.classList.add('show');
            }, 10);

            setTimeout(() => {
                alert.classList.remove('show');
                setTimeout(() => {
                    alert.remove();
                }, 300);
            }, type === 'pending' ? 10000 : 5000);
        }
        document.getElementById('contactForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const name=document.getElementById("name").value;
            const email=document.getElementById("email").value;
            const subject=document.getElementById("subject").value;
            const message=document.getElementById("message").value;
            try{
                showAlert("Pending...",'pending')
                const emailParams={
                    name:name,
                    email:email,
                    title:subject,
                    message:message
                };
                const responseEmailJS = await emailjs.send(
                'service_9yme9bl',    
                'template_75dj95z',   
                emailParams);
                if(responseEmailJS.status===200)
                {
                    showAlert("The email was successful send!",'success');
                    this.reset();
                }
                else{
                    throw new Error("Fail to send email!")
                }
            }
            catch(error){
                showAlert(error.message,'error')
            }
        });
        

        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('i');
            
                answer.classList.toggle('active');
                
                if (answer.classList.contains('active')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            });
        });