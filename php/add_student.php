<?php
header('Content-Type: application/json');

function generatePassword($length = 2) {
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $password = '';
    for ($i = 0; $i < $length; $i++) {
        $password .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $password;
}

$response = ['success' => false, 'errors' => []];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $group = $_POST['group'] ?? '';
    $firstName = $_POST['first_name'] ?? '';
    $lastName = $_POST['last_name'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $birthday = $_POST['birthday'] ?? '';
    $role = 'Student';
    $status = 0;
    $password = generatePassword();

    try {
        $pdo = new PDO("mysql:host=localhost;dbname=students_db;charset=utf8", "root", "");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "INSERT INTO students 
                (GroupName, FirstName, LastName, Gender, Birthday, Status, Role, Password)
                VALUES (:group, :firstName, :lastName, :gender, :birthday, :status, :role, :password)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':group' => $group,
            ':firstName' => $firstName,
            ':lastName' => $lastName,
            ':gender' => $gender,
            ':birthday' => $birthday,
            ':status' => $status,
            ':role' => $role,
            ':password' => $password
        ]);

        $response['success'] = true;
        $response['password'] = $password;

    } catch (PDOException $e) {
        $response['errors']['db'] = $e->getMessage();
    }
} else {
    $response['errors']['request'] = 'Invalid request method.';
}

echo json_encode($response);
