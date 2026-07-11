let deferredInstallPrompt = null;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((reg) => {
        console.log("Registrasi service worker", reg);
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                showSwUpdateToast();
              }
            });
          }
        });
      })
      .catch((err) => console.error("Service worker gagal", err));

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const installBtn = document.getElementById("navinstall");
    if (installBtn) installBtn.style.display = "block";
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    const installBtn = document.getElementById("navinstall");
    if (installBtn) installBtn.style.display = "none";
  });
}

function showSwUpdateToast() {
  if (typeof toast === "function") {
    toast("Pembaruan tersedia. Muat ulang halaman.");
  }
}

async function installPWA() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  const installBtn = document.getElementById("navinstall");
  if (installBtn) installBtn.style.display = "none";
}
