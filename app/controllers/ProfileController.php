<?php

require_once __DIR__ . '/../models/users/User.php';
require_once __DIR__ . '/../models/users/Student.php';
require_once __DIR__ . '/../models/users/Teacher.php';

require_once __DIR__ . '/../services/validation_concrete/validationProfile.php'; 
require_once __DIR__ . '/../services/avatarGenerator.php';

class ProfileController
{
  public static function regenerateAvatar() {
    session_start();
    $user = $_SESSION['user'] ?? null;
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Not authorized']);
        return;
    }

    $class = $user['role'] === 'student' ? Student::class : Teacher::class;
    $userId = $user['id'];
    $userObj = $class::findById($userId);
    if (!$userObj) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        return;
    }

    $newAvatarPath = getGenerateAvatar($userObj);
    $class::updateAvatar($userId, $newAvatarPath);
    $_SESSION['user']['url_avatar'] = $newAvatarPath;
    echo json_encode([
        'success' => true,
        'user' => $_SESSION['user'],
        'updateLocalStorage' => true
    ]);
}

public static function uploadAvatar() {
    session_start();
    $user = $_SESSION['user'] ?? null;
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Not authorized']);
        return;
    }
    if (!isset($_FILES['avatar'])) {
        echo json_encode(['success' => false, 'message' => 'No file uploaded']);
        return;
    }

    $class = $user['role'] === 'student' ? Student::class : Teacher::class;
    $userId = $user['id'];
    $userObj = $class::findById($userId);
    if (!$userObj) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        return;
    }
    $result = uploadAvatarSave($userObj, $_FILES['avatar']);
    if (isset($result['error'])) {
        echo json_encode(['success' => false, 'message' => $result['error']]);
        return;
    }

    $class::updateAvatar($userId, $result);
    $_SESSION['user']['url_avatar'] = $result;
    echo json_encode([
        'success' => true,
        'user' => $_SESSION['user'],
        'updateLocalStorage' => true
    ]);
}

  public static function updateData()
{
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    $user = $_SESSION['user'] ?? null;
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Not authorized']);
        return;
    }

    $errors = validateProfileData($_POST);
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'errors' => $errors]);
        return;
    }

    $first_name = $_POST['first_name'] ?? '';
    $last_name = $_POST['last_name'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $birthday = $_POST['birthday'] ?? '';
    $password = $_POST['password'] ?? '';

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $data = [
      'first_name' => $first_name,
      'last_name' => $last_name,
      'gender' => $gender,
      'birthday' => $birthday,
      'password' => $hashedPassword
    ];
    
    $fields = [];
    foreach ($data as $k => $v) {
      if (in_array($k, ['first_name', 'last_name', 'gender', 'birthday', 'password'])) {
          $fields[$k] = $v;
      }
    }

    if (!empty($fields)) {
        $class = $user['role'] === 'student' ? Student::class : Teacher::class;
        $userId = $user['id'];
        $class::updateUserDataFields($userId, $fields);

        foreach ($fields as $k => $v) {
            if ($k !== 'password') {
              $_SESSION['user'][$k] = $v;
            }
        }
    }

    echo json_encode([
      'success' => true,
      'user' => $_SESSION['user'],
      'updateLocalStorage' => true
    ]);
  }
}
}