let artistDatabase = [];
let albumDatabase = [];
let trackDatabase = [];
const userData = JSON.parse(sessionStorage.getItem('user'));
let userUploads = { 
    albums: userData.addedTracks, 
    songs: userData.addedAlbums 
};

async function loadTrackData() {
    const response = await fetch(`${window.API_CONFIG.TRACK}?importantData=true`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    trackDatabase = data;
}

async function loadAlbumData() {
    const response = await fetch(`${window.API_CONFIG.ALBUM}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    albumDatabase = data;
}

async function loadArtistData() {
    const response = await fetch(`${window.API_CONFIG.ARTIST}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    artistDatabase = data;
}

loadArtistData();
loadAlbumData(); 
loadTrackData();

document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('mainContent');
    const navLinks = document.querySelectorAll('.nav-link');
        
    // Artist Modal Elements
    const artistModal = document.getElementById('artistModal');
    const closeModal = document.querySelector('.close-modal');
    const artistForm = document.getElementById('artistForm');
    let currentArtistInput = null;
    let currentSearchTerm = '';
    let selectedArtists = [];
    let selectedAlbum = null;

    // Navigation handling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            if (this.id === 'homeNavLink') {
                window.location.href = "home.html";
            } else if (this.id === 'accountLink') {
                loadAccountScreen();
            } else if (this.id === 'addLink') {
                loadSelectionScreen();
            } else if (this.id === 'libraryLink') {
                loadUploadsScreen();
            } else if (this.id === 'exitLink') {
                if (confirm("Are you sure you want to log out?")) {
                    sessionStorage.clear();
                    window.location.href = "home.html";
                }
            }
        });
    });

    // Membership images
    function setImageByMembership(date) {
        const dateOfCreation = new Date(userData.created);
        const today = new Date(date);
        const years = (today - dateOfCreation) / (1000 * 60 * 60 * 24 * 365.25);
        let source = "";
        if (years < 3) {
            source = "/Assets/images/bronze_membership.png";
        } else if (years >= 3 && years <= 5) {
            source = "/Assets/images/silver_membership.png";
        } else {
            source = "/Assets/images/gold_membership.png";
        }
        return source;
    }

    // Alert function
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

    // EU Date
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
        document.body.classList.add('modal-open');
        if (searchTerm) {
            document.getElementById('pseudonim').value = searchTerm;
        }
    }

    function closeArtistModal() {
        artistModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        artistForm.reset();
        document.querySelectorAll('.validation-error').forEach(el => el.textContent = '');
        currentArtistInput = null;
        currentSearchTerm = '';
    }

    closeModal.addEventListener('click', closeArtistModal);

    window.addEventListener('click', function(event) {
        if (event.target === artistModal) {
            closeArtistModal();
        }
    });

    // Artist Form submission
    artistForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const pseudonim = document.getElementById('pseudonim').value.trim();
        const country = document.getElementById('country').value.trim();
        const newArtist = { firstName, lastName, pseudonim, country };
        try {
            const response = await fetch(`${window.API_CONFIG.ARTIST}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newArtist)
            });
            if (response.ok) {
                artistDatabase.push(newArtist);
                selectedArtists = [pseudonim]; // Changed to single artist
                updateArtistTags(currentArtistInput);
                closeArtistModal();
                showAlert("Successfully created artist!", 'success');
            } else {
                const error = await response.text();
                throw new Error(error);
            }
        } catch (error) {
            showAlert(error.message, 'error');
        }
    });

    function updateArtistTags(inputElement) {
        const container = inputElement.closest('.artist-search-container');
        const tagContainer = container.querySelector('.artist-tags') || document.createElement('div');
        tagContainer.className = 'artist-tags';
        tagContainer.innerHTML = '';
        selectedArtists.forEach(artist => {
            const tag = document.createElement('span');
            tag.className = 'artist-tag';
            tag.textContent = artist;
            const removeBtn = document.createElement('i');
            removeBtn.className = 'fas fa-times';
            removeBtn.addEventListener('click', () => {
                selectedArtists = [];
                updateArtistTags(inputElement);
            });
            tag.appendChild(removeBtn);
            tagContainer.appendChild(tag);
        });
        if (!container.querySelector('.artist-tags')) {
            container.insertBefore(tagContainer, container.querySelector('.form-input'));
        }
    }

    function updateAlbumTags(inputElement) {
        const container = inputElement.closest('.album-search-container');
        const tagContainer = container.querySelector('.album-tags') || document.createElement('div');
        tagContainer.className = 'album-tags';
        tagContainer.innerHTML = '';
        if (selectedAlbum) {
            const tag = document.createElement('span');
            tag.className = 'album-tag';
            tag.textContent = selectedAlbum.title;
            const removeBtn = document.createElement('i');
            removeBtn.className = 'fas fa-times';
            removeBtn.addEventListener('click', () => {
                selectedAlbum = null;
                updateAlbumTags(inputElement);
            });
            tag.appendChild(removeBtn);
            tagContainer.appendChild(tag);
        }
        if (!container.querySelector('.album-tags')) {
            container.insertBefore(tagContainer, container.querySelector('.form-input'));
        }
    }

    function loadAccountScreen() {
        mainContent.innerHTML = `
            <div class="account-container">
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
            window.location.href = "editPage.html";
        });
        document.getElementById('deleteAccountBtn').addEventListener('click', async function() {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                const user = JSON.parse(sessionStorage.getItem('user'));
                const response = await fetch(`${window.API_CONFIG.USER}/${user.userId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.ok) {
                    sessionStorage.setItem('user', JSON.stringify(userData));
                    sessionStorage.clear();
                    window.location.href = "home.html";
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
                <div id="uploadsContent"></div>
            </div>
        `;
        loadUploadsTab('albums');
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
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
                                <p class="upload-artist">${item.artists.join(', ')}</p>
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
                                <p class="upload-artist">${item.artists.join(', ')}</p>
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
        let selectedArtist = null;
        let selectedTracks = [];
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
                                <div class="artist-tags"></div>
                                <input type="text" id="albumArtist" class="form-input" placeholder="Search for artist...">
                                <div class="artist-search-results" id="artistSearchResults"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="albumReleaseDate" class="form-label">Release Date</label>
                            <input type="date" id="albumReleaseDate" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label for="albumTracks" class="form-label">Tracks</label>
                            <div class="track-search-container">
                                <div class="track-tags"></div>
                                <input type="text" id="albumTracks" class="form-input" placeholder="Search for tracks...">
                                <div class="track-search-results" id="trackSearchResults"></div>
                            </div>
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
        const albumArtistInput = document.getElementById('albumArtist');
        const artistSearchResults = document.getElementById('artistSearchResults');
        albumArtistInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length > 1) {
                const results = artistDatabase.filter(artist => 
                    artist.pseudonim.toLowerCase().includes(searchTerm) ||
                    artist.firstName.toLowerCase().includes(searchTerm) ||
                    artist.lastName.toLowerCase().includes(searchTerm)
                );
                displayArtistResults(results, searchTerm, albumArtistInput);
            } else {
                artistSearchResults.style.display = 'none';
            }
        });
        const albumTracksInput = document.getElementById('albumTracks');
        const trackSearchResults = document.getElementById('trackSearchResults');
        albumTracksInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length > 1) {
                const results = trackDatabase.filter(track => 
                    track.title.toLowerCase().includes(searchTerm)
                );
                displayTrackResults(results, albumTracksInput);
            } else {
                trackSearchResults.style.display = 'none';
            }
        });
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.artist-search-container') && !e.target.closest('.track-search-container')) {
                artistSearchResults.style.display = 'none';
                trackSearchResults.style.display = 'none';
            }
        });
        const albumForm = document.getElementById('albumForm');
        albumForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const title = document.getElementById('albumTitle').value;
            const releaseDate = document.getElementById('albumReleaseDate').value;
   
            if (!selectedArtist) {
                showAlert('Please select an artist', 'error');
                return;
            }
            const albumData = {
                title,
                artist: selectedArtist,
                releaseDate,
                tracks: selectedTracks
            };
            try {
                const response = await fetch(`${window.API_CONFIG.ALBUM}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(albumData)
                });
                if (response.ok) {
                    userUploads.albums.push({
                        id: Date.now(),
                        title,
                        artists: [selectedArtist],
                        year: new Date(releaseDate).getFullYear(),
                        tracks: selectedTracks.length,
                        image: 'https://via.placeholder.com/300x300?text=No+Image'
                    });
                    userData.addedAlbums = (userData.addedAlbums || 0) + 1;
                    sessionStorage.setItem('user', JSON.stringify(userData));
                    showAlert(`Album "${title}" added successfully!`, 'success');
                    albumForm.reset();
                    selectedArtist = null;
                    selectedTracks = [];
                    updateArtistTags(albumArtistInput);
                    updateTrackTags(albumTracksInput);
                } else {
                    const error = await response.text();
                    throw new Error(error || 'Failed to add album');
                }
            } catch (error) {
                showAlert(error.message || 'An error occurred while adding the album', 'error');
            }
        });
        function updateTrackTags(inputElement) {
            const container = inputElement.closest('.track-search-container');
            const tagContainer = container.querySelector('.track-tags') || document.createElement('div');
            tagContainer.className = 'track-tags';
            tagContainer.innerHTML = '';
            selectedTracks.forEach(track => {
                const tag = document.createElement('span');
                tag.className = 'track-tag';
                tag.textContent = track.title;
                const removeBtn = document.createElement('i');
                removeBtn.className = 'fas fa-times';
                removeBtn.addEventListener('click', () => {
                    selectedTracks = selectedTracks.filter(t => t.title !== track.title);
                    updateTrackTags(inputElement);
                });
                tag.appendChild(removeBtn);
                tagContainer.appendChild(tag);
            });
            if (!container.querySelector('.track-tags')) {
                container.insertBefore(tagContainer, container.querySelector('.form-input'));
            }
        }
        function displayTrackResults(results, inputElement) {
            const trackSearchResults = document.getElementById('trackSearchResults');
            trackSearchResults.innerHTML = '';
            results.forEach(track => {
                if (!selectedTracks.some(t => t.title === track.title)) {
                    const trackElement = document.createElement('div');
                    trackElement.className = 'track-result';
                    trackElement.textContent = track.title;
                    trackElement.addEventListener('click', function() {
                        selectedTracks.push(track);
                        updateTrackTags(inputElement);
                        inputElement.value = '';
                        trackSearchResults.style.display = 'none';
                    });
                    trackSearchResults.appendChild(trackElement);
                }
            });
            trackSearchResults.style.display = 'block';
        }
    }

    function loadSongForm() {
        selectedArtists = [];
        selectedAlbum = null;
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
                            <label for="songArtist" class="form-label">Artists</label>
                            <div class="artist-search-container">
                                <div class="artist-tags"></div>
                                <input type="text" id="songArtist" class="form-input" placeholder="Search for artists...">
                                <div class="artist-search-results" id="artistSearchResults"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="songAlbum" class="form-label">Album (optional)</label>
                            <div class="album-search-container">
                                <div class="album-tags"></div>
                                <input type="text" id="songAlbum" class="form-input" placeholder="Search for albums...">
                                <div class="album-search-results" id="albumSearchResults"></div>
                            </div>
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
                displayArtistResults(results, searchTerm, songArtistInput);
            } else {
                artistSearchResults.style.display = 'none';
            }
        });
        const songAlbumInput = document.getElementById('songAlbum');
        const albumSearchResults = document.getElementById('albumSearchResults');
        songAlbumInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length > 1) {
                const results = albumDatabase.filter(album => 
                    album.title.toLowerCase().includes(searchTerm)
                );
                displayAlbumResults(results, songAlbumInput);
            } else {
                albumSearchResults.style.display = 'none';
            }
        });
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.artist-search-container') && !e.target.closest('.album-search-container')) {
                artistSearchResults.style.display = 'none';
                albumSearchResults.style.display = 'none';
            }
        });
        const songForm = document.getElementById('songForm');
        songForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            showAlert('Uploading song...', 'pending');

            const title = document.getElementById('songTitle').value.trim();
            const genre = document.getElementById('songGenre').value;
            const audioFile = document.getElementById('songAudio').files[0];
            const imageFile = document.getElementById('songImage').files[0];

            if (!audioFile) {
                showAlert('Please select an audio file', 'error');
                return;
            }
            if (selectedArtists.length === 0) {
                showAlert('Please select at least one artist', 'error');
                return;
            }
            if (!genre) {
                showAlert('Please select a genre', 'error');
                return;
            }

            try {
                // Convert audio file to base64
                const audioBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(audioFile);
                });

                // Convert image file to base64 (if provided)
                let imageBase64 = null;
                if (imageFile) {
                    imageBase64 = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result.split(',')[1]);
                        reader.onerror = reject;
                        reader.readAsDataURL(imageFile);
                    });
                }

                // Map selected artists to full artist objects
                const artistObjects = artistDatabase.filter(artist => 
                    selectedArtists.includes(artist.pseudonim)
                );

                const trackData = {
                    Title: title,
                    Genre: parseInt(genre),
                    MusicData: audioBase64,
                    ImageData: imageBase64,
                    Artists: artistObjects,
                    AddedBy: userData,
                    Album: selectedAlbum
                };

                const response = await fetch(`${window.API_CONFIG.TRACK}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(trackData)
                });

                if (response.ok) {
                    userUploads.songs.push({
                        id: Date.now(),
                        title,
                        artists: selectedArtists,
                        album: selectedAlbum ? selectedAlbum.title : '',
                        year: selectedAlbum ? selectedAlbum.year : new Date().getFullYear(),
                        image: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : 'https://via.placeholder.com/300x300?text=No+Image'
                    });
                    userData.addedTracks = (userData.addedTracks || 0) + 1;
                    sessionStorage.setItem('user', JSON.stringify(userData));
                    // Reset form
                    songForm.reset();
                    songImagePreview.src = '';
                    songImagePreview.style.display = 'none';
                    songImageCloseBtn.style.display = 'none';
                    audioFileName.textContent = '';
                    audioFileName.style.display = 'none';
                    audioFileCloseBtn.style.display = 'none';
                    selectedArtists = [];
                    selectedAlbum = null;
                    updateArtistTags(songArtistInput);
                    updateAlbumTags(songAlbumInput);
                    showAlert(`Song "${title}" added successfully!`, 'success');
                } else {
                    const error = await response.text();
                    throw new Error(error || 'Failed to add song');
                }
            } catch (error) {
                showAlert(error.message || 'An error occurred while adding the song', 'error');
            }
        });
    }

    function displayArtistResults(results, searchTerm, inputElement) {
        const artistSearchResults = document.getElementById('artistSearchResults');
        artistSearchResults.innerHTML = '';
        if (results.length === 0) {
            const addNewElement = document.createElement('div');
            addNewElement.className = 'add-new-artist';
            addNewElement.innerHTML = `
                <i class="fas fa-plus-circle"></i>
                <span>Add "${searchTerm}" as new artist</span>
            `;
            addNewElement.addEventListener('click', function() {
                openArtistModal(inputElement, searchTerm);
            });
            artistSearchResults.appendChild(addNewElement);
        } else {
            results.forEach(artist => {
                if (!selectedArtists.includes(artist.pseudonim)) {
                    const artistElement = document.createElement('div');
                    artistElement.className = 'artist-result';
                    artistElement.textContent = `${artist.pseudonim} (${artist.firstName} ${artist.lastName})`;
                    artistElement.addEventListener('click', function() {
                        selectedArtists = [artist.pseudonim]; // Changed to single artist
                        selectedArtist = artist.pseudonim; // Update selectedArtist for track search
                        updateArtistTags(inputElement);
                        inputElement.value = '';
                        artistSearchResults.style.display = 'none';
                    });
                    artistSearchResults.appendChild(artistElement);
                }
            });
        }
        artistSearchResults.style.display = 'block';
    }

    function displayAlbumResults(results, inputElement) {
        const albumSearchResults = document.getElementById('albumSearchResults');
        albumSearchResults.innerHTML = '';
        results.forEach(album => {
            if (!selectedAlbum || selectedAlbum.title !== album.title) {
                const albumElement = document.createElement('div');
                albumElement.className = 'album ', 'album-result';
                albumElement.textContent = `${album.title} (${album.year})`;
                albumElement.addEventListener('click', function() {
                    selectedAlbum = album;
                    updateAlbumTags(inputElement);
                    inputElement.value = '';
                    albumSearchResults.style.display = 'none';
                });
                albumSearchResults.appendChild(albumElement);
            }
        });
        albumSearchResults.style.display = 'block';
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
        document.getElementById('addAlbumCard').addEventListener('click', function() {
            loadAlbumForm();
        });
        document.getElementById('addSongCard').addEventListener('click', function() {
            loadSongForm();
        });
    }

    loadSelectionScreen();
});