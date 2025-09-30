const ua = navigator.userAgent;

function isModernBrowser() {
    try {
        new Function("let a = 1; const b = 2; (() => a + b)();");
        if (typeof Promise === "undefined") return false;
        if (typeof fetch === "undefined") return false;
        if (typeof Array.from === "undefined" || typeof Object.assign === "undefined") return false;
        return true;
    } catch (e) {
        return false;
    }
}

// Vérification navigateurs connus
let redirect = false;

if (ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1) {
    redirect = true;
} else if (ua.indexOf('Edge/') > -1) {
    const edgeVersion = parseInt(ua.split('Edge/')[1].split('.')[0]);
    if (edgeVersion < 80) redirect = true;
} else if (ua.indexOf('Firefox/') > -1) {
    const ffVersion = parseInt(ua.split('Firefox/')[1].split('.')[0]);
    if (ffVersion < 60) redirect = true;
} else if (ua.indexOf('Chrome/') > -1 && ua.indexOf('Edg/') === -1) {
    const chromeVersion = parseInt(ua.split('Chrome/')[1].split('.')[0]);
    if (chromeVersion < 70) redirect = true;
} else if (ua.indexOf('Safari/') > -1 && ua.indexOf('Chrome/') === -1 && ua.indexOf('Chromium') === -1) {
    const safariVersionMatch = ua.match(/Version\/([0-9]+)/);
    if (safariVersionMatch && parseInt(safariVersionMatch[1]) < 12) redirect = true;
}

// Vérification des fonctionnalités modernes
if (!isModernBrowser()) redirect = true;

// Redirection si nécessaire
if (redirect) {
    window.location.href = "index_lite.html";
}

// Fonction pour ouvrir l'application
const ouvrirApplication = () => {
    const lienVersApplication = "https://e-rh-st-andre.kelio.io/open/login";
    window.open(lienVersApplication, "_blank");
};

// Fonction pour gérer l'événement de pression de la touche "K"
const gestionnaireClicToucheK = (event) => {
    if (event.key === "k" || event.key === "K") {
        ouvrirApplication();
    }
};

// Fonction pour ouvrir l'application
const ouvrirApplication2 = () => {
    const lienVersApplication = "https://msamail.saint-andre.re/";
    window.open(lienVersApplication, "_blank");
};

// Fonction pour gérer l'événement de pression de la touche "Z"
const gestionnaireClicToucheZ = (event) => {
    if (event.key === "z" || event.key === "Z") {
        ouvrirApplication2();
    }
};

/* === SIDEBAR === */
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuBtn.addEventListener("click", toggleSidebar);
overlay.addEventListener("click", toggleSidebar);

function toggleSidebar() {
  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
}

/* === TICKER ACTUALITÉS === */
fetch("http://intranet2.saint-andre.re/wp-json/wp/v2/posts")
  .then(res => res.json())
  .then(data => {
    const ticker = document.getElementById("ticker-content");
    if (!ticker) return;

    if (data.length > 0) {
      const items = data.slice(0, 4);
      ticker.innerHTML = `<span class="ticker-label">Actualités : </span>` +
        items.map((item, i) => {
          const title = item.title.rendered.replace(/<[^>]*>/g, '');
          return `<a href="${item.link}" target="_blank">${title}</a>${i < items.length - 1 ? ' • ' : ''}`;
        }).join('');
      ticker.innerHTML += '&nbsp;&nbsp;' + ticker.innerHTML;

      requestAnimationFrame(() => {
        const contentWidth = ticker.scrollWidth / 2;
        const speed = 100; // pixels/s
        const duration = contentWidth / speed;

        ticker.style.minWidth = (contentWidth * 2) + "px";

        const styleTag = document.createElement("style");
        styleTag.textContent = `
          #ticker-content {
            display: inline-block;
            white-space: nowrap;
            animation-name: scroll-left-dynamic;
            animation-duration: ${duration}s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            padding-left: 0;
          }
          @keyframes scroll-left-dynamic {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${contentWidth}px); }
          }
        `;
        document.head.appendChild(styleTag);

        // Ralentissement au survol
        const links = ticker.querySelectorAll("a");
        links.forEach(link => {
          link.addEventListener("mouseover", () => {
            ticker.style.animationPlayState = "paused";
          });
          link.addEventListener("mouseout", () => {
            ticker.style.animationPlayState = "running";
          });
        });
      });
    } else {
      ticker.textContent = "Aucune actualité trouvée.";
    }
  })
  .catch(err => {
    console.error(err);
    const ticker = document.getElementById("ticker-content");
    if (ticker) ticker.textContent = "Erreur de chargement.";
  });

  // Écouteur d'événement pour toute la page
document.addEventListener("keydown", gestionnaireClicToucheK);
document.addEventListener("keydown", gestionnaireClicToucheZ);