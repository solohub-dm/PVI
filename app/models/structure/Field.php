<?php
require_once __DIR__ . '/../Model.php';

class Field extends Model
{
    public const TABLE = 'fields';

    // public $id;
    // public $full_name;

    // public function __construct($data = [])
    // {
    //     $this->id = $data['id'] ?? null;
    //     $this->full_name = $data['full_name'] ?? null;
    // }

    // public static function createField($id, $full_name)
    // {
    //     $data = [
    //         'id' => $id,
    //         'full_name' => $full_name
    //     ];
    //     return parent::create($data);
    // }
}

