<?php

require_once __DIR__ . '/../models/users/Student.php';
require_once __DIR__ . '/../models/tables/StudentTables.php';

class TableController
{
    public static function addStudents($tableId, $studentIds)
    {
        foreach ($studentIds as $studentId) {
            StudentsTableConnect::create([
                'id_table' => $tableId,
                'id_student' => $studentId
            ]);
        }
        return true;
    }

    public static function removeStudents($tableId, $studentIds)
    {
        foreach ($studentIds as $studentId) {
            StudentsTableConnect::deleteByTableAndUser($tableId, $studentId);
        }
        return true;
    }

    public static function getStudentsByIds($ids)
{
    return Student::getStudentsByIds($ids);
}

    public static function getStudents($tableId, $limit, $offset)
    {
        return Student::getStudentsByTable($tableId, $limit, $offset);
    }

    public static function getStudentsStatusUpdated($tableId, $lastUpdate, $limit, $offset)
    {
        return Student::getStudentsStatusByTable($tableId, $lastUpdate, $limit, $offset);
    }

    public static function getFullInfoById($id_table)
    {
        return Table::getFullInfoById($id_table);
    }
}