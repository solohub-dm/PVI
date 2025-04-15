<?php
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "", "students_db");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "error" => "DB connection error"]);
    exit();
}

$studentId = $_POST['id'] ?? null;

if ($studentId === null) {
    echo json_encode(["success" => false, "error" => "Student ID is required"]);
    exit();
}

$query = "DELETE FROM students WHERE Id = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $studentId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Failed to delete student"]);
}

$stmt->close();
$mysqli->close();
?>