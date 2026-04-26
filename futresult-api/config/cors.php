<?php

return [

    // Rutas a las que se aplica la política CORS
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    // Permitimos peticiones desde el servidor de desarrollo de Angular (localhost:4200)
    // y desde el dominio de producción en Ruix.
    // En desarrollo Angular corre en el puerto 4200, por eso lo incluimos.
    'allowed_origins' => [
        'http://localhost:4200',
        'https://ruix.iesruizgijon.es/jpineda/futresult',
        'https://ruix.iesruizgijon.es',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
