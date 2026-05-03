<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $pdo = new PDO('sqlite:' . __DIR__ . '/../database/database.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

switch ($method) {

    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare('SELECT * FROM favoritos WHERE id = ?');
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if ($row) {
                echo json_encode($row);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'No encontrado']);
            }
        } else {
            $stmt = $pdo->query('SELECT * FROM favoritos ORDER BY id ASC');
            echo json_encode($stmt->fetchAll());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $now  = date('Y-m-d H:i:s');
        $stmt = $pdo->prepare(
            'INSERT INTO favoritos (equipo, liga, pais, nota, created_at, updated_at)
             VALUES (:equipo, :liga, :pais, :nota, :created, :updated)'
        );
        $stmt->execute([
            ':equipo'  => $data['equipo'],
            ':liga'    => $data['liga'],
            ':pais'    => $data['pais'],
            ':nota'    => $data['nota'] ?? null,
            ':created' => $now,
            ':updated' => $now,
        ]);
        $newId = $pdo->lastInsertId();
        http_response_code(201);
        $stmt = $pdo->prepare('SELECT * FROM favoritos WHERE id = ?');
        $stmt->execute([$newId]);
        echo json_encode($stmt->fetch());
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $now  = date('Y-m-d H:i:s');
        $stmt = $pdo->prepare(
            'UPDATE favoritos SET equipo = :equipo, liga = :liga, pais = :pais,
             nota = :nota, updated_at = :updated WHERE id = :id'
        );
        $stmt->execute([
            ':equipo'  => $data['equipo'],
            ':liga'    => $data['liga'],
            ':pais'    => $data['pais'],
            ':nota'    => $data['nota'] ?? null,
            ':updated' => $now,
            ':id'      => $id,
        ]);
        $stmt = $pdo->prepare('SELECT * FROM favoritos WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch());
        break;

    case 'DELETE':
        $stmt = $pdo->prepare('DELETE FROM favoritos WHERE id = ?');
        $stmt->execute([$id]);
        http_response_code(204);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
