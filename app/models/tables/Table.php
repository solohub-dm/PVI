<?php
require_once __DIR__ . '/../Model.php';

class Table extends Model
{
    public const TABLE = 'tables';

    // public $id;
    // public $name;
    // public $description;
    // public $created_at;
    // public $status_updated_at_student;
    // public $data_updated_at_student;
    // public $joined_at_student;
    
    public static function deleteById($id)
    {
        $db = Database::connect();
        $stmt = $db->prepare("DELETE FROM `" . static::TABLE . "` WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public static function updateNameDescription($id, $name, $description)
    {
        $db = Database::connect();
        $stmt = $db->prepare("UPDATE `" . static::TABLE . "` SET name = ?, description = ? WHERE id = ?");
        return $stmt->execute([$name, $description, $id]);
    }

    public static function getFullInfoById($id_table)
    {
        $db = Database::connect();
        $stmt = $db->prepare("
            SELECT 
                t.id, 
                t.name, 
                t.description,
                GROUP_CONCAT(DISTINCT CONCAT_WS('|', s.id, s.first_name, s.last_name, s.url_avatar) SEPARATOR ';') AS students,
                GROUP_CONCAT(DISTINCT CONCAT_WS('|', te.id, te.first_name, te.last_name, te.url_avatar) SEPARATOR ';') AS teachers
            FROM `tables` t
            LEFT JOIN students_tables st ON t.id = st.id_table
            LEFT JOIN students s ON st.id_student = s.id
            LEFT JOIN teachers_tables tt ON t.id = tt.id_table
            LEFT JOIN teachers te ON tt.id_teacher = te.id
            WHERE t.id = ?
            GROUP BY t.id
        ");
        $stmt->execute([$id_table]);
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$row) return null;

        $students = [];
        if (!empty($row['students'])) {
            foreach (explode(';', $row['students']) as $studentStr) {
                list($id, $first_name, $last_name, $url_avatar) = explode('|', $studentStr);
                if ($id !== '') {
                    $students[] = [
                        'id' => $id,
                        'first_name' => $first_name,
                        'last_name' => $last_name,
                        'url_avatar' => $url_avatar
                    ];
                }
            }
        }

        $teachers = [];
        if (!empty($row['teachers'])) {
            foreach (explode(';', $row['teachers']) as $teacherStr) {
                list($id, $first_name, $last_name, $url_avatar) = explode('|', $teacherStr);
                if ($id !== '') {
                    $teachers[] = [
                        'id' => $id,
                        'first_name' => $first_name,
                        'last_name' => $last_name,
                        'url_avatar' => $url_avatar
                    ];
                }
            }
        }

        return [
            'id' => $row['id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'students' => $students,
            'teachers' => $teachers
        ];
    }

public static function updateFullInfo($id, $name, $description, $studentsToAdd, $studentsToRemove, $teachersToAdd, $teachersToRemove)
{
    $db = Database::connect();
    $db->beginTransaction();

    try {
        // 1. Оновити name та description
        $stmt = $db->prepare("UPDATE `" . static::TABLE . "` SET name = ?, description = ? WHERE id = ?");
        $stmt->execute([$name, $description, $id]);

        // 2. Додати нових студентів
        if (!empty($studentsToAdd)) {
            $values = [];
            $params = [];
            foreach ($studentsToAdd as $studentId) {
                $values[] = "(?, ?)";
                $params[] = $id;
                $params[] = $studentId;
            }
            $sql = "INSERT INTO students_tables (id_table, id_student) VALUES " . implode(',', $values);
            $db->prepare($sql)->execute($params);
        }

        // 3. Видалити студентів
        if (!empty($studentsToRemove)) {
            $in = implode(',', array_fill(0, count($studentsToRemove), '?'));
            $params = array_merge([$id], $studentsToRemove);
            $sql = "DELETE FROM students_tables WHERE id_table = ? AND id_student IN ($in)";
            $db->prepare($sql)->execute($params);
        }

        // 4. Додати нових викладачів
        if (!empty($teachersToAdd)) {
            $values = [];
            $params = [];
            foreach ($teachersToAdd as $teacherId) {
                $values[] = "(?, ?)";
                $params[] = $id;
                $params[] = $teacherId;
            }
            $sql = "INSERT INTO teachers_tables (id_table, id_teacher) VALUES " . implode(',', $values);
            $db->prepare($sql)->execute($params);
        }

        // 5. Видалити викладачів
        if (!empty($teachersToRemove)) {
            $in = implode(',', array_fill(0, count($teachersToRemove), '?'));
            $params = array_merge([$id], $teachersToRemove);
            $sql = "DELETE FROM teachers_tables WHERE id_table = ? AND id_teacher IN ($in)";
            $db->prepare($sql)->execute($params);
        }

        $db->commit();
        return true;
    } catch (Exception $e) {
        $db->rollBack();
        return $e->getMessage();
    }
}


public static function createFullInfo($name, $description, $studentsToAdd, $teachersToAdd, $id_created_by)
{
    $db = Database::connect();
    $db->beginTransaction();

    try {
        // 1. Створити таблицю
        $stmt = $db->prepare("INSERT INTO `" . static::TABLE . "` (name, description, id_created_by) VALUES (?, ?, ?)");
        $stmt->execute([$name, $description, $id_created_by]);
        $tableId = $db->lastInsertId();

        // 2. Додати студентів
        if (!empty($studentsToAdd)) {
            $values = [];
            $params = [];
            foreach ($studentsToAdd as $studentId) {
                $values[] = "(?, ?)";
                $params[] = $tableId;
                $params[] = $studentId;
            }
            $sql = "INSERT INTO students_tables (id_table, id_student) VALUES " . implode(',', $values);
            $db->prepare($sql)->execute($params);
        }

        // 3. Додати викладачів
        if (!empty($teachersToAdd)) {
            $values = [];
            $params = [];
            foreach ($teachersToAdd as $teacherId) {
                $values[] = "(?, ?)";
                $params[] = $tableId;
                $params[] = $teacherId;
            }
            $sql = "INSERT INTO teachers_tables (id_table, id_teacher) VALUES " . implode(',', $values);
            $db->prepare($sql)->execute($params);
        }

        $db->commit();
        return $tableId;
    } catch (Exception $e) {
        $db->rollBack();
        return $e->getMessage();
    }
}
}