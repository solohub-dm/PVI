<?php
require_once __DIR__ . '/../core/Database.php';
class User {

  private static $allowedTables = [Student::TABLE, Teacher::TABLE];

  protected static function getClassByTable($table) {
    switch ($table) {
        case Student::TABLE : return Student::class;
        case Teacher::TABLE : return Teacher::class;
        default: return self::class;
    }
}

  public static function findByNamePartAllTables($part) {
    $results = [];
    foreach (self::$allowedTables as $table) {
      $users = self::findByNamePart($table, $part);
      foreach ($users as $user) {
        $results[] = $user;
      }
    }
    return $results;
  }

  public static function findByNamePart($table, $part) {
    if (!self::isAllowedTable($table)) {
        throw new Exception('Invalid table name');
    }
    $db = Database::connect();

    $parts = preg_split('/\s+/', trim($part));
    $parts = array_slice($parts, 0, 2);

    $where = [];
    $params = [];

    if (count($parts) === 1) {
      $where[] = "(first_name LIKE ? OR last_name LIKE ?)";
      $params[] = $parts[0] . '%';
      $params[] = $parts[0] . '%';
    } elseif (count($parts) === 2) {
      $where[] = "(first_name = ? OR last_name = ?)";
      $params[] = $parts[0];
      $params[] = $parts[0];
      $where[] = "(first_name LIKE ? OR last_name LIKE ?)";
      $params[] = $parts[1] . '%';
      $params[] = $parts[1] . '%';
    }

    $sql = "SELECT * FROM `$table` WHERE " . implode(' AND ', $where);
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    $results = [];
    $class = static::getClassByTable($table);
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $user = new $class();
      foreach ($row as $key => $value) {
          $user->$key = $value;
      }
      $results[] = $user;
    }
    return $results;
  }

  public static function findByEmailAllTables($email) {
    foreach (self::$allowedTables as $table) {
        $user = self::findByEmail($table, $email);
        if ($user) {
            return $user;
        }
    }
    return null;
  }

  public static function findByEmail($table, $email) {
    if (!self::isAllowedTable($table)) {
        throw new Exception('Invalid table name');
    }
    $db = Database::connect();
    $stmt = $db->prepare("SELECT * FROM `$table` WHERE email = ?");
    $stmt->execute([$email]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($userData) {
      $class = static::getClassByTable($table);
      $user = new $class();
      foreach ($userData as $key => $value) {
          $user->$key = $value; 
      }
      return $user;
    } else {
      return null; 
    }
  }

  public static function create($table, $data) {
    if (!self::isAllowedTable($table)) {
        throw new Exception('Invalid table name');
    }

    $db = Database::connect();

    $fields = array_keys($data);
    $placeholders = array_fill(0, count($fields), '?');
    $sql = "INSERT INTO `$table` (" . implode(',', $fields) . ") VALUES (" . implode(',', $placeholders) . ")";

    $stmt = $db->prepare($sql);
    $result = $stmt->execute(array_values($data));

    if ($result) {
      return $db->lastInsertId();
    } else {
      return false;
    }
}
  
  public static function findById($table, $id) {
    if (!self::isAllowedTable($table)) {
        throw new Exception('Invalid table name');
    }
    $db = Database::connect();
    $stmt = $db->prepare("SELECT * FROM $table WHERE id = ?");
    $stmt->execute([$id]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($userData) {
      $class = static::getClassByTable($table);
      $user = new $class();
      foreach ($userData as $key => $value) {
          $user->$key = $value;
      }
      return $user;
    } else {
        return null;
    }
  }

  public static function setStatus($table, $id, $status) {
    if (!self::isAllowedTable($table)) {
        throw new Exception('Invalid table name');
    }
    $db = Database::connect();
    $stmt = $db->prepare("UPDATE $table SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);
    return $stmt;
  }

  private static function isAllowedTable($table) {
    return in_array($table, self::$allowedTables);
  }
}
 