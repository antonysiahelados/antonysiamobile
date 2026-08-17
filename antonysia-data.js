/* Datos y lógica de negocio de Antonysia — extraídos de index.html del repo. */
(function () {
  var SABORES = [
    { n: "Pistacho Italiano", c: "cremas", d: "100% pasta pura de pistacho italiano.", t: "⭐ Autor" },
    { n: "Rocher", c: "cremas", d: "Avellanas, bombón crocante y chocolate con leche.", t: "🔥 Más pedido" },
    { n: "Crema Oreo", c: "cremas", d: "Crema americana con trozos de galletitas Oreo.", t: "" },
    { n: "Mascarpone con Frutos del Bosque", c: "cremas", d: "Mascarpone suave veteado con frutos rojos.", t: "" },
    { n: "Sambayón", c: "cremas", d: "Receta tradicional con yemas y marsala.", t: "" },
    { n: "Tiramisú", c: "cremas", d: "Crema al café con cacao y bizcochuelo embebido.", t: "" },
    { n: "Mousse de Limón", c: "cremas", d: "Suave y refrescante, batida al limón natural.", t: "" },
    { n: "Flan con Dulce de Leche", c: "cremas", d: "Sabor a flan casero sembrado con dulce de leche.", t: "" },
    { n: "Lemon Pie", c: "cremas", d: "Crema de limón con masa crumble y merengue.", t: "" },
    { n: "Banana Split", c: "cremas", d: "Banana natural con dulce de leche y chocolate.", t: "" },
    { n: "Kínder Bueno", c: "cremas", d: "Avellana blanca y chocolate con leche.", t: "" },
    { n: "Menta Granizada", c: "cremas", d: "Menta fresca con chips de chocolate amargo.", t: "" },
    { n: "Frutilla a la Crema", c: "cremas", d: "Frutillas seleccionadas con crema chantilly.", t: "" },
    { n: "Chantilly", c: "cremas", d: "Pura crema batida avainillada suave.", t: "" },
    { n: "Granizado", c: "cremas", d: "Crema americana sembrada con chocolate picado.", t: "" },
    { n: "Súper Dulce de Leche", c: "dulces", d: "Abundante dulce de leche repostero sembrado.", t: "👑 Clásico" },
    { n: "Dulce de Leche Granizado", c: "dulces", d: "Con lluvia de chocolate amargo picado.", t: "" },
    { n: "Dulce de Leche Clásico", c: "dulces", d: "Tradicional dulce de leche artesanal argentino.", t: "" },
    { n: "Dulce de Leche Bombón", c: "dulces", d: "Con bombones rellenos de dulce de leche.", t: "" },
    { n: "Chocolate con Almendras", c: "chocolates", d: "Chocolate con almendras tostadas enteras.", t: "🔥 Destacado" },
    { n: "Chocolate Clásico", c: "chocolates", d: "Puro cacao seleccionado, intenso y cremoso.", t: "" },
    { n: "Chocolate Africano", c: "chocolates", d: "Semi amargo puro, sin lácteos.", t: "🌱 Vegano" },
    { n: "Jamaica", c: "chocolates", d: "Chocolate con toque caribeño y licor suave.", t: "" },
    { n: "Brasil Pepepe", c: "frutales", d: "Mango, banana y maracuyá al agua.", t: "🌱 Vegano" },
    { n: "Limón Natural", c: "frutales", d: "Limón exprimido fresco, liviano y refrescante.", t: "🌱 Vegano" },
    { n: "Frutilla al Agua", c: "frutales", d: "Pura pulpa de frutilla natural de estación.", t: "🌱 Vegano" }
  ];

  var SECCIONES = [
    { key: "cremas", label: "Cremas especiales" },
    { key: "dulces", label: "Dulces de leche" },
    { key: "chocolates", label: "Chocolates" },
    { key: "frutales", label: "Frutales al agua" }
  ];

  var POTES = [
    { key: "k025", label: "1/4 kilo", sub: "Para uno o para dos", max: 2, precio: 8000 },
    { key: "k050", label: "1/2 kilo", sub: "Ideal para compartir", max: 3, precio: 14000 },
    { key: "k100", label: "1 kilo", sub: "Para toda la familia", max: 4, precio: 23000, destacado: true }
  ];

  var PROMOS = [
    { id: "duo", label: "2 potes de 1/4 kilo", detalle: "Dos de 1/4 kg, sabores a elección de cada uno", comp: { k025: 2, k050: 0, k100: 0 }, lista: 16000, precio: 12800 },
    { id: "familiar", label: "1 kilo + 1/2 kilo", detalle: "Un pote de 1 kg y uno de 1/2 kg", comp: { k025: 0, k050: 1, k100: 1 }, lista: 37000, precio: 28000 }
  ];

  var CONFIG = {
    whatsapp: "5491162419013",
    alias: "antonysia.helados",
    cvu: "0000003100012345678901",
    titular: "Antonysia Helados",
    direccion: "Gabino Ezeiza 8679, Loma Hermosa",
    instagram: "antonysiahelados_",
    cucuruchos: 1500,
    envio: 2000,
    envioGratisDesde: 30000,
    maxPotes: 10,
    zonas: ["Loma Hermosa", "Tres de Febrero", "San Martín", "Caseros", "Villa Bosch"],
    horarios: "Jue y Vie 15:00–00:00 · Sáb y Dom 12:00–00:00"
  };

  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  function ars(n) { return "$" + (n || 0).toLocaleString("es-AR"); }

  function cerrado(date) { var d = (date || new Date()).getDay(); return d === 1 || d === 2 || d === 3; }

  /* Próximos días abiertos (jue, vie, sáb, dom) a partir de hoy. */
  function proximosDias(date) {
    var hoy = date || new Date(), out = [];
    for (var i = 1; i <= 7 && out.length < 4; i++) {
      var f = new Date(hoy.getTime() + i * 86400000), dow = f.getDay();
      if (dow >= 4 || dow === 0) {
        out.push({
          id: f.toISOString().slice(0, 10),
          label: DIAS[dow].slice(0, 3),
          num: f.getDate(),
          full: DIAS[dow] + " " + f.getDate()
        });
      }
    }
    return out;
  }

  function zonaReconocida(dir) {
    var t = (dir || "").toLowerCase().replace(/[íì]/g, "i").replace(/[áà]/g, "a");
    return CONFIG.zonas.some(function (z) {
      return t.indexOf(z.toLowerCase().replace(/í/g, "i").replace(/á/g, "a")) > -1;
    });
  }

  function subtotal(potes) {
    return potes.reduce(function (s, p) { return s + p.precio; }, 0);
  }

  function costoEnvio(sub) { return sub >= CONFIG.envioGratisDesde ? 0 : CONFIG.envio; }

  function total(potes, cucu) {
    var s = subtotal(potes) + (cucu ? CONFIG.cucuruchos : 0);
    return s + costoEnvio(s);
  }

  /* Mismo formato de mensaje que el sitio actual, extendido a varios potes. */
  function mensajeWhatsApp(o) {
    var m = "👋 ¡Hola Antonysia! Quiero confirmar el siguiente pedido:%0A%0A";
    o.potes.forEach(function (p, i) {
      m += "🍧 *Pote " + (i + 1) + ":* " + p.label + "%0A";
      p.flavors.forEach(function (f) { m += "  • " + f + "%0A"; });
    });
    if (o.cucu || o.vasitos) {
      m += "%0A➕ *Adicionales:*%0A";
      if (o.cucu) m += "  • Pack 4 cucuruchos crocantes (+" + ars(CONFIG.cucuruchos) + ")%0A";
      if (o.vasitos) m += "  • Vasitos y cucharitas extra (gratis)%0A";
    }
    var sub = subtotal(o.potes) + (o.cucu ? CONFIG.cucuruchos : 0) - (o.descuento || 0);
    var env = costoEnvio(sub);
    if (o.promoLabel) m += "%0A🏷️ *Promo:* " + o.promoLabel + " (–" + ars(o.descuento) + ")%0A";
    m += "%0A🛵 *Envío:* " + (env ? ars(env) : "Bonificado") + "%0A";
    m += "💰 *Total:* " + ars(sub + env) + "%0A";
    m += "👤 *Cliente:* " + (o.nombre || "A coordinar") + "%0A";
    m += "📍 *Dirección de entrega:* " + o.dir + "%0A";
    m += "💳 *Método de pago:* " + o.pagoTexto + "%0A";
    if (o.dia) m += "📅 *Entrega programada:* " + o.dia + "%0A";
    if (o.notas) m += "📝 *Aclaraciones:* " + o.notas + "%0A";
    m += "%0A¿Me confirman recepción y tiempo estimado? ¡Gracias!";
    return "https://wa.me/" + CONFIG.whatsapp + "?text=" + m;
  }

  window.ANTONYSIA = {
    SABORES: SABORES, SECCIONES: SECCIONES, POTES: POTES, PROMOS: PROMOS, CONFIG: CONFIG,
    ars: ars, cerrado: cerrado, proximosDias: proximosDias, zonaReconocida: zonaReconocida,
    subtotal: subtotal, costoEnvio: costoEnvio, total: total, mensajeWhatsApp: mensajeWhatsApp
  };
})();
