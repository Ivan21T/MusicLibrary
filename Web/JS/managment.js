// Sample database of artists
const artistDatabase = [
    { id: 1, name: "Queen" },
    { id: 2, name: "Eagles" },
    { id: 3, name: "John Lennon" },
    { id: 4, name: "Guns N' Roses" },
    { id: 5, name: "Michael Jackson" },
    { id: 6, name: "Nirvana" },
    { id: 7, name: "Bob Dylan" },
    { id: 8, name: "The Beatles" },
    { id: 9, name: "Jimi Hendrix" },
    { id: 10, name: "Led Zeppelin" }
];

// Sample database of songs for search functionality
const songDatabase = [
    { id: 1, title: "Bohemian Rhapsody", artist: "Queen", duration: "5:55" },
    { id: 2, title: "Hotel California", artist: "Eagles", duration: "6:30" },
    { id: 3, title: "Imagine", artist: "John Lennon", duration: "3:04" },
    { id: 4, title: "Sweet Child O'Mine", artist: "Guns N' Roses", duration: "5:56" },
    { id: 5, title: "Billie Jean", artist: "Michael Jackson", duration: "4:54" },
    { id: 6, title: "Smells Like Teen Spirit", artist: "Nirvana", duration: "5:01" },
    { id: 7, title: "Like a Rolling Stone", artist: "Bob Dylan", duration: "6:13" },
    { id: 8, title: "Yesterday", artist: "The Beatles", duration: "2:05" },
    { id: 9, title: "Purple Haze", artist: "Jimi Hendrix", duration: "2:50" },
    { id: 10, title: "Stairway to Heaven", artist: "Led Zeppelin", duration: "8:02" }
];

// Sample liked songs
const likedSongs = [
    { id: 1, title: "Bohemian Rhapsody", artist: "Queen", duration: "5:55", image: "https://source.unsplash.com/random/300x300/?queen" },
    { id: 3, title: "Imagine", artist: "John Lennon", duration: "3:04", image: "https://source.unsplash.com/random/300x300/?john,lennon" },
    { id: 5, title: "Billie Jean", artist: "Michael Jackson", duration: "4:54", image: "https://source.unsplash.com/random/300x300/?michael,jackson" },
    { id: 10, title: "Stairway to Heaven", artist: "Led Zeppelin", duration: "8:02", image: "https://source.unsplash.com/random/300x300/?led,zeppelin" }
];

// Sample user data
const userData = sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')) : {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    username: "alexmusic",
    joinDate: "January 15, 2022",
    plan: "Premium",
    avatar: "https://source.unsplash.com/random/300x300/?portrait"
};

