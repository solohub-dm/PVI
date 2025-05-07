<?php
require_once __DIR__ . './UserTable.php';

class StudentsTableConnect extends UserTableConnect
{
    public const TABLE = 'students_tables';
    public const USER_ID_FIELD = 'id_student';

    // public $id_student;

}
