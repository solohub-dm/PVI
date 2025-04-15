<?php
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "", "students_db");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "error" => "DB connection error"]);
    exit();
}

$sql = "SELECT GroupName, FirstName, LastName, Gender, Birthday, `Status`, Id FROM students WHERE Role != 'Teacher' OR Role IS NULL";
$result = $mysqli->query($sql);

$students = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
    echo json_encode(["success" => true, "students" => $students]);
} else {
    echo json_encode(["success" => false, "error" => "Query failed"]);
}

$mysqli->close();