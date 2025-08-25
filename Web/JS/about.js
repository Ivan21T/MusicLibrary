document.addEventListener('DOMContentLoaded', function () {
    const userContainer   = document.getElementById("users-number");
    const tracksContainer = document.getElementById("tracks-number");
    const artistsContainer = document.getElementById("artists-number");

    async function updateStats() {
        try {
            const getUsers = await fetch(`${window.API_CONFIG.USER}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            const dataUsers = await getUsers.json();
            const users = dataUsers.length;
            userContainer.innerHTML = users;

            const getArtists = await fetch(`${window.API_CONFIG.ARTIST}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            const dataArtists = await getArtists.json();
            const artists = dataArtists.length;
            artistsContainer.innerHTML = artists;

            //
            const getTracks = await fetch(`${window.API_CONFIG.TRACK}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            const dataTracks = await getTracks.json();
            const tracks = dataTracks; 
            tracksContainer.innerHTML = tracks;

        } catch (err) {
            console.error("Error updating stats:", err);
        }
    }
    updateStats();

    
    setInterval(updateStats, 2000);

    
    document.getElementById('signInBtn').addEventListener('click', function () {
        window.location.href = "signUp.html";
    });

    document.getElementById('uploadBtn').addEventListener('click', function () {
        alert('Upload functionality would go here.');
    });
});
