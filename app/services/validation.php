<?php

function isNotEmpty($value) {
  return isset($value) && trim($value) !== '';
}

function isValidName($name) {
  $pattern = "/^[A-Z]([a-z`']{1,17})?[a-z](-[A-Z]([a-z`']{0,17})?[a-z])?$/";
  return preg_match($pattern, $name)  === 1;
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
  $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
  if ($day < 1 || $day > $daysInMonth) return false;
  return true;
}

function isValidEmail($email, $role = 'student') {
  if ($role === 'student') {
    $pattern = "/^([a-z`']+)\.([a-z`']+)\.([a-z`']{1,4})\.(\d{4})@lpnu\.ua$/i";
  } else {
    $pattern = "/^[a-z0-9-.]+@lpnu\.ua$/i";
  }
  return preg_match($pattern, $email) === 1;
}

function isValidGender($gender) {
  return in_array($gender, ['Male', 'Female']);
}

