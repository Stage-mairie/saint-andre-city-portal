// Fonction pour ouvrir l'application
function ouvrirApplication() {
    var lienVersApplication = "https://e-rh-st-andre.kelio.io/open/login";
    window.open(lienVersApplication);
}

// Fonction pour gérer l'événement de pression de la touche "K"
function gestionnaireClicToucheK(event) {
    if (event.keyCode === 75) {
        ouvrirApplication();
    }
}

// Fonction pour tiker avec les actualites
fetch("http://intranet2.saint-andre.re/wp-json/wp/v2/posts")
  .then(response => response.json())
  .then(data => {
    const ticker = document.getElementById("ticker-content");
    if (data.length > 0) {
      const items = data.slice(0, 4);
      ticker.innerHTML = `<span class="ticker-label">Actualités : </span>` +
        items
          .map((item, index) => {
            const title = item.title.rendered.replace(/<[^>]*>/g, '');
            const separator = index < items.length - 1 ? ' • ' : '';
            return `<a href="${item.link}" target="_blank">${title}</a>${separator}`;
          })
          .join('');

      ticker.innerHTML += ticker.innerHTML;

      requestAnimationFrame(() => {
        const tickerWrapper = document.getElementById("news-ticker");
        const contentWidth = ticker.scrollWidth / 2;
        const wrapperWidth = tickerWrapper.offsetWidth;

        const speed = 100; // pixels/sec
        const distance = contentWidth;

        const duration = distance / speed;

        ticker.style.minWidth = (contentWidth * 2) + "px";

        const styleTag = document.createElement("style");
        styleTag.textContent = `
          #ticker-content {
            animation-name: scroll-left-dynamic;
            animation-duration: ${duration}s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            padding-left: 0;
          }
          @keyframes scroll-left-dynamic {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-${contentWidth}px);
            }
          }
        `;
        document.head.appendChild(styleTag);
      });
    } else {
      ticker.textContent = "Aucune actualité trouvée.";
    }
  })
  .catch(err => {
    document.getElementById("ticker-content").textContent = "Erreur de chargement.";
    console.error("Erreur :", err);
  });

// Attacher l'événement de gestion de touche au document
document.addEventListener("keydown", gestionnaireClicToucheK);

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar.style.width === "250px") {
    sidebar.style.width = "0";
  } else {
    sidebar.style.width = "250px";
  }
}
