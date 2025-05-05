<?php
class Database {
  private static $connect = null;
  private static $config = null;

  private static function loadConfig() {
    if (self::$config === null) {
      self::$config = require __DIR__ . '/../config/config.php';
    }
  }

  public static function connect() {
    self::loadConfig();
    $cfg = self::$config;
    if (self::$connect === null) {
      try {
        self::$connect = new PDO(
          'mysql:host=' . $cfg['host'] . ';dbname=' . $cfg['dbname'] . ';charset=utf8',
          $cfg['username'],
          $cfg['password']
        );
        self::$connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      } catch (PDOException $e) {
        throw new Exception('Connection failed: ' . $e->getMessage());
      }
    }
    return self::$connect;
  }

  public static function disconnect() {
    self::$connect = null;
  }
}