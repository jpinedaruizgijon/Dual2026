<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

$path   = $_GET['path'] ?? '';
$params = $_GET;
unset($params['path']);

if (empty($path)) {
    http_response_code(400);
    echo json_encode(['error' => 'path requerido']);
    exit;
}

$url = 'https://api.football-data.org/v4/' . ltrim($path, '/');
if ($params) {
    $url .= '?' . http_build_query($params);
}

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-Auth-Token: b8d30d3396f3400e8eaf7322ed505016']);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);

$body     = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpCode);
echo $body ?: '{}';
