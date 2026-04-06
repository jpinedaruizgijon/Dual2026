# BiblioLaravel - Sistema de Alquiler de Libros

Aplicacion CRUD desarrollada con Laravel para gestionar un catalogo de libros con sistema de alquileres.

## Requisitos

- PHP 8.2 o superior
- Composer
- MySQL / MariaDB

## Instalacion

### 1. Crear el proyecto Laravel

```bash
laravel new bibliolaravel
cd bibliolaravel
```

### 2. Copiar los archivos de este ZIP

Copia cada archivo en su ruta correspondiente dentro del proyecto Laravel recien creado.

### 3. Configurar la base de datos en .env

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bibliolaravel
DB_USERNAME=root
DB_PASSWORD=
```

Crear la base de datos vacia "bibliolaravel" en phpMyAdmin.

### 4. Ejecutar migraciones y seeders

```bash
# Solo migraciones
php artisan migrate

# Con 50 libros de prueba generados automaticamente
php artisan migrate:fresh --seed
```

### 5. Iniciar el servidor

```bash
php artisan serve
```

Abrir en el navegador: http://localhost:8000

---

## Rutas principales

| Ruta | Descripcion |
|---|---|
| /libros | Catalogo paginado con buscador |
| /libros/create | Formulario nuevo libro |
| /libros/{id} | Ficha detallada |
| /libros/{id}/edit | Editar libro |
| /alquileres | Listado de alquileres activos |
| /alquileres/create/{libro} | Registrar alquiler |

## Tablas

- libros: id, titulo, autor, isbn, genero, anio_publicacion, sinopsis, precio_dia, disponible, portada, timestamps
- alquileres: id, libro_id (FK), nombre_cliente, email_cliente, fecha_inicio, fecha_fin, timestamps
