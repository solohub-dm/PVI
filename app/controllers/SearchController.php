<?php
require_once __DIR__ . '/../models/users/User.php';
require_once __DIR__ . '/../models/users/Student.php';
require_once __DIR__ . '/../models/users/Teacher.php';

class SearchController
{
  private static function limitResults($results, $limit)
  {
      $count = count($results);
      if ($count > $limit) {
          $results = array_slice($results, 0, $limit);
      }
      return [
          'count' => min($count, $limit),
          'results' => $results
      ];
  }
  
  public static function searchUsers($query, $limit = 10)
  {
      $results = User::findByNamePart($query);
      return self::limitResults($results, $limit);
  }
  
  public static function searchStudents($query, $limit = 10)
  {
      $results = Student::findByNamePart($query);
      return self::limitResults($results, $limit);
  }
  
  public static function searchTeachers($query, $limit = 10)
  {
      $results = Teacher::findByNamePart($query);
      return self::limitResults($results, $limit);
  }
}