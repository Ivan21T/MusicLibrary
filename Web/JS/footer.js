class HarmoniXFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.noteIcons = ['♪', '♫', '♩', '♬', '♭', '♮', '♯'];
    this.render();
  }

  connectedCallback() {
    this.initMusicNotes();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :root {
          --primary: #6c5ce7;
          --primary-dark: #5649c0;
          --secondary: #00cec9;
          --dark: #2d3436;
          --light: #f5f6fa;
          --gray: #dfe6e9;
          --danger: #d63031;
          --success: #00b894;
        }

        footer {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          padding: 2rem 1.5rem;
          margin-top: auto;
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .footer-logo img {
          height: 60px;
          width: auto;
        }

        .footer-links {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .footer-link {
          color: white;
          opacity: 0.8;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .footer-link:hover {
          opacity: 1;
          color: var(--secondary);
        }

        .footer-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: var(--secondary);
          transition: width 0.3s ease;
        }

        .footer-link:hover::after {
          width: 100%;
        }

        .footer-social {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          background-color: var(--secondary);
          transform: translateY(-3px) scale(1.1);
        }

        .footer-copyright {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .music-notes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .music-note {
          position: absolute;
          color: rgba(255, 255, 255, 0.3);
          font-size: 1.5rem;
          animation: floatNote linear infinite;
          opacity: 0;
        }

        @keyframes floatNote {
          0% {
            transform: translateY(100%) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-150%) rotate(360deg);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .footer-links {
            gap: 1rem;
          }
        }

        @media (max-width: 576px) {
          .footer-link {
            font-size: 0.8rem;
          }
        }
      </style>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

      <footer>
        <div class="music-notes" id="music-notes"></div>
        <div class="footer-container">
          <div class="footer-logo">
            <img src="../Assets/images/HarmoniX.png" alt="HarmoniX Logo">
            <span>HarmoniX</span>
          </div>
          
          <div class="footer-links">
            <a href="#" class="footer-link">Home</a>
            <a href="#" class="footer-link">Pricing</a>
            <a href="#" class="footer-link">About</a>
            <a href="#" class="footer-link">Contact</a>
          </div>
          
          <div class="footer-social">
            <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
          </div>
          
          <p class="footer-copyright">&copy; ${new Date().getFullYear()} HarmoniX Music. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  createMusicNote() {
    const notesContainer = this.shadowRoot.getElementById('music-notes');
    if (!notesContainer) return;

    const note = document.createElement('div');
    note.className = 'music-note';
    note.textContent = this.noteIcons[Math.floor(Math.random() * this.noteIcons.length)];
    note.style.left = Math.random() * 100 + '%';
    note.style.top = Math.random() * 100 + '%';
    note.style.animationDuration = (Math.random() * 3 + 2) + 's';
    note.style.animationDelay = Math.random() * 2 + 's';
    notesContainer.appendChild(note);

    setTimeout(() => {
      note.remove();
    }, 5000);
  }

  initMusicNotes() {
    // Create initial music notes
    for (let i = 0; i < 15; i++) {
      setTimeout(() => this.createMusicNote(), i * 400);
    }

    // Continue creating notes periodically
    setInterval(() => this.createMusicNote(), 600);
  }
}

// Define the custom element
customElements.define('harmonix-footer', HarmoniXFooter);