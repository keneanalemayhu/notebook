<!-- backend/notes/create.php -->

<?php
require '../db.php';

$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'] ?? '';
$content = $data['content'] ?? '';
$badge_label = $data['badge']['label'] ?? null;
$badge_variant = $data['badge']['variant'] ?? null;

$stmt = $conn->prepare("INSERT INTO notes (title, content, badge_label, badge_variant) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $title, $content, $badge_label, $badge_variant);
$stmt->execute();

echo json_encode(['id' => $stmt->insert_id]);
