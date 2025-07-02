<?php
$host = 'localhost';
$user = 'your_db_user';
$pass = 'your_db_password';
$db   = 'your_database_name';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

header('Content-Type: application/json');