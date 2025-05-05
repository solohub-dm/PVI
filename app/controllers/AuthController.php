<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../core/Session.php';
require_once __DIR__ . '/validationAuth.php';

class AuthController
{
  public static function login()
  {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

			$errors = validateAuthData($_POST);
      if (!empty($errors)) {
        echo json_encode(['success' => false, 'errors' => $errors]);
        return;
			}

      $email = $_POST['email'];
      $password = $_POST['password'];

      $user = User::findByEmailAllTables($email);

      if ($user && password_verify($password, $user->password)) {
        Session::set('user', $user);
        $user::setStatus($user->id, 1); 

        echo json_encode(['success' => true, 'user' => $user]);
        exit;
      } else {
        echo json_encode(['success' => false, 'message' => 'Невірні дані']);
        exit;
      }
    }
  }

  public function logout()
  {
    session_start(); 
    $user = Session::get('user'); 

    if ($user) {
      $user::setStatus($user->id, 0);  
    } else {
      echo "Користувача не знайдено у сесії.";
    }

    Session::destroy();
    header('Location: /website/public/intro.php');
    exit;
  }
}
