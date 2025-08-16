        // Player functionality
        document.addEventListener('DOMContentLoaded', function() {
            const player = document.querySelector('.player');
            const playBtns = document.querySelectorAll('.play-btn');
            const playPauseBtn = document.querySelector('.play-pause-btn');
            const progressBar = document.querySelector('.progress-bar');
            const progress = document.querySelector('.progress');
            const volumeBar = document.querySelector('.volume-bar');
            const volumeProgress = document.querySelector('.volume-progress');
            const currentTime = document.querySelector('.time:first-child');
            const durationTime = document.querySelector('.time:last-child');
            const uploadBtn = document.getElementById('uploadBtn');
            const signInBtn = document.getElementById('signInBtn');
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toast-message');
            const userData = sessionStorage.getItem('user');
            
            // Show player when play button is clicked
            playBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const card = this.closest('.music-card');
                    const title = card.querySelector('.card-title').textContent;
                    const artist = card.querySelector('.card-subtitle').textContent;
                    const image = card.querySelector('.card-image').src;
                    
                    // Update player info
                    document.querySelector('.player-title').textContent = title;
                    document.querySelector('.player-artist').textContent = artist;
                    document.querySelector('.player-image').src = image;
                    
                    // Show player
                    player.classList.add('active');
                    
                    // Change play button to pause
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    
                    // Simulate progress (in a real app, this would be tied to actual audio)
                    let currentSeconds = 0;
                    const totalSeconds = 222; // 3:42 in seconds
                    
                    const progressInterval = setInterval(() => {
                        if (currentSeconds >= totalSeconds) {
                            clearInterval(progressInterval);
                            return;
                        }
                        
                        currentSeconds++;
                        const progressPercent = (currentSeconds / totalSeconds) * 100;
                        progress.style.width = `${progressPercent}%`;
                        
                        // Update time display
                        const minutes = Math.floor(currentSeconds / 60);
                        const seconds = currentSeconds % 60;
                        currentTime.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
                    }, 1000);
                });
            });
            
            // Play/Pause button
            playPauseBtn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (icon.classList.contains('fa-play')) {
                    icon.classList.remove('fa-play');
                    icon.classList.add('fa-pause');
                } else {
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                }
            });
            
            // Click on progress bar to seek
            progressBar.addEventListener('click', function(e) {
                const percent = e.offsetX / this.offsetWidth;
                progress.style.width = `${percent * 100}%`;
            });
            
            // Click on volume bar to adjust volume
            volumeBar.addEventListener('click', function(e) {
                const percent = e.offsetX / this.offsetWidth;
                volumeProgress.style.width = `${percent * 100}%`;
            });
            
            // Filter buttons
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // In a real app, you would filter content here
                });
            });
            
            // Search functionality
            const searchInput = document.querySelector('.search-input');
            searchInput.addEventListener('input', function() {
                // In a real app, you would search content here
                console.log('Searching for:', this.value);
            });
            
            // Upload button functionality
            uploadBtn.addEventListener('click', function() {
                const userData = sessionStorage.getItem('user');
                
                if (userData) {
                    window.location.href="managment.html"
                    
                } else {
                    showToast('Please sign in to upload music', 'error');
                }
            });
            
            // Sign in button functionality
            signInBtn.addEventListener('click', function() {
                if(userData)
                {
                    window.location.href = 'managment.html?page=account';
                }
                else{
                    window.location.href="signUp.html"
                }
            });
            
            // Check if user is already logged in on page load
            checkLoginStatus();
            
            // Toast notification function
            function showToast(message, type = 'error') {
                toastMessage.textContent = message;
                toast.className = 'toast show';
                if (type === 'success') {
                    toast.classList.add('success');
                    toast.querySelector('i').className = 'fas fa-check-circle';
                } else {
                    toast.querySelector('i').className = 'fas fa-exclamation-circle';
                }
                
                // Hide after 3 seconds
                setTimeout(() => {
                    toast.className = 'toast';
                }, 3000);
            }
            
            // Check login status function
            function checkLoginStatus() {
                if (userData) {
                    const user = JSON.parse(userData);
                    signInBtn.innerHTML = `<i class="fas fa-user"></i> ${user.username}`;
                }
            }
        });