<?php
require_once __DIR__ . './User.php';

class Student extends User
{
    public const TABLE = 'students';
    public const ROLE = 'student';

    // public static function getStudentsByTable($id_table, $limit, $offset)
    // {
    //   $sql = "SELECT s.id, s.first_name, s.last_name, s.gender, s.birthday, s.status, s.group_name
    //           FROM students s
    //           JOIN students_tables st ON s.id = st.id_student
    //           JOIN tables t ON st.id_table = t.id
    //           WHERE st.id_table = ?
    //           ORDER BY s.last_name ASC, s.first_name ASC
    //           LIMIT ? OFFSET ?";

    //   $params = [$id_table, $limit, $offset];
    //   return static::findManyBySql($sql, $params);
    // }
    public static function getStudentsByIds($ids)
{
    if (empty($ids)) return [];
    $db = Database::connect();
    $in = implode(',', array_fill(0, count($ids), '?'));
    $sql = "SELECT s.id, s.first_name, s.last_name, s.gender, s.birthday, s.group_name, s.status
            FROM students s
            WHERE s.id IN ($in)";
    $stmt = $db->prepare($sql);
    $stmt->execute($ids);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

    public static function getStudentsCountByTable($tableId)
    {
        $db = Database::connect();
        $sql = "SELECT COUNT(*) as total
                FROM students s
                JOIN students_tables st ON s.id = st.id_student
                WHERE st.id_table = ?";

        $stmt = $db->prepare($sql);
        $stmt->execute([$tableId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? (int)$row['total'] : 0;
    }
    public static function getStudentsByTable($tableId, $limit, $offset)
    {
        $db = Database::connect();
        $limit = (int)$limit;
        $offset = (int)$offset;
        $sql = "SELECT s.id, s.first_name, s.last_name, s.gender, s.birthday, s.group_name, s.status
            FROM students s
            JOIN students_tables st ON s.id = st.id_student
            WHERE st.id_table = ?
            ORDER BY s.last_name ASC, s.first_name ASC
            LIMIT $limit OFFSET $offset";
        $stmt = $db->prepare($sql);
        $stmt->execute([$tableId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getStudentsStatusByTable($id_table, $last_update, $limit, $offset)
    {
    $db = Database::connect();
    $limit = (int)$limit;
    $offset = (int)$offset;
    $sql = "SELECT s.id, s.status, s.status_updated_at
            FROM students s
            JOIN students_tables st ON s.id = st.id_student
            WHERE st.id_table = ?
            " . ($last_update ? "AND s.status_updated_at > ? " : "") . "
            ORDER BY s.last_name ASC, s.first_name ASC
            LIMIT $limit OFFSET $offset";
    $params = [$id_table];
    if ($last_update) $params[] = $last_update;
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}