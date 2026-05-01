<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo 'PATH_INFO: ' . ($_SERVER['PATH_INFO'] ?? 'NO EXISTE') . '<br>';
echo 'REQUEST_URI: ' . $_SERVER['REQUEST_URI'] . '<br>';
echo 'Memoria: ' . ini_get('memory_limit') . '<br>';
echo '<hr>';

try {
    require __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    echo 'Laravel boot: <b style="color:green">OK</b><br>';
} catch (\Throwable $e) {
    echo '<b style="color:red">ERROR: ' . $e->getMessage() . '</b><br>';
    echo 'En: ' . $e->getFile() . ':' . $e->getLine();
}
