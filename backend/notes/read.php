<!-- backend/notes/read.php -->

<?php
require '../db.php';

$id = $_GET['id'] ?? null;

if (!$id) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing ID']);
  exit;
}

$stmt = $conn->prepare("SELECT * FROM notes WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$note = $result->fetch_assoc();

if (!$note) {
  http_response_code(404);
  echo json_encode(['error' => 'Note not found']);
  exit;
}

$note['badge'] = [
  'label' => $note['badge_label'],
  'variant' => $note['badge_variant']
];

unset($note['badge_label'], $note['badge_variant']);

echo json_encode($note);
