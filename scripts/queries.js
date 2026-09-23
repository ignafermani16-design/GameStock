// ============================================================
// GameStock — Consultas MQL (Fase 2)
// Ejecutar en mongosh conectado a la base "gamestock"
// use gamestock
// ============================================================


// ============================================================
// PASO 3 — CONSULTAS DE LECTURA (READ)
// ============================================================

// ------------------------------------------------------------
// 1) Filtrado básico por coincidencia exacta
// Caso de negocio: el mostrador necesita ver rápido todos los
// juegos usados en stock (para ofrecerlos con descuento o
// controlar su condición física).
// ------------------------------------------------------------
db.productos.find({ estado: "usado" });


// ------------------------------------------------------------
// 2) Operadores de comparación ($gte, $lte, $in)
// Caso de negocio: mostrar productos "premium" (precio entre
// 40.000 y 70.000) disponibles solo para consolas de última
// generación (PS5 o Xbox Series X), útil para armar una
// vidriera de productos destacados.
// ------------------------------------------------------------
db.productos.find({
  precio: { $gte: 40000, $lte: 70000 },
  plataformaId: {
    $in: [
      ObjectId("650000000000000000000001"), // PS5
      ObjectId("650000000000000000000003")  // Xbox Series X
    ]
  }
});


// ------------------------------------------------------------
// 3) Acceso a propiedades anidadas con dot notation
// Caso de negocio: dentro de los juegos usados, buscar
// específicamente los que están en "Buena" condición de caja,
// para asegurar calidad al cliente antes de ofrecerlos.
// ------------------------------------------------------------
db.productos.find({ "condicion.caja": "Buena" });


// ------------------------------------------------------------
// 4) Proyección de campos específica (excluyendo _id)
// Caso de negocio: generar un listado liviano de "título +
// precio" para mostrar en una pantalla de catálogo, sin
// exponer el _id interno ni el resto de los campos.
// ------------------------------------------------------------
db.productos.find(
  { estado: "nuevo" },
  { titulo: 1, precio: 1, _id: 0 }
);


// ------------------------------------------------------------
// 5) Filtro de elementos dentro de un arreglo ($elemMatch)
// Caso de negocio: identificar ventas donde se vendió más de
// una unidad del mismo producto en un solo ítem (por ejemplo,
// para detectar compras mayoristas o de reventa).
// ------------------------------------------------------------
db.ventas.find({
  items: { $elemMatch: { cantidad: { $gte: 2 } } }
});


// ============================================================
// PASO 4 — ACTUALIZACIONES Y ELIMINACIÓN (UPDATE & DELETE)
// ============================================================

// ------------------------------------------------------------
// 1) $set — modificar un campo simple y añadir una propiedad nueva
// Caso de negocio: poner en oferta "Marvel's Spider-Man 2",
// bajando el precio de venta y marcando el producto como
// destacado en la vidriera de ofertas.
// ------------------------------------------------------------
db.productos.updateOne(
  { _id: ObjectId("650000000000000000000210") },
  {
    $set: {
      enOferta: true,
      precioOferta: 63000.00
    }
  }
);


// ------------------------------------------------------------
// 2) $inc — incrementar/decrementar un contador numérico
// Caso de negocio: al concretarse una venta de "God of War
// Ragnarök", se descuenta automáticamente 1 unidad del stock
// disponible, sin necesidad de leer el valor actual y
// reescribirlo manualmente (operación atómica).
// ------------------------------------------------------------
db.productos.updateOne(
  { _id: ObjectId("650000000000000000000201") },
  { $inc: { stock: -1 } }
);


// ------------------------------------------------------------
// 3) deleteOne — eliminación segura bajo un filtro estricto
// Caso de negocio: un cliente de prueba (cuenta duplicada o
// solicitud de baja de cuenta) pide eliminar su registro. Se
// utiliza el email como criterio único y exacto para evitar
// borrar más de un documento por error.
// ------------------------------------------------------------
db.clientes.deleteOne({ email: "email.eliminar@mail.com" });
