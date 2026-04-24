// ============================================================
// MODELO FAVORITO
// Define la estructura de datos de un equipo favorito.
// El signo ? indica que el campo es opcional (puede no existir
// aún cuando estamos creando un registro nuevo sin id)
// ============================================================
export interface Favorito {
  id?:        number;   // Lo asigna la base de datos, no lo enviamos al crear
  equipo:     string;   // Nombre del equipo (ej: "Real Madrid")
  liga:       string;   // Liga a la que pertenece (ej: "LaLiga")
  pais:       string;   // País del equipo
  nota:       string;   // Nota personal del usuario sobre el equipo
}
