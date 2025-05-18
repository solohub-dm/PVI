<?php

require_once __DIR__ . '/../core/Session.php';
require_once __DIR__ . '/../services/validation_concrete/validationRegistr.php';
require_once __DIR__ . '/../services/avatarGenerator.php';

require_once __DIR__ . '/../models/users/User.php';
require_once __DIR__ . '/../models/users/Student.php';
require_once __DIR__ . '/../models/users/Teacher.php';

require_once __DIR__ . '/../models/structure/Group.php';

require_once __DIR__ . '/../models/tables/TeacherTables.php';
require_once __DIR__ . '/../models/tables/StudentTables.php';

class RegisterController
{
	public static function register()
	{
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

      $role = $_POST['role'] ?? '';
			$group_name = $_POST['group_name'] ?? '';
			$id_group = null;
			if ($role === 'student') {
				$group = Group::findByName($group_name);
				$id_group = $group ? $group->id : null;
			}

			$errors = validateRegistrationData($_POST, $id_group);
			if (!empty($errors)) {
					echo json_encode(['success' => false, 'errors' => $errors]);
					return;
			}

      $email = $_POST['email'] ?? '';
			$password = $_POST['password'] ?? '';
			$first_name = $_POST['first_name'] ?? '';
			$last_name = $_POST['last_name'] ?? '';
			$gender = $_POST['gender'] ?? '';
			$birthday = $_POST['birthday'] ?? '';

			$class = ($role === 'student') ? Student::class : Teacher::class;
			$existing = $class::findByEmail($email);
			if ($existing) {
				$errors['email'] = 'Email already exists.';
				echo json_encode(['success' => false, 'errors' => $errors]);
				return;
			}

			$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

			$data = [
				'email' => $email,
				'password' => $hashedPassword,
				'first_name' => $first_name,
				'last_name' => $last_name,
				'gender' => $gender,
				'birthday' => $birthday,
				'status' => 1
			];
			if ($role === 'student') {
					$data['group_name'] = $group_name;
					$data['id_group'] = $id_group;
			}

			$userId = $class::create($data);
			$user = $userId ? $class::findById($userId) : null;

			if ($user) {
				$user->role = $role;
				User::setRememberToken($user);

        $avatarPath = getGenerateAvatar($user);
        $class::updateAvatar($user->id, $avatarPath);
        $user->url_avatar = $avatarPath;
			 }
			
				$userData = [
					'id' => $user->id,
					'email' => $user->email,
					'first_name' => $user->first_name,
					'last_name' => $user->last_name,
					'url_avatar' => $user->url_avatar,
					'role' => $user->role,
          'birthday' => $user->birthday,
          'gender' => $user->gender 
			];
			
			Session::set('user', $userData);
			
			echo json_encode(['success' => true, 'user' => $userData]);
		} else {
				echo json_encode(['success' => false, 'message' => 'Registration failed']);
		}
	}
}
