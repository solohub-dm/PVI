<?php
require_once __DIR__ . './User.php';

class Student extends User
{
    public const TABLE = 'students';
    public const ROLE = 'student';

    public static function getStudentsByTable($id_table, $limit, $offset)
    {
      $sql = "SELECT s.id, s.first_name, s.last_name, s.gender, s.birthday, s.status, s.group_name
              FROM students s
              JOIN students_tables st ON s.id = st.id_student
              JOIN tables t ON st.id_table = t.id
              WHERE st.id_table = ?
              ORDER BY s.last_name ASC, s.first_name ASC
              LIMIT ? OFFSET ?";

      $params = [$id_table, $limit, $offset];
      return static::findManyBySql($sql, $params);
    }

    public static function getStudentsStatusByTable($id_table, $last_update, $limit, $offset)
    {
        $sql = "SELECT s.id, s.status
                FROM students s
                JOIN students_tables st ON s.id = st.id_student
                JOIN tables t ON st.id_table = t.id
                WHERE st.id_table = ?
                AND s.status_updated_at > ?
                ORDER BY s.last_name ASC, s.first_name ASC
                LIMIT ? OFFSET ?";

        $params = [$id_table, $last_update, $limit, $offset];
        return static::findManyBySql($sql, $params);
    }
}