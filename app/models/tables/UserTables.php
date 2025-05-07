<?php
require_once __DIR__ . '/../Model.php';

abstract class UserTableConnect extends Model
{
  public const TABLE = '';
  public const USER_ID_FIELD = '';

  public static function findById($id)
  {
    throw new Exception('findById is not available for this model');
  }

  public static function deleteById($id)
  {
    throw new Exception('deleteById is not available for this model');
  }

  public static function findAllByUserId($id_user)
  {
    $userField = static::USER_ID_FIELD;
    return static::findManyBy('*', "$userField = ?", [$id_user]);
  }

  public static function findAllByTableId($id_table)
  {
    return static::findManyBy('*', "id_table = ?", [$id_table]);
  }

  public static function deleteByTableAndUser($id_table, $id_user)
  {
    $userField = static::USER_ID_FIELD;
    return static::deleteOneBy("id_table = ? AND $userField = ?", [$id_table, $id_user]);
  }

  public static function deleteManyByTableAndUserPairs($pairs)
  {
      if (empty($pairs)) return 0;

      $count = 0;
      foreach ($pairs as $pair) {
          [$id_table, $id_user] = $pair;
          static::deleteByTableAndUser($id_table, $id_user);
      }
      return $count;
  }

}

