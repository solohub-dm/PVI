<?php
require_once __DIR__ . '/../models/users/User.php';
require_once __DIR__ . '/../models/users/Student.php';
require_once __DIR__ . '/../models/users/Teacher.php';
require_once __DIR__ . '/../core/Session.php';
require_once __DIR__ . '/../services/validationAuth.php';

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

      $user = Student::findByEmail($email);
      if (!$user) {
          $user = Teacher::findByEmail($email);
      }

      if ($user && password_verify($password, $user->password)) {

				$userClass = get_class($user);
        $user->role = $userClass::ROLE;
        User::setRememberToken($user);

        $userData = [
          'id' => $user->id,
          'email' => $user->email,
          'first_name' => $user->first_name,
          'last_name' => $user->last_name,
          'url_avatar' => $user->url_avatar,
          'role' => $user->role
        ];

        $user::setStatus($user->id, 1); 

        Session::set('user', $userData);

        echo json_encode(['success' => true, 'user' => $userData]);
        exit;
      } else {
        echo json_encode(['success' => false, 'message' => 'Невірні дані']);
        exit;
      }
    }
  }

  public static function logout()
  {
    session_start(); 
    $user = Session::get('user'); 

    if ($user) {
      // $class = get_class($user);
      // $class::setStatus($user->id, 0);  
      if (isset($user['role']) && isset($user['id'])) {
        $class = $user['role'] === 'student' ? Student::class : Teacher::class;
        $class::setStatus($user['id'], 0);
      }
    } else {
      echo "Користувача не знайдено у сесії.";
    }

    User::removeRememberToken();
    Session::destroy();
    header('Location: /auth.php');
    exit;
  }

  public static function checkAuth()
{
    $user = Session::get('user');
    if (!$user) {
        if (
            isset($_COOKIE['remember_token'], $_COOKIE['remember_user_type'], $_COOKIE['remember_user_id'])
        ) {
            $db = Database::connect();
            $token = $_COOKIE['remember_token'];
            $user_type = $_COOKIE['remember_user_type'];
            $user_id = $_COOKIE['remember_user_id'];

            $stmt = $db->prepare("SELECT user_id, expires_at FROM remember_tokens WHERE token = ? AND user_type = ? AND user_id = ?");
            $stmt->execute([$token, $user_type, $user_id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row && strtotime($row['expires_at']) > time()) {
                $new_expires = date('Y-m-d H:i:s', time() + 60*60*24*30);
                $db->prepare("UPDATE remember_tokens SET expires_at = ? WHERE token = ? AND user_type = ? AND user_id = ?")
                    ->execute([$new_expires, $token, $user_type, $user_id]);

                if ($user_type === 'student') {
                    $user = Student::findById($row['user_id']);
                } else {
                    $user = Teacher::findById($row['user_id']);
                }
                if ($user) {
                    $userData = [
                        'id' => $user->id,
                        'email' => $user->email,
                        'first_name' => $user->first_name,
                        'last_name' => $user->last_name,
                        'url_avatar' => $user->url_avatar,
                        'role' => $user_type
                    ];
                    Session::set('user', $userData);
                } else {
                  header('Location: /website/public/auth.php');
                    exit;
                }
            } else {
              header('Location: /website/public/auth.php');
                exit;
            }
        } else {
          header('Location: /website/public/auth.php');
            exit;
        }
    }
}
}
