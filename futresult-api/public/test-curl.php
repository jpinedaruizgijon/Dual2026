<?php
$ch = curl_init('https://api.football-data.org/v4/competitions/PD/teams');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-Auth-Token: b8d30d3396f3400e8eaf7322ed505016']);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$result = curl_exec($ch);
$error  = curl_error($ch);
$info   = curl_getinfo($ch);
curl_close($ch);

echo 'HTTP Status: <b>' . $info['http_code'] . '</b><br>';
echo 'cURL Error: <b>' . ($error ?: 'ninguno') . '</b><br>';
echo '<hr>';
echo 'Respuesta: <pre>' . htmlspecialchars(substr($result ?: '', 0, 300)) . '</pre>';