// Sample library data
let library = {
    albums: [
        {
            id: 1,
            title: "Midnight Memories",
            artist: "The Dreamers",
            year: "2023",
            genre: "Pop",
            image: "https://source.unsplash.com/random/300x300/?album,cover,1",
            songs: [
                { id: 101, title: "Midnight Dreams", duration: "3:45", audioFile: null },
                { id: 102, title: "Starry Night", duration: "4:12", audioFile: null },
                { id: 103, title: "City Lights", duration: "3:58", audioFile: null }
            ]
        },
        {
            id: 2,
            title: "Electric Dreams",
            artist: "Neon Waves",
            year: "2022",
            genre: "Electronic",
            image: "https://source.unsplash.com/random/300x300/?album,cover,2",
            songs: [
                { id: 201, title: "Digital Love", duration: "5:20", audioFile: null },
                { id: 202, title: "Synthwave", duration: "4:35", audioFile: null }
            ]
        }
    ],
    songs: [
        { id: 301, title: "Dancing in the Moonlight", artist: "Starlight Orchestra", album: "", duration: "3:42", image: "https://source.unsplash.com/random/300x300/?music,single,1", audioFile: null },
        { id: 302, title: "City Lights", artist: "Urban Sound", album: "Midnight Memories", duration: "4:15", image: "https://source.unsplash.com/random/300x300/?music,single,2", audioFile: null }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('mainContent');
    const homeLink = document.getElementById('homeLink');
    const homeNavLink = document.getElementById('homeNavLink');
    const addLink = document.getElementById('addLink');
    const libraryLink = document.getElementById('libraryLink');
    const accountLink = document.getElementById('accountLink');
    const exitLink = document.getElementById('exitLink');

    // Check URL query parameter for active page
    const urlParams = new URLSearchParams(window.location.search);
    const activePage = urlParams.get('page');

    // Load initial content based on query parameter
    if (activePage === 'account') {
        loadAccountScreen();
        setActiveNav('accountLink');
    } else {
        loadSelectionScreen();
        setActiveNav('addLink');
    }

    // Store userData in sessionStorage if it exists
    if (userData) {
        sessionStorage.setItem('userData', JSON.stringify(userData));
    }

    // Navigation event listeners
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        loadSelectionScreen();
        setActiveNav('addLink');
        // Clear query parameter by redirecting without it
        window.history.replaceState({}, document.title, 'managment.html');
    });

    homeNavLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = "home.html";
    });

    addLink.addEventListener('click', function(e) {
        e.preventDefault();
        loadSelectionScreen();
        setActiveNav('addLink');
        window.history.replaceState({}, document.title, 'managment.html');
    });

    libraryLink.addEventListener('click', function(e) {
        e.preventDefault();
        loadLibraryScreen();
        setActiveNav('libraryLink');
        window.history.replaceState({}, document.title, 'managment.html');
    });

    accountLink.addEventListener('click', function(e) {
        e.preventDefault();
        loadAccountScreen();
        setActiveNav('accountLink');
        window.history.replaceState({}, document.title, 'managment.html?page=account');
    });

    exitLink.addEventListener('click', function(e) {
        e.preventDefault();
        let confirmLogout = confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            sessionStorage.clear();
            window.location.href = "home.html";
        }
    });

    function setActiveNav(activeId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        if (activeId) {
            document.getElementById(activeId).classList.add('active');
        }
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

    function loadAlbumForm() {
        mainContent.innerHTML = `
            <div class="form-container">
                <button class="btn btn-back back-home" id="backToHome">
                    <i class="fas fa-home"></i> Back to Home
                </button>
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
                        
                        <div class="form-group">
                            <label class="form-label">Add Songs</label>
                            <div class="song-search-container">
                                <input type="text" id="songSearch" class="form-input" placeholder="Search for songs to add...">
                                <div class="search-results" id="searchResults"></div>
                            </div>
                            <div class="selected-songs" id="selectedSongs"></div>
                            <button type="button" class="btn btn-secondary" id="addCustomSongBtn">
                                <i class="fas fa-plus"></i> Add Custom Song
                            </button>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Add Album
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('backToHome').addEventListener('click', function(e) {
            e.preventDefault();
            loadSelectionScreen();
            setActiveNav('addLink');
            window.history.replaceState({}, document.title, 'managment.html');
        });
        
        document.getElementById('backButton').addEventListener('click', function(e) {
            e.preventDefault();
            loadSelectionScreen();
            window.history.replaceState({}, document.title, 'managment.html');
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
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length > 1) {
                const results = artistDatabase.filter(artist => 
                    artist.name.toLowerCase().includes(searchTerm)
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
                    albumArtistInput.value = searchTerm;
                    artistSearchResults.style.display = 'none';
                });
                artistSearchResults.appendChild(addNewElement);
            } else {
                results.forEach(artist => {
                    const artistElement = document.createElement('div');
                    artistElement.className = 'artist-result';
                    artistElement.textContent = artist.name;
                    artistElement.addEventListener('click', function() {
                        albumArtistInput.value = artist.name;
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
        
        const songSearch = document.getElementById('songSearch');
        const searchResults = document.getElementById('searchResults');
        const selectedSongs = document.getElementById('selectedSongs');
        
        songSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length > 2) {
                const results = songDatabase.filter(song => 
                    song.title.toLowerCase().includes(searchTerm) || 
                    song.artist.toLowerCase().includes(searchTerm)
                );
                
                displaySearchResults(results);
            } else {
                searchResults.style.display = 'none';
            }
        });
        
        function displaySearchResults(results) {
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="song-result">No songs found</div>';
                searchResults.style.display = 'block';
                return;
            }
            
            searchResults.innerHTML = '';
            results.forEach(song => {
                const songElement = document.createElement('div');
                songElement.className = 'song-result';
                songElement.innerHTML = `
                    <span>${song.title} - ${song.artist}</span>
                    <span>${song.duration}</span>
                `;
                
                songElement.addEventListener('click', function() {
                    addSelectedSong(song);
                    songSearch.value = '';
                    searchResults.style.display = 'none';
                });
                
                searchResults.appendChild(songElement);
            });
            
            searchResults.style.display = 'block';
        }
        
        function addSelectedSong(song) {
            if (document.querySelector(`.selected-song[data-id="${song.id}"]`)) {
                return;
            }
            
            const songElement = document.createElement('div');
            songElement.className = 'selected-song';
            songElement.setAttribute('data-id', song.id);
            songElement.innerHTML = `
                <span>${song.title} - ${song.duration}</span>
                <button type="button" class="btn btn-danger remove-song-btn" data-id="${song.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            selectedSongs.appendChild(songElement);
            
            songElement.querySelector('.remove-song-btn').addEventListener('click', function() {
                selectedSongs.removeChild(songElement);
            });
        }
        
        document.getElementById('addCustomSongBtn').addEventListener('click', function() {
            const songTitle = prompt("Enter song title:");
            if (songTitle) {
                const songDuration = prompt("Enter song duration (mm:ss):", "00:00");
                if (songDuration) {
                    const customSong = {
                        id: Date.now(),
                        title: songTitle,
                        artist: document.getElementById('albumArtist').value || 'Unknown',
                        duration: songDuration
                    };
                    addSelectedSong(customSong);
                }
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
            
            if (!artistDatabase.some(a => a.name.toLowerCase() === artist.toLowerCase())) {
                artistDatabase.push({
                    id: Date.now(),
                    name: artist
                });
            }
            
            const songs = [];
            document.querySelectorAll('.selected-song').forEach(songEl => {
                const songId = songEl.getAttribute('data-id');
                const songTitle = songEl.textContent.split(' - ')[0].trim();
                const songDuration = songEl.textContent.split(' - ')[1].trim();
                
                songs.push({
                    id: songId,
                    title: songTitle,
                    duration: songDuration,
                    audioFile: null
                });
            });
            
            const newAlbum = {
                id: Date.now(),
                title: title,
                artist: artist,
                year: year,
                genre: genre,
                image: image,
                songs: songs
            };
            
            library.albums.push(newAlbum);
            
            alert(`Album "${title}" added successfully!`);
            
            albumForm.reset();
            albumImagePreview.style.display = 'none';
            selectedSongs.innerHTML = '';
        });
    }
    
    function loadSongForm() {
        mainContent.innerHTML = `
            <div class="form-container">
                <button class="btn btn-back back-home" id="backToHome">
                    <i class="fas fa-home"></i> Back to Home
                </button>
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
                            <input type="text" id="songGenre" class="form-input" placeholder="Enter genre">
                        </div>
                        
                        <div class="form-group">
                            <label for="songYear" class="form-label">Year</label>
                            <input type="number" id="songYear" class="form-input" placeholder="Release year" min="1900" max="2099">
                        </div>
                        
                        <div class="form-group">
                            <label for="songImage" class="form-label">Cover Image</label>
                            <img id="songImagePreview" class="image-preview" alt="Song cover preview">
                            <label for="songImage" class="file-input-label">
                                <i class="fas fa-image"></i> Choose an image
                            </label>
                            <input type="file" id="songImage" class="file-input" accept="image/*">
                        </div>
                        
                        <div class="form-group">
                            <label for="songAudio" class="form-label">Audio File</label>
                            <audio id="audioPreview" class="audio-preview" controls></audio>
                            <label for="songAudio" class="file-input-label">
                                <i class="fas fa-music"></i> Choose an audio file
                            </label>
                            <input type="file" id="songAudio" class="file-input" accept="audio/*">
                        </div>
                        
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Add Song
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('backToHome').addEventListener('click', function(e) {
            e.preventDefault();
            loadSelectionScreen();
            setActiveNav('addLink');
            window.history.replaceState({}, document.title, 'managment.html');
        });
        
        document.getElementById('backButton').addEventListener('click', function(e) {
            e.preventDefault();
            loadSelectionScreen();
            window.history.replaceState({}, document.title, 'managment.html');
        });
        
        const songImageInput = document.getElementById('songImage');
        const songImagePreview = document.getElementById('songImagePreview');
        
        songImageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    songImagePreview.src = e.target.result;
                    songImagePreview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });
        
        const songAudioInput = document.getElementById('songAudio');
        const audioPreview = document.getElementById('audioPreview');
        
        songAudioInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                audioPreview.src = url;
                audioPreview.style.display = 'block';
            }
        });
        
        const songArtistInput = document.getElementById('songArtist');
        const artistSearchResults = document.getElementById('artistSearchResults');
        
        songArtistInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length > 1) {
                const results = artistDatabase.filter(artist => 
                    artist.name.toLowerCase().includes(searchTerm)
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
                    songArtistInput.value = searchTerm;
                    artistSearchResults.style.display = 'none';
                });
                artistSearchResults.appendChild(addNewElement);
            } else {
                results.forEach(artist => {
                    const artistElement = document.createElement('div');
                    artistElement.className = 'artist-result';
                    artistElement.textContent = artist.name;
                    artistElement.addEventListener('click', function() {
                        songArtistInput.value = artist.name;
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
            const year = document.getElementById('songYear').value;
            const image = songImagePreview.src || 'https://via.placeholder.com/300x300?text=No+Image';
            const audioFile = audioPreview.src || null;
            
            if (!artistDatabase.some(a => a.name.toLowerCase() === artist.toLowerCase())) {
                artistDatabase.push({
                    id: Date.now(),
                    name: artist
                });
            }
            
            const newSong = {
                id: Date.now(),
                title: title,
                artist: artist,
                album: album,
                duration: getAudioDuration(audioPreview),
                genre: genre,
                year: year,
                image: image,
                audioFile: audioFile
            };
            
            library.songs.push(newSong);
            
            alert(`Song "${title}" added successfully!`);
            
            songForm.reset();
            songImagePreview.style.display = 'none';
            audioPreview.style.display = 'none';
        });
        
        function getAudioDuration(audioElement) {
            if (!audioElement.duration || isNaN(audioElement.duration)) {
                return "0:00";
            }
            
            const minutes = Math.floor(audioElement.duration / 60);
            const seconds = Math.floor(audioElement.duration % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    function loadLibraryScreen() {
        mainContent.innerHTML = `
            <div>
                <h1 class="section-title">Your Library</h1>
                
                <div class="added-items">
                    <h2 class="section-title">Albums</h2>
                    ${library.albums.length > 0 ? `
                        <div class="items-grid">
                            ${library.albums.map(album => `
                                <div class="item-card">
                                    <img src="${album.image}" alt="${album.title}" class="item-image">
                                    <div class="item-content">
                                        <h3 class="item-title">${album.title}</h3>
                                        <p class="item-subtitle">${album.artist} • ${album.year}</p>
                                        <div class="item-meta">
                                            <span>${album.genre}</span>
                                            <span>${album.songs.length} songs</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p>No albums added yet.</p>'}
                    
                    <h2 class="section-title" style="margin-top: 2rem;">Songs</h2>
                    ${library.songs.length > 0 ? `
                        <div class="items-grid">
                            ${library.songs.map(song => `
                                <div class="item-card">
                                    <img src="${song.image}" alt="${song.title}" class="item-image">
                                    <div class="item-content">
                                        <h3 class="item-title">${song.title}</h3>
                                        <p class="item-subtitle">${song.artist}${song.album ? ` • ${song.album}` : ''}</p>
                                        <div class="item-meta">
                                            <span>${song.genre || 'Unknown genre'}</span>
                                            <span>${song.duration || '0:00'}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p>No songs added yet.</p>'}
                </div>
            </div>
        `;
    }
    
    function loadAccountScreen() {
        mainContent.innerHTML = `
            <div>
                <h1 class="section-title">Your Account</h1>
                
                <div class="account-container">
                    <div class="account-details">
                        <div class="user-profile">
                            <img src="${userData.avatar}" alt="${userData.name}" class="user-avatar">
                            <div class="user-info">
                                <h2>${userData.name}</h2>
                                <p>@${userData.username}</p>
                            </div>
                        </div>
                        
                        <div class="account-section">
                            <h3>Account Information</h3>
                            <div class="account-field">
                                <label>Email:</label>
                                <span>${userData.email}</span>
                            </div>
                            <div class="account-field">
                                <label>Member Since:</label>
                                <span>${userData.joinDate}</span>
                            </div>
                            <div class="account-field">
                                <label>Subscription Plan:</label>
                                <span>${userData.plan}</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary edit-btn">
                            <i class="fas fa-edit"></i> Edit Profile
                        </button>
                        <button class="btn btn-primary delete-btn">
                            <i class="fas fa-trash"></i> Delete Profile
                        </button>
                    </div>
                    
                    <div class="account-liked">
                        <h3>Liked Songs</h3>
                        ${likedSongs.length > 0 ? `
                            <div>
                                ${likedSongs.map(song => `
                                    <div class="liked-song">
                                        <img src="${song.image}" alt="${song.title}" class="liked-song-img">
                                        <div class="liked-song-info">
                                            <div class="liked-song-title">${song.title}</div>
                                            <div class="liked-song-artist">${song.artist}</div>
                                        </div>
                                        <div class="liked-song-duration">${song.duration}</div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<p>No liked songs yet.</p>'}
                    </div>
                </div>
            </div>
        `;
    }
});