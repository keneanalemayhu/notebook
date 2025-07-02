<!-- backend/notes/update.php -->

<?php
require '../db.php';
require '../cors.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $_GET['id'] ?? null;

if (!$id) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing ID']);
  exit;
}

$title = $data['title'] ?? '';
$content = $data['content'] ?? '';
$badge_label = $data['badge']['label'] ?? null;
$badge_variant = $data['badge']['variant'] ?? null;

$stmt = $conn->prepare("UPDATE notes SET title=?, content=?, badge_label=?, badge_variant=? WHERE id=?");
$stmt->bind_param("ssssi", $title, $content, $badge_label, $badge_variant, $id);
$stmt->execute();

echo json_encode(['success' => true]);
