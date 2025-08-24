        let artistDatabase = [];
        let userUploads = [];
        let albumDatabase=[];

        const userData=JSON.parse(sessionStorage.getItem('user'));

        // Function to fetch artist data
        async function loadArtistData(){
            const response = await fetch(`${window.API_CONFIG.ARTIST}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            artistDatabase = data;
        }
        loadArtistData();


        document.addEventListener('DOMContentLoaded', function() {
            const mainContent = document.getElementById('mainContent');
            const navLinks = document.querySelectorAll('.nav-link');
                
            // Artist Modal Elements
            const artistModal = document.getElementById('artistModal');
            const closeModal = document.querySelector('.close-modal');
            const artistForm = document.getElementById('artistForm');
            let currentArtistInput = null;
            let currentSearchTerm = '';

            // Navigation handling
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all links
                    navLinks.forEach(l => l.classList.remove('active'));
                    
                    // Add active class to clicked link
                    this.classList.add('active');
                    
                    // Load appropriate content
                    if (this.id === 'homeNavLink') {
                        window.location.href="home.html";
                    } else if (this.id === 'accountLink') {
                        loadAccountScreen();
                    } else if (this.id === 'addLink') {
                        loadSelectionScreen();
                    } else if (this.id === 'libraryLink') {
                        loadUploadsScreen();
                    } else if (this.id === 'exitLink') {
                        if(confirm("Are you sure you want to log out?"))
                        {
                            sessionStorage.clear();
                            window.location.href="home.html"
                        }
                    }
                });
            });
            //Membership images
            function setImageByMembership(date)
            {
                const dateOfCreation=new Date(userData.created);
                var source ="";
                const today=new Date(date);
                const years=(today-dateOfCreation)/(1000*60*60*24*365.25);
                if(years<3)
                {
                    source="/Assets/images/bronze_membership.png";
                }
                else if(years>=3 && years<=5)
                {
                    source="/Assets/images/silver_membership.png";
                }
                else{
                    source="/Assets/images/gold_membership.png";
                }
                return source;

            }
            //Alert function
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
            //EU Date
            function formatDateToEU(dateString) {
                const date = new Date(dateString);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
            // Modal Functions
            function openArtistModal(inputElement, searchTerm = '') {
                currentArtistInput = inputElement;
                currentSearchTerm = searchTerm;
                artistModal.style.display = 'block';
                document.body.classList.add('modal-open'); // Add class to hide scroll
                
                // If we have a search term, pre-fill the pseudonim field
                if (searchTerm) {
                    document.getElementById('pseudonim').value = searchTerm;
                }
            }

            function closeArtistModal() {
                artistModal.style.display = 'none';
                document.body.classList.remove('modal-open'); // Remove class to show scroll
                artistForm.reset();
                // Clear validation errors
                document.querySelectorAll('.validation-error').forEach(el => el.textContent = '');
                currentArtistInput = null;
                currentSearchTerm = '';
            }

            // Close modal when clicking X
            closeModal.addEventListener('click', closeArtistModal);

            // Close modal when clicking outside
            window.addEventListener('click', function(event) {
                if (event.target === artistModal) {
                    closeArtistModal();
                }
            });

            // Artist Form submission
            artistForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Validate form
                const firstName = document.getElementById('firstName').value.trim();
                const lastName = document.getElementById('lastName').value.trim();
                const pseudonim = document.getElementById('pseudonim').value.trim();
                const country = document.getElementById('country').value.trim();
                
                    // Create new artist
                    const newArtist = {
                        firstName,
                        lastName,
                        pseudonim,
                        country
                    };
                    try{
                    const response=await fetch(`${window.API_CONFIG.ARTIST}`,{
                        method:"POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newArtist)
                    });

                    if(response.ok)
                    {
                        if (currentArtistInput) {
                            currentArtistInput.value = pseudonim;
                        }
                        closeArtistModal();
                        showAlert("Successful create artist!",'success')
                    }
                    else{
                        error=response.text();
                        throw new Error(error);
                    }
                }
                catch(error)
                {
                    showAlert(error.message,'error');
                }
            });


            function loadAccountScreen() {
                mainContent.innerHTML = `
                    <div class="account-container">
                        </button>
                        
                        <div class="profile-card">
                            <img src="${setImageByMembership(Date.now())}" alt="Profile" class="profile-image">
                            <h2 class="profile-name">${userData.username}</h2>
                            <p class="profile-email">${userData.email}</p>
                            
                            <div class="profile-actions">
                                <button class="btn btn-primary" id="editProfileBtn">
                                    <i class="fas fa-edit"></i> Edit Profile
                                </button>
                                <button class="btn btn-danger" id="deleteAccountBtn">
                                    <i class="fas fa-trash"></i> Delete Account
                                </button>
                            </div>
                        </div>
                        
                        <div class="account-details">
                            <h3 class="section-title">Account Details</h3>
                            
                            <div class="detail-item">
                                <span class="detail-label">Member Since</span>
                                <span class="detail-value">${formatDateToEU(userData.created)}</span>
                            </div>
                            
                            <div class="detail-item">
                                <span class="detail-label">Albums Uploaded</span>
                                <span class="detail-value">${userData.addedAlbums?.length || 0}</span>
                            </div>
                            
                            <div class="detail-item">
                                <span class="detail-label">Songs Uploaded</span>
                                <span class="detail-value">${userData.addedTracks?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                `;
                
                
                document.getElementById('editProfileBtn').addEventListener('click', function() {
                    window.location.href="editPage.html"
                });
                
                document.getElementById('deleteAccountBtn').addEventListener('click', async function() {
                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        const user=JSON.parse(sessionStorage.getItem('user'));
                        const response = await fetch(`${window.API_CONFIG.USER}/${user.userId}`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' }
                            });
                        if(response.ok)
                        {
                            sessionStorage.clear();
                            window.location.href="home.html"
                        }
                    }
                });
            }

            function loadUploadsScreen() {
                mainContent.innerHTML = `
                    <div class="uploads-container">
                        
                        <h2 class="section-title">My Uploads</h2>
                        
                        <div class="uploads-tabs">
                            <div class="tab active" data-tab="albums">Albums</div>
                            <div class="tab" data-tab="songs">Songs</div>
                        </div>
                        
                        <div id="uploadsContent">
                            <!-- Content will be loaded here based on tab selection -->
                        </div>
                    </div>
                `;
                
                // Load albums by default
                loadUploadsTab('albums');
                
                // Add event listeners to tabs
                document.querySelectorAll('.tab').forEach(tab => {
                    tab.addEventListener('click', function() {
                        // Remove active class from all tabs
                        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                        
                        // Add active class to clicked tab
                        this.classList.add('active');
                        
                        // Load appropriate content
                        const tabName = this.getAttribute('data-tab');
                        loadUploadsTab(tabName);
                    });
                });
                

            }
            
            function loadUploadsTab(tabName) {
                const uploadsContent = document.getElementById('uploadsContent');
                const items = userUploads[tabName];
                
                if (items && items.length > 0) {
                    let html = `<div class="uploads-grid">`;
                    
                    items.forEach(item => {
                        if (tabName === 'albums') {
                            html += `
                                <div class="upload-card">
                                    <img src="${item.image}" alt="${item.title}" class="upload-image">
                                    <div class="upload-info">
                                        <h3 class="upload-title">${item.title}</h3>
                                        <p class="upload-artist">${item.artist}</p>
                                        <div class="upload-meta">
                                            <span>${item.year}</span>
                                            <span>${item.tracks} tracks</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        } else {
                            html += `
                                <div class="upload-card">
                                    <img src="${item.image}" alt="${item.title}" class="upload-image">
                                    <div class="upload-info">
                                        <h3 class="upload-title">${item.title}</h3>
                                        <p class="upload-artist">${item.artist}</p>
                                        <div class="upload-meta">
                                            <span>${item.year}</span>
                                            <span>${item.album}</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                    });
                    
                    html += `</div>`;
                    uploadsContent.innerHTML = html;
                } else {
                    uploadsContent.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <h3>No ${tabName} uploaded yet</h3>
                            <p>Get started by adding your first ${tabName.slice(0, -1)}</p>
                            <button class="btn btn-primary" id="addFirstUploadBtn">
                                <i class="fas fa-plus"></i> Add ${tabName.slice(0, -1)}
                            </button>
                        </div>
                    `;
                    
                    document.getElementById('addFirstUploadBtn').addEventListener('click', function() {
                        loadSelectionScreen();
                        document.getElementById('addLink').click();
                    });
                }
            }

            function loadAlbumForm() {
                mainContent.innerHTML = `
                    <div class="form-container">
                        <button class="btn btn-back" id="backButton">
                            <i class="fas fa-arrow-left"></i> Back to Selection
                        </button>
                        
                        <div class="form-card">
                            <h3 class="section-title">Add New Album</h3>
                            <form id="albumForm">
                                <div class="form-group">
                                    <label for="albumTitle" class="form-label">Album Title</label>
                                    <input type="text" id="albumTitle" class="form-input" placeholder="Enter album title" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="albumArtist" class="form-label">Artist</label>
                                    <div class="artist-search-container">
                                        <input type="text" id="albumArtist" class="form-input" placeholder="Search for artist..." required>
                                        <div class="artist-search-results" id="artistSearchResults"></div>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="albumYear" class="form-label">Year</label>
                                    <input type="number" id="albumYear" class="form-input" placeholder="Release year" min="1900" max="2099">
                                </div>
                                
                                <div class="form-group">
                                    <label for="albumGenre" class="form-label">Genre</label>
                                    <input type="text" id="albumGenre" class="form-input" placeholder="Enter genre">
                                </div>
                                
                                <div class="form-group">
                                    <label for="albumImage" class="form-label">Album Cover</label>
                                    <img id="albumImagePreview" class="image-preview" alt="Album cover preview">
                                    <label for="albumImage" class="file-input-label">
                                        <i class="fas fa-image"></i> Choose an image
                                    </label>
                                    <input type="file" id="albumImage" class="file-input" accept="image/*">
                                </div>
                                
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-plus"></i> Add Album
                                </button>
                            </form>
                        </div>
                    </div>
                `;
                
                document.getElementById('backButton').addEventListener('click', function(e) {
                    e.preventDefault();
                    loadSelectionScreen();
                });
                
                const albumImageInput = document.getElementById('albumImage');
                const albumImagePreview = document.getElementById('albumImagePreview');
                
                albumImageInput.addEventListener('change', function() {
                    const file = this.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            albumImagePreview.src = e.target.result;
                            albumImagePreview.style.display = 'block';
                        }
                        reader.readAsDataURL(file);
                    }
                });
                
                const albumArtistInput = document.getElementById('albumArtist');
                const artistSearchResults = document.getElementById('artistSearchResults');
                
                albumArtistInput.addEventListener('input', function() {
                    const searchTerm = this.value;
                    if (searchTerm.length > 1) {
                        const results = artistDatabase.filter(artist => 
                            artist.pseudonim.toLowerCase().includes(searchTerm) ||
                            artist.firstName.toLowerCase().includes(searchTerm) ||
                            artist.lastName.toLowerCase().includes(searchTerm)
                        );
                        
                        displayArtistResults(results, searchTerm);
                    } else {
                        artistSearchResults.style.display = 'none';
                    }
                });
                
                function displayArtistResults(results, searchTerm) {
                    artistSearchResults.innerHTML = '';
                    
                    if (results.length === 0) {
                        const addNewElement = document.createElement('div');
                        addNewElement.className = 'add-new-artist';
                        addNewElement.innerHTML = `
                            <i class="fas fa-plus-circle"></i>
                            <span>Add "${searchTerm}" as new artist</span>
                        `;
                        addNewElement.addEventListener('click', function() {
                            openArtistModal(albumArtistInput, searchTerm);
                        });
                        artistSearchResults.appendChild(addNewElement);
                    } else {
                        results.forEach(artist => {
                            const artistElement = document.createElement('div');
                            artistElement.className = 'artist-result';
                            artistElement.textContent = `${artist.pseudonim} (${artist.firstName} ${artist.lastName})`;
                            artistElement.addEventListener('click', function() {
                                albumArtistInput.value = artist.pseudonim;
                                artistSearchResults.style.display = 'none';
                            });
                            artistSearchResults.appendChild(artistElement);
                        });
                    }
                    
                    artistSearchResults.style.display = 'block';
                }
                
                document.addEventListener('click', function(e) {
                    if (!e.target.closest('.artist-search-container')) {
                        artistSearchResults.style.display = 'none';
                    }
                });
                
                const albumForm = document.getElementById('albumForm');
                
                albumForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const title = document.getElementById('albumTitle').value;
                    const artist = document.getElementById('albumArtist').value;
                    const year = document.getElementById('albumYear').value;
                    const genre = document.getElementById('albumGenre').value;
                    const image = albumImagePreview.src || 'https://via.placeholder.com/300x300?text=No+Image';
                    
                    // Add to user uploads
                    userUploads.albums.push({
                        id: Date.now(),
                        title,
                        artist,
                        year,
                        image,
                        tracks: 0 // This would be set based on actual tracks added
                    });
                    
                    // Update user stats
                    userData.uploads.albums++;
                    
                    alert(`Album "${title}" by ${artist} added successfully!`);
                    
                    albumForm.reset();
                    albumImagePreview.style.display = 'none';
                });
            }
            
            function loadSongForm() {
                mainContent.innerHTML = `
                    <div class="form-container">
                        <button class="btn btn-back" id="backButton">
                            <i class="fas fa-arrow-left"></i> Back to Selection
                        </button>
                        
                        <div class="form-card">
                            <h3 class="section-title">Add New Song</h3>
                            <form id="songForm">
                                <div class="form-group">
                                    <label for="songTitle" class="form-label">Song Title</label>
                                    <input type="text" id="songTitle" class="form-input" placeholder="Enter song title" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="songArtist" class="form-label">Artist</label>
                                    <div class="artist-search-container">
                                        <input type="text" id="songArtist" class="form-input" placeholder="Search for artist..." required>
                                        <div class="artist-search-results" id="artistSearchResults"></div>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="songAlbum" class="form-label">Album (optional)</label>
                                    <input type="text" id="songAlbum" class="form-input" placeholder="Enter album name">
                                </div>
                                
                                <div class="form-group">
                                    <label for="songGenre" class="form-label">Genre</label>
                                    <select id="songGenre" class="form-input">
                                        <option value="">Select a genre</option>
                                        <option value="0">Pop</option>
                                        <option value="1">Rock</option>
                                        <option value="2">Hip Hop</option>
                                        <option value="3">R&B</option>
                                        <option value="4">Jazz</option>
                                        <option value="5">Classical</option>
                                        <option value="6">Country</option>
                                        <option value="7">Electronic</option>
                                        <option value="8">Reggae</option>
                                        <option value="9">Blues</option>
                                        <option value="10">Metal</option>
                                        <option value="11">Folk</option>
                                        <option value="12">Punk</option>
                                        <option value="13">Soul</option>
                                        <option value="14">Funk</option>
                                        <option value="15">Disco</option>
                                        <option value="16">Latin</option>
                                        <option value="17">Gospel</option>
                                        <option value="18">Indie</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="songImage" class="form-label">Cover Image</label>
                                    <div class="image-preview-container">
                                        <img id="songImagePreview" class="image-preview" alt="Song cover preview" style="display: none;">
                                        <button type="button" class="image-preview-close" id="songImageCloseBtn" style="display: none;">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                    <label for="songImage" class="file-input-label">
                                        <i class="fas fa-image"></i> Choose an image
                                    </label>
                                    <input type="file" id="songImage" class="file-input" accept="image/*">
                                </div>
                                
                                <div class="form-group">
                                    <label for="songAudio" class="form-label">Audio File</label>
                                    <div class="audio-file-container">
                                        <label for="songAudio" class="file-input-label audio-input-label">
                                            <i class="fas fa-music"></i> Choose an audio file
                                        </label>
                                        <input type="file" id="songAudio" class="file-input" accept="audio/*">
                                        <div class="audio-file-name-container" id="audioFileNameContainer">
                                            <span id="audioFileName" class="audio-file-name"></span>
                                            <button type="button" class="audio-file-close" id="audioFileCloseBtn" style="display: none;">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <button type="submit" class="btn btn-primary">
                                    Add Song
                                </button>
                            </form>
                        </div>
                    </div>
                    
                `;
                
                document.getElementById('backButton').addEventListener('click', function(e) {
                    e.preventDefault();
                    loadSelectionScreen();
                });
                
                const songImageInput = document.getElementById('songImage');
                const songImagePreview = document.getElementById('songImagePreview');
                const songImageCloseBtn = document.getElementById('songImageCloseBtn');
                
                songImageInput.addEventListener('change', function() {
                    const file = this.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            songImagePreview.src = e.target.result;
                            songImagePreview.style.display = 'block';
                            songImageCloseBtn.style.display = 'block';
                        }
                        reader.readAsDataURL(file);
                    }
                });
                
                songImageCloseBtn.addEventListener('click', function() {
                    songImagePreview.src = '';
                    songImagePreview.style.display = 'none';
                    songImageCloseBtn.style.display = 'none';
                    songImageInput.value = '';
                });
                
                const songAudioInput = document.getElementById('songAudio');
                const audioFileName = document.getElementById('audioFileName');
                const audioFileCloseBtn = document.getElementById('audioFileCloseBtn');
                
                // Initialize audio file name and close button as hidden
                audioFileName.textContent = '';
                audioFileName.style.display = 'none';
                audioFileCloseBtn.style.display = 'none';
                
                songAudioInput.addEventListener('change', function() {
                    const file = this.files[0];
                    if (file) {
                        audioFileName.textContent = file.name;
                        audioFileName.style.display = 'block';
                        audioFileCloseBtn.style.display = 'flex';
                    } else {
                        audioFileName.textContent = '';
                        audioFileName.style.display = 'none';
                        audioFileCloseBtn.style.display = 'none';
                    }
                });
                
                audioFileCloseBtn.addEventListener('click', function() {
                    songAudioInput.value = '';
                    audioFileName.textContent = '';
                    audioFileName.style.display = 'none';
                    audioFileCloseBtn.style.display = 'none';
                });
                
                const songArtistInput = document.getElementById('songArtist');
                const artistSearchResults = document.getElementById('artistSearchResults');
                
                songArtistInput.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase();
                    if (searchTerm.length > 1) {
                        const results = artistDatabase.filter(artist => 
                            artist.pseudonim.toLowerCase().includes(searchTerm) ||
                            artist.firstName.toLowerCase().includes(searchTerm) ||
                            artist.lastName.toLowerCase().includes(searchTerm)
                        );
                        
                        displayArtistResults(results, searchTerm);
                    } else {
                        artistSearchResults.style.display = 'none';
                    }
                });
                
                function displayArtistResults(results, searchTerm) {
                    artistSearchResults.innerHTML = '';
                    
                    if (results.length === 0) {
                        const addNewElement = document.createElement('div');
                        addNewElement.className = 'add-new-artist';
                        addNewElement.innerHTML = `
                            <i class="fas fa-plus-circle"></i>
                            <span>Add "${searchTerm}" as new artist</span>
                        `;
                        addNewElement.addEventListener('click', function() {
                            openArtistModal(songArtistInput, searchTerm);
                        });
                        artistSearchResults.appendChild(addNewElement);
                    } else {
                        results.forEach(artist => {
                            const artistElement = document.createElement('div');
                            artistElement.className = 'artist-result';
                            artistElement.textContent = `${artist.pseudonim} (${artist.firstName} ${artist.lastName})`;
                            artistElement.addEventListener('click', function() {
                                songArtistInput.value = artist.pseudonim;
                                artistSearchResults.style.display = 'none';
                            });
                            artistSearchResults.appendChild(artistElement);
                        });
                    }
                    
                    artistSearchResults.style.display = 'block';
                }
                
                document.addEventListener('click', function(e) {
                    if (!e.target.closest('.artist-search-container')) {
                        artistSearchResults.style.display = 'none';
                    }
                });
                
                const songForm = document.getElementById('songForm');
                
                songForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const title = document.getElementById('songTitle').value;
                    const artist = document.getElementById('songArtist').value;
                    const album = document.getElementById('songAlbum').value;
                    const genre = document.getElementById('songGenre').value;

                    const image = songImagePreview.style.display === 'block' ? songImagePreview.src : 'https://via.placeholder.com/300x300?text=No+Image';
                    const audioFile = songAudioInput.files[0];
                    
                    if (!audioFile) {
                        alert('Please select an audio file');
                        return;
                    }
                    
                    userUploads.songs.push({
                        id: Date.now(),
                        title,
                        artist,
                        album,
                        genre,
                        image
                    });
                    
                    userData.uploads.songs++;
                    
                    alert(`Song "${title}" by ${artist} added successfully!`);
                    
                    songForm.reset();
                    songImagePreview.src = '';
                    songImagePreview.style.display = 'none';
                    songImageCloseBtn.style.display = 'none';
                    audioFileName.textContent = '';
                    audioFileName.style.display = 'none';
                    audioFileCloseBtn.style.display = 'none';
                });
            }
            
            function loadSelectionScreen() {
                mainContent.innerHTML = `
                    <div class="selection-screen">
                        <h1 class="selection-title">Add New Content</h1>
                        <p>Choose what you want to add to your music library</p>
                        
                        <div class="selection-options">
                            <div class="selection-card" id="addAlbumCard">
                                <i class="fas fa-compact-disc"></i>
                                <h3>Add Album</h3>
                                <p>Upload a complete album with multiple tracks</p>
                                <button class="btn btn-primary">
                                    <i class="fas fa-plus"></i> Select
                                </button>
                            </div>
                            
                            <div class="selection-card" id="addSongCard">
                                <i class="fas fa-music"></i>
                                <h3>Add Song</h3>
                                <p>Upload a single track to your library</p>
                                <button class="btn btn-secondary">
                                    <i class="fas fa-plus"></i> Select
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add event listeners to selection cards
                document.getElementById('addAlbumCard').addEventListener('click', function() {
                    loadAlbumForm();
                });
                
                document.getElementById('addSongCard').addEventListener('click', function() {
                    loadSongForm();
                });
            }
            
            // Initialize the selection screen
            loadSelectionScreen();
        });