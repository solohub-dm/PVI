<?php
header('Content-Type: application/json');

function isValidName($name) {
    if (preg_match("/^[A-Z]([a-z`']{1,17})?[a-z](-[A-Z]([a-z`']{0,17})?[a-z])?$/", $name)) {
        return true;
    }
    return false;
}

function isValidDate($date) {

    if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $date)) return false;

    list($year, $month, $day) = explode('-', $date);
    $year = (int)$year;
    $month = (int)$month;
    $day = (int)$day;

    $currentYear = (int)date("Y");
    if ($year < $currentYear - 80 || $year > $currentYear - 16) return false;
    if ($month < 1 || $month > 12) return false;
    if ($day < 1 || $day > cal_days_in_month(CAL_GREGORIAN, $month, $year)) return false;

    return true;
}

$response = ['valid' => false, 'errors' => []];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstName = $_POST['first-name'] ?? '';
    $lastName = $_POST['last-name'] ?? '';
    $birthday = $_POST['birthday'] ?? '';
    $group = $_POST['group'] ?? '';
    $gender = $_POST['gender'] ?? '';

    $field = $_POST['field'] ?? '';
    $value = $_POST['value'] ?? '';
    
    switch ($field) {
        case 'first-name':
        case 'last-name':
            $response['valid'] = isValidName($value);
            if (!$response['valid']) {
                $response['errors'][$field] = 'Invalid name format.';
            }
            break;

        case 'birthday':
            $response['valid'] = isValidDate($value);
            if (!$response['valid']) {
                $response['errors'][$field] = 'Invalid birthday.';
            }
            break;

        case 'group':
            $groups = ['PZ-21', 'PZ-22', 'PZ-23', 'PZ-24', 'PZ-25', 'PZ-26'];
            $response['valid'] = in_array($value, $groups);
            if (!$response['valid']) {
                $response['errors'][$field] = 'Unknown group.';
            }
            break;

        case 'gender':
            $genders = ['Male', 'Female'];
            $response['valid'] = in_array($value, $genders);
            if (!$response['valid']) {
                $response['errors'][$field] = 'Invalid gender.';
            }
            break;

        default:
            $response['errors'][$field] = 'Unknown field.';
    }
}

echo json_encode($response);
