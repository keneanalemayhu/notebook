<!-- backend/notes/delete.php -->
 
<?php
require '../db.php';
require '../cors.php';

$id = $_GET['id'] ?? null;

if (!$id) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing ID']);
  exit;
}

$stmt = $conn->prepare("DELETE FROM notes WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(['success' => true]);
