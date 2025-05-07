<?php
require_once __DIR__ . './UserTable.php';

class TeachersTableConnect extends UserTableConnect
{
    public const TABLE = 'teachers_tables';
    public const USER_ID_FIELD = 'id_teacher';
    // public $id_teacher;

}