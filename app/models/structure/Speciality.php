<?php
require_once __DIR__ . '/../Model.php';

class Specialty extends Model
{
  public const TABLE = 'specialties';

  // public $id;
  // public $field_id;
  // public $short_name;
  // public $full_name;

  // public function __construct($data = [])
  // {
  //     $this->id = $data['id'] ?? null;
  //     $this->field_id = $data['field_id'] ?? null;
  //     $this->short_name = $data['short_name'] ?? null;
  //     $this->full_name = $data['full_name'] ?? null;
  // }

  // public static function createSpecialty($id, $field_id, $short_name, $full_name)
  // {
  //     $data = [
  //         'id' => $id,
  //         'field_id' => $field_id,
  //         'short_name' => $short_name,
  //         'full_name' => $full_name
  //     ];
  //     return parent::create($data);
  // }
}