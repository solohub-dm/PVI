<?php
require_once __DIR__ . '/../Model.php';

class Group extends Model
{
  public const TABLE = 'groups';

  public $id;
  // public $specialty_id;
  // public $group_year;
  // public $group_number;
  // public $name;

  // public function __construct($data = [])
  // {
  //   $this->id = $data['id'] ?? null;
  //   $this->specialty_id = $data['specialty_id'] ?? null;
  //   $this->group_year = $data['group_year'] ?? null;
  //   $this->group_number = $data['group_number'] ?? null;
  //   $this->name = $data['name'] ?? null;
  // }

  // public static function createGroup($specialty_id, $group_year, $group_number)
  // {
  //     $data = [
  //         'specialty_id' => $specialty_id,
  //         'group_year' => $group_year,
  //         'group_number' => $group_number
  //     ];
  //     return parent::create($data);
  // }

  public static function findByName($name)
  {
      return static::findOneBy('*', 'name = ?', [$name]);
  }

  // public static function findByNameStart($nameStart)
  // {
  //     return static::findManyBy('*', 'name LIKE ?', [$nameStart . '%']);
  // }


}