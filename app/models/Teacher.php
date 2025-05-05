<?php
require_once __DIR__ . './User.php';
class Teacher {

  public const TABLE = 'teachers';
  public const ROLE = 'teacher';

	public static function getTable() {
		return Teacher::TABLE;
	}

  public static function findByNamePart($part) {
    $results = User::findByNamePart(Teacher::TABLE, $part);
    return $results;
  }
  
  public static function findById($id) {
    $student = User::findById('students', $id);
    return $student;
  }

  public static function setStatus($id, $status) {
    User::setStatus(Teacher::TABLE, $id, $status);
  }
}
 

//   public static function create($email, $password, $firstName, $lastName, $gender, $birthday) {
//     $studentId = User::create('teachers', [
//         'email' => $email,
//         'password' => $password,
//         'first_name' => $firstName,
//         'last_name' => $lastName,
//         'gender' => $gender,
//         'birthday' => $birthday,
//     ]);

//     return $studentId;
//   }