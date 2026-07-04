function getParticleConfig(theme = "dark") {
  const isLight = theme === "light";
  return {
    canvas: {
      backgroundColor: isLight ? "#ffffff" : "#05030f",
    },
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: isLight ? ["#222222", "#444444", "#666666"] : ["#ffffff", "#b8c1ff", "#7f68ff"],
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: isLight ? "#555555" : "#ffffff",
        },
        polygon: {
          nb_sides: 6,
        },
      },
      opacity: {
        value: 0.55,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 5,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: isLight ? "#333333" : "#ffffff",
        opacity: isLight ? 0.7 : 0.35,
        width: 1,
      },
      move: {
        enable: true,
        speed: 5,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3,
        },
        repulse: {
          distance: 200,
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
    config_demo: {
      hide_card: false,
      background_color: isLight ? "#f7f7f7" : "#05030f",
      background_image: "",
      background_position: "50% 50%",
      background_repeat: "no-repeat",
      background_size: "cover",
    },
  };
}

window.initParticles = function (theme = "dark") {
  particlesJS("particles-js", getParticleConfig(theme));
};

window.initParticles("dark");

function applyTheme(theme) {
  const body = document.body;
  const toggle = document.getElementById("theme-toggle");
  const label = document.getElementById("theme-label");

  if (!body || !toggle || !label) return;

  if (theme === "light") {
    body.classList.add("light-theme");
    body.classList.remove("dark-theme");
    toggle.checked = true;
    label.textContent = "Light";
  } else {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    toggle.checked = false;
    label.textContent = "Dark";
  }

  localStorage.setItem("portfolio-theme", theme);
  initParticles(theme);
}

function initThemeSwitcher() {
  const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  applyTheme(savedTheme);

  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  toggle.addEventListener("change", function () {
    applyTheme(this.checked ? "light" : "dark");
  });
}

document.addEventListener("DOMContentLoaded", initThemeSwitcher);