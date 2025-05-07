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

    // Видалення запису по id
    public static function deleteById($id)
    {
        $db = Database::connect();
        $stmt = $db->prepare("DELETE FROM `" . static::TABLE . "` WHERE id = ?");
        return $stmt->execute([$id]);
    }

    // Оновлення name та description по id
    public static function updateNameDescription($id, $name, $description)
    {
        $db = Database::connect();
        $stmt = $db->prepare("UPDATE `" . static::TABLE . "` SET name = ?, description = ? WHERE id = ?");
        return $stmt->execute([$name, $description, $id]);
    }
}