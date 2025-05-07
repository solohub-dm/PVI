<?php
require_once __DIR__ . '/../core/Database.php';

abstract class Model
{
    public const TABLE = '';

    protected static function getClass()
    {
        return static::class;
    }

    public static function fromArray(array $data)
    {
        if (static::class === User::class && isset($data['role'])) {
            if ($data['role'] === 'student') {
                return Student::fromArray($data);
            } elseif ($data['role'] === 'teacher') {
                return Teacher::fromArray($data);
            }
        }
        $obj = new static();
        foreach ($data as $key => $value) {
            $obj->$key = $value;
        }
        return $obj;
    }

    protected static function findOneBy($select = '*', $where  = 1, $params)
    {
        $sql = "SELECT $select FROM `" . static::TABLE . "` WHERE $where LIMIT 1";
        return static::findOneBySql($sql, $params);
    }

    protected static function findManyBy($select = '*', $where = 1, $params)
    {
        $sql = "SELECT $select FROM `" . static::TABLE . "` WHERE $where";
        return static::findManyBySql($sql, $params);
    }

    protected static function findManyBySql($sql, $params)
    {
        $db = Database::connect();
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
    
        $results = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $results[] = static::fromArray($row);
        }
        return $results;
    }

    protected static function findOneBySql($sql, $params) {
        $db = Database::connect();
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data ? static::fromArray($data) : null;
    }

    protected static function deleteOneBy($where = 1, $params = [])
    {
        $db = Database::connect();
        $sql = "DELETE FROM `" . static::TABLE . "` WHERE $where LIMIT 1";
        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }

    protected static function deleteManyBy($where = 1, $params = [])
    {
        $db = Database::connect();
        $sql = "DELETE FROM `" . static::TABLE . "` WHERE $where";
        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }

    public static function findById($id)
    {
      return static::findOneBy('*', 'id = ?', [$id]);
    }

    public static function deleteById($id)
    {
      return static::deleteOneBy('id = ?', [$id]);
    }

    public static function findAll()
    {
        return static::findOneBy('*', 1, []);
    }

    public static function create($data)
    {
        $db = Database::connect();

        $fields = array_keys($data);
        $placeholders = array_fill(0, count($fields), '?');
        $sql = "INSERT INTO `" . static::TABLE . "` (" . implode(',', $fields) . ") VALUES (" . implode(',', $placeholders) . ")";
        
        $stmt = $db->prepare($sql);
        $result = $stmt->execute(array_values($data));
        
        if ($result) {
          return $db->lastInsertId();
        } else {
            return false;
        }
    }
}