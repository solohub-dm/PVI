<?php
require_once __DIR__ . '/../Model.php';

abstract class User extends Model
{
  public const TABLE = 'users';
  public const ROLE = '';

  public $id;
  public $password;
  public $first_name;
  public $last_name;
  public $email;
  public $url_avatar;
  public $role;

  public static function setRememberToken($user)
  {
      $db = Database::connect();
      
    if (is_array($user)) {
        $user_id = $user['id'] ?? null;
        $user_type = $user['role'] ?? null;
    } else {
        $user_id = $user->id ?? null;
        $user_type = $user->role ?? null;
    }

    if (!$user_id || !$user_type) {
        throw new Exception('User id or role is missing for remember token');
    }

      $token = bin2hex(random_bytes(32));
      $expires = date('Y-m-d H:i:s', time() + 60*60*24*30);
  
      $stmt = $db->prepare("SELECT token FROM remember_tokens WHERE user_id = ? AND user_type = ?");
      $stmt->execute([$user_id, $user_type]);
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
  
      if ($row) {
          $db->prepare("UPDATE remember_tokens SET token = ?, expires_at = ? WHERE user_id = ? AND user_type = ?")
              ->execute([$token, $expires, $user_id, $user_type]);
      } else {
          $db->prepare("INSERT INTO remember_tokens (user_id, user_type, token, expires_at) VALUES (?, ?, ?, ?)")
              ->execute([$user_id, $user_type, $token, $expires]);
      }
  
      setcookie('remember_token', $token, time() + 60*60*24*30, '/', '', false, true);
      setcookie('remember_user_type', $user_type, time() + 60*60*24*30, '/', '', false, true);
      setcookie('remember_user_id', $user_id, time() + 60*60*24*30, '/', '', false, true);
  }

  public static function removeRememberToken()
  {
      if (isset($_COOKIE['remember_token'], $_COOKIE['remember_user_type'], $_COOKIE['remember_user_id'])) {
          $db = Database::connect();
          $token = $_COOKIE['remember_token'];
          $user_type = $_COOKIE['remember_user_type'];
          $user_id = $_COOKIE['remember_user_id'];
  
          error_log("Removing token: $token, type: $user_type, id: $user_id"); // Додаємо логування
  
          $stmt = $db->prepare("DELETE FROM remember_tokens WHERE token = ? AND user_type = ? AND user_id = ?");
          $stmt->execute([$token, $user_type, $user_id]);
  
          setcookie('remember_token', '', time() - 3600, '/', '', false, true);
          setcookie('remember_user_type', '', time() - 3600, '/', '', false, true);
          setcookie('remember_user_id', '', time() - 3600, '/', '', false, true);
  
          error_log('Cookies after removal: ' . print_r($_COOKIE, true)); // Додаємо логування
      } else {
          error_log('No remember_token cookies found for removal');
      }
  }
  
  public static function getFindByNamePartSql($part)
  {

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

    return [implode(' AND ', $where), $params];
  }
  
  public static function findViewByNamePart($part)
  {
    [$sqlWhere, $sqlParams] = static::getFindByNamePartSql($part);
    $fields = 'id, email, first_name, last_name, url_avatar';
    return static::findManyBy($fields, $sqlWhere, $sqlParams);
  }

  public static function findViewAll() {
    $fields = 'id, email, first_name, last_name, url_avatar';
    return static::findManyBy($fields, 1, []);
  }

  public static function findByEmail($email)
  {
    return static::findOneBy('*', 'email = ?', [$email]);
  }

  public static function setStatus($id, $status)
  {
    $db = Database::connect();
    $stmt = $db->prepare("UPDATE `" . static::TABLE . "` SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);
    return $stmt->rowCount() > 0;
  }

  public static function updateAvatar($id, $avatarPath)
  {
      $db = Database::connect();
      $stmt = $db->prepare("UPDATE `" . static::TABLE . "` SET url_avatar = ? WHERE id = ?");
      $stmt->execute([$avatarPath, $id]);
      return $stmt->rowCount() > 0;
  }

public static function updateUserDataFields($id, $fields)
  {
    $allowed = ['password', 'first_name', 'last_name', 'gender', 'birthday'];
    $set = [];
    $params = [];

    foreach ($fields as $key => $value) {
        if (in_array($key, $allowed)) {
            $set[] = "$key = ?";
            $params[] = $value;
        }
    }

    if (empty($set)) {
        throw new Exception('No valid fields to update');
    }

    $params[] = $id;

    $db = Database::connect();
    $sql = "UPDATE `" . static::TABLE . "` SET " . implode(', ', $set) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    return $stmt->execute($params);
  }
}