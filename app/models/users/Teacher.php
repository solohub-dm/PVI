<?php
require_once __DIR__ . './User.php';

class Teacher extends User
{
  public const TABLE = 'teachers';
  public const ROLE = 'teacher';

}
