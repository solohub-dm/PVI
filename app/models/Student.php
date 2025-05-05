<?php
require_once __DIR__ . './User.php';
class Student {
    
  public const TABLE = 'students';
  public const ROLE = 'student';

  public static function findByNamePart($part) {
    $results = User::findByNamePart(Student::TABLE, $part);
    return $results;
  }
  
  public static function findById($id) {
    $student = User::findById(Student::TABLE, $id);
    return $student;
  }

  public static function setStatus($id, $status) {
    User::setStatus(Student::TABLE, $id, $status);
  }
}
 

  // public static function create($email, $password, $firstName, $lastName, $gender, $birthday, $idGroup) {
  //   $studentId = User::create(Student::$table, [
  //     'email' => $email,
  //     'password' => $password,
  //     'first_name' => $firstName,
  //     'last_name' => $lastName,
  //     'gender' => $gender,
  //     'birthday' => $birthday,
  //     'id_group' => $idGroup
  //   ]);

  //   return $studentId;
  // }