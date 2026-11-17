function ir(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

const form = document.getElementById("form");
if (form) {
    form.addEventListener("submit", (socios) => {
        socios.preventDefault();
        const nombreInput = document.getElementById("nombre");
        const mensaje = document.getElementById("mensaje");

        if (nombreInput && mensaje) {
            const nombre = nombreInput.value.trim();
            mensaje.textContent = nombre ? `¡Bienvenido al club, ${nombre}!` : "¡Solicitud enviada!";
        }

        form.reset();
    });
}

const fadeElements = document.querySelectorAll(
    'section:not(#inicio), .tarjeta-jugador, .tarjeta-uniforme, .evento-partido'
);

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    fadeElements.forEach((element) => element.classList.add('fade-on-scroll'));

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    fadeElements.forEach((element) => fadeObserver.observe(element));
}

const inicioLogo = document.querySelector("#inicio .logo-inicio");
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (inicioLogo) {
    const logoInicioOriginal = inicioLogo.getAttribute("src");
    const logoAlternativo = "img/logo.png";
    let logoAlternativoActivo = false;

    inicioLogo.setAttribute("role", "button");
    inicioLogo.setAttribute("tabindex", "0");
    inicioLogo.setAttribute("aria-label", "Cambiar al logo alternativo");
    inicioLogo.setAttribute("aria-pressed", "false");

    const cambiarLogo = () => {
        logoAlternativoActivo = !logoAlternativoActivo;
        inicioLogo.src = logoAlternativoActivo ? logoAlternativo : logoInicioOriginal;
        inicioLogo.setAttribute("aria-pressed", String(logoAlternativoActivo));
        inicioLogo.setAttribute(
            "aria-label",
            logoAlternativoActivo ? "Restaurar logo original" : "Cambiar al logo alternativo"
        );

        if (!prefersReducedMotion.matches) {
            inicioLogo.classList.remove("logo-girando");
            void inicioLogo.offsetWidth;
            inicioLogo.classList.add("logo-girando");
        }
    };

    inicioLogo.addEventListener("animationend", (evento) => {
        if (evento.animationName === "giro-logo-3d") {
            inicioLogo.classList.remove("logo-girando");
        }
    });

    inicioLogo.addEventListener("click", cambiarLogo);
    inicioLogo.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            cambiarLogo();
        }
    });
}

if (inicioLogo && !prefersReducedMotion.matches) {
    const maxTilt = 15;

    const orientLogo = (event) => {
        if (event.pointerType === "touch") return;

        const bounds = inicioLogo.getBoundingClientRect();
        const relativeX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
        const relativeY = (event.clientY - bounds.top) / bounds.height * 2 - 1;

        inicioLogo.style.setProperty("--rotate-x", `${-relativeY * maxTilt}deg`);
        inicioLogo.style.setProperty("--rotate-y", `${relativeX * maxTilt}deg`);
    };

    inicioLogo.addEventListener("pointerenter", orientLogo);
    inicioLogo.addEventListener("pointermove", orientLogo);
    inicioLogo.addEventListener("pointerleave", () => {
        inicioLogo.style.setProperty("--rotate-x", "0deg");
        inicioLogo.style.setProperty("--rotate-y", "0deg");
    });
}

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("header nav");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navigation && navLinks) {
    const cerrarMenu = () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
        navigation.classList.remove("menu-abierto");
    };

    menuToggle.addEventListener("click", () => {
        const abierto = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!abierto));
        menuToggle.setAttribute("aria-label", abierto ? "Abrir menú" : "Cerrar menú");
        navigation.classList.toggle("menu-abierto", !abierto);
    });

    navLinks.addEventListener("click", (evento) => {
        if (evento.target.closest("a")) {
            cerrarMenu();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            cerrarMenu();
        }
    });
}

const menuExtraToggle = document.querySelector(".nav-more-toggle");
const menuExtra = document.getElementById("menu-extra");

if (menuExtraToggle && menuExtra) {
    const cerrarMenuExtra = () => {
        menuExtra.hidden = true;
        menuExtraToggle.setAttribute("aria-expanded", "false");
    };

    menuExtraToggle.addEventListener("click", () => {
        const abierto = menuExtraToggle.getAttribute("aria-expanded") === "true";
        menuExtraToggle.setAttribute("aria-expanded", String(!abierto));
        menuExtra.hidden = abierto;
    });

    menuExtra.addEventListener("click", (evento) => {
        if (evento.target.closest("a")) {
            cerrarMenuExtra();
        }
    });

    document.addEventListener("click", (evento) => {
        if (!menuExtra.contains(evento.target) && !menuExtraToggle.contains(evento.target)) {
            cerrarMenuExtra();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            cerrarMenuExtra();
        }
    });
}

const fichaDialogo = document.getElementById("dialogo-jugador");
if (fichaDialogo) {
    const fichaImagen = document.getElementById("dialogo-jugador-imagen");
    const fichaNombre = document.getElementById("dialogo-jugador-nombre");
    const fichaInformacion = document.getElementById("dialogo-jugador-informacion");
    const fichaGoles = document.getElementById("dialogo-jugador-goles");
    const fichaFecha = document.getElementById("dialogo-jugador-fichaje");
    const cerrarFicha = document.querySelector(".dialogo-jugador-cerrar");

    const mostrarFicha = (tarjeta) => {
        const imagen = tarjeta.querySelector("img");
        const nombre = tarjeta.querySelector("h3");
        const informacion = tarjeta.querySelector("p");

        if (!imagen || !nombre || !informacion) {
            throw new Error("Cada tarjeta del plantel debe incluir imagen, nombre e información.");
        }

        fichaImagen.src = imagen.src;
        fichaImagen.alt = imagen.alt || nombre.textContent.trim();
        fichaNombre.textContent = nombre.textContent.trim();
        fichaInformacion.textContent = informacion.textContent.trim();
        fichaGoles.textContent = tarjeta.dataset.tipo === "entrenador"
            ? "No aplica"
            : tarjeta.dataset.goles || "Sin datos disponibles";
        fichaFecha.textContent = tarjeta.dataset.fichaje || "Sin datos disponibles";
        fichaDialogo.showModal();
    };

    document.querySelectorAll(".tarjeta-jugador").forEach((tarjeta) => {
        const nombre = tarjeta.querySelector("h3");

        if (!nombre) {
            throw new Error("Cada tarjeta del plantel debe incluir un nombre.");
        }

        tarjeta.setAttribute("role", "button");
        tarjeta.setAttribute("aria-haspopup", "dialog");
        tarjeta.setAttribute("aria-label", `Ver ficha de ${nombre.textContent.trim()}`);
        tarjeta.tabIndex = 0;
        tarjeta.addEventListener("click", () => mostrarFicha(tarjeta));
        tarjeta.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                mostrarFicha(tarjeta);
            }
        });
    });

    cerrarFicha.addEventListener("click", () => fichaDialogo.close());
    fichaDialogo.addEventListener("click", (evento) => {
        if (evento.target === fichaDialogo) {
            fichaDialogo.close();
        }
    });
}

const calendarioPartidos = document.getElementById("calendario-partidos");
if (calendarioPartidos) {
    const mesVisible = document.getElementById("mes-visible");
    const calendarioDias = document.getElementById("calendario-dias");
    const mesAnterior = document.getElementById("mes-anterior");
    const mesSiguiente = document.getElementById("mes-siguiente");
    const sinPartidos = document.getElementById("sin-partidos");
    const partidos = [...calendarioPartidos.querySelectorAll(".evento-partido")]
        .map((elemento) => {
            const partesFecha = elemento.dataset.fecha.split("-").map(Number);
            const fecha = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2]);

            if (Number.isNaN(fecha.getTime())) {
                throw new Error(`Fecha inválida para el partido ${elemento.id}.`);
            }

            return { elemento, fecha };
        })
        .sort((a, b) => a.fecha - b.fecha);

    if (!mesVisible || !calendarioDias || !mesAnterior || !mesSiguiente || !sinPartidos || !partidos.length) {
        throw new Error("El calendario necesita controles, una grilla y al menos un partido con fecha.");
    }

    const primeraFecha = partidos[0].fecha;
    const ultimaFecha = partidos[partidos.length - 1].fecha;
    let mesActual = new Date(primeraFecha.getFullYear(), primeraFecha.getMonth(), 1);
    const formatearMes = new Intl.DateTimeFormat("es", { month: "long", year: "numeric" });
    const formatearFecha = new Intl.DateTimeFormat("es", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const renderizarCalendario = () => {
        const anio = mesActual.getFullYear();
        const mes = mesActual.getMonth();
        const primerDiaSemana = (new Date(anio, mes, 1).getDay() + 6) % 7;
        const diasDelMes = new Date(anio, mes + 1, 0).getDate();
        const partidosDelMes = partidos.filter(({ fecha }) =>
            fecha.getFullYear() === anio && fecha.getMonth() === mes
        );

        mesVisible.textContent = formatearMes.format(mesActual);
        mesAnterior.disabled = anio === primeraFecha.getFullYear() && mes === primeraFecha.getMonth();
        mesSiguiente.disabled = anio === ultimaFecha.getFullYear() && mes === ultimaFecha.getMonth();
        calendarioDias.replaceChildren();

        for (let espacio = 0; espacio < primerDiaSemana; espacio += 1) {
            const celdaVacia = document.createElement("span");
            celdaVacia.className = "dia-calendario dia-vacio";
            celdaVacia.setAttribute("aria-hidden", "true");
            calendarioDias.append(celdaVacia);
        }

        for (let dia = 1; dia <= diasDelMes; dia += 1) {
            const fecha = new Date(anio, mes, dia);
            const partido = partidosDelMes.find(({ fecha: fechaPartido }) =>
                fechaPartido.getDate() === dia
            );
            const celda = document.createElement(partido ? "button" : "div");
            celda.className = partido
                ? "dia-calendario dia-con-partido"
                : "dia-calendario";

            if (partido) {
                const horaPartido = partido.elemento.querySelector("time").textContent.split("·").pop().trim();
                const equipos = partido.elemento.querySelector("p").textContent.trim();
                celda.type = "button";
                celda.setAttribute(
                    "aria-label",
                    `${formatearFecha.format(fecha)}: ${equipos}, ${horaPartido}`
                );
                celda.setAttribute("aria-controls", partido.elemento.id);

                const indicador = document.createElement("span");
                indicador.className = "indicador-partido";
                indicador.setAttribute("aria-hidden", "true");
                celda.append(indicador);
                celda.addEventListener("click", () => {
                    partido.elemento.scrollIntoView({
                        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
                        block: "nearest"
                    });
                });
            }

            const numeroDia = document.createElement("span");
            numeroDia.textContent = String(dia);
            celda.prepend(numeroDia);
            calendarioDias.append(celda);
        }

        const celdasRestantes = (7 - calendarioDias.children.length % 7) % 7;
        for (let espacio = 0; espacio < celdasRestantes; espacio += 1) {
            const celdaVacia = document.createElement("span");
            celdaVacia.className = "dia-calendario dia-vacio";
            celdaVacia.setAttribute("aria-hidden", "true");
            calendarioDias.append(celdaVacia);
        }

        partidos.forEach(({ elemento, fecha }) => {
            elemento.hidden = fecha.getFullYear() !== anio || fecha.getMonth() !== mes;
        });
        sinPartidos.hidden = partidosDelMes.length > 0;
    };

    mesAnterior.addEventListener("click", () => {
        mesActual = new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1);
        renderizarCalendario();
    });
    mesSiguiente.addEventListener("click", () => {
        mesActual = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1);
        renderizarCalendario();
    });
    renderizarCalendario();
}

document.querySelectorAll(".nav-links a").forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
        if (
            evento.defaultPrevented ||
            evento.button !== 0 ||
            evento.metaKey ||
            evento.ctrlKey ||
            evento.shiftKey ||
            evento.altKey ||
            enlace.target ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        const destino = new URL(enlace.href, window.location.href);
        if (destino.origin !== window.location.origin || destino.pathname === window.location.pathname) {
            return;
        }

        evento.preventDefault();
        document.body.classList.add("page-leaving");
        window.setTimeout(() => window.location.assign(destino.href), 180);
    });
});
