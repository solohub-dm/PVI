<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../core/Session.php';
require_once __DIR__ . '/../services/validationRegistr.php';

class RegisterController
{
	public function register()
	{
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

			$errors = validateRegistrationData($_POST);
			if (!empty($errors)) {
					echo json_encode(['success' => false, 'errors' => $errors]);
					return;
			}

      $role = $_POST['role'] ?? '';
      $email = $_POST['email'] ?? '';
			$password = $_POST['password'] ?? '';
			$first_name = $_POST['first_name'] ?? '';
			$last_name = $_POST['last_name'] ?? '';
			$gender = $_POST['gender'] ?? '';
			$birthday = $_POST['birthday'] ?? '';
			$id_group = $_POST['id_group'] ?? null;

			$table = ($role === 'student') ? 'students' : 'teachers';

			$existing = User::findByEmail($table, $email);
			if ($existing) {
				echo json_encode(['success' => false, 'message' => 'Email already exists']);
				return;
			}

			$data = [
				'email' => $email,
				'password' => $password,
				'first_name' => $first_name,
				'last_name' => $last_name,
				'gender' => $gender,
				'birthday' => $birthday
			];
			if ($role === 'student') {
					$data['id_group'] = $id_group;
			}

			$userId = User::create($table, $data);
			$user = $userId ? User::findById($table, $userId) : null;

			if ($user) {
					Session::set('user', $user);
					echo json_encode(['success' => true, 'user' => $user]);
			} else {
					echo json_encode(['success' => false, 'message' => 'Registration failed']);
			}
    }
	}
}