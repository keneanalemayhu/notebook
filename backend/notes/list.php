<!-- backend/notes/list.php -->

<?php
require '../db.php';

$result = $conn->query("SELECT * FROM notes ORDER BY updated_at DESC");
$notes = [];

while ($row = $result->fetch_assoc()) {
  $row['badge'] = [
    'label' => $row['badge_label'],
    'variant' => $row['badge_variant']
  ];
  unset($row['badge_label'], $row['badge_variant']);
  $notes[] = $row;
}

echo json_encode($notes);
