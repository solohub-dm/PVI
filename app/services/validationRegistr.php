<?php
require_once __DIR__ . './validation.php';

function validateRegistrationData($data) {
  $errors = [];
  
  if (!isNotEmpty($data['first_name'] ?? '')) {
    $errors['first_name'] = 'First name is required.';
  } elseif (!isValidName($data['first_name'])) {
    $errors['first_name'] = 'Invalid first name format.';
  }

  if (!isNotEmpty($data['last_name'] ?? '')) {
    $errors['last_name'] = 'Last name is required.';
  } elseif (!isValidName($data['last_name'])) {
    $errors['last_name'] = 'Invalid last name format.';
  }

  if (!isNotEmpty($data['birthday'] ?? '')) {
      $errors['birthday'] = 'Birthday is required.';
  } elseif (!isValidDate($data['birthday'])) {
      $errors['birthday'] = 'Invalid birthday.';
  }

  if (!isNotEmpty($data['email'] ?? '')) {
    $errors['email'] = 'Email is required.';
  } elseif (!isValidEmail($data['email'], $data['role'] ?? '')) {
    $errors['email'] = 'Invalid email format.';
  }

  if (!isNotEmpty($data['gender'] ?? '')) {
    $errors['gender'] = 'Gender is required.';
  } elseif (!isValidGender($data['gender'])) {
    $errors['gender'] = 'Invalid gender.';
  }

  if (($data['role'] ?? '') === 'student') {
    if (!isNotEmpty($data['id_group'] ?? '')) {
      $errors['id_group'] = 'Group is required for students.';
    }
    // TODO: Додати додаткову перевірку групи
  }

  if (!isNotEmpty($data['password'] ?? '')) {
    $errors['password'] = 'Password is required.';
  }
  if (!isNotEmpty($data['password_repeat'] ?? '')) {
    $errors['password_repeat'] = 'Password repeat is required.';
  } elseif (($data['password'] ?? '') !== ($data['password_repeat'] ?? '')) {
    $errors['password_repeat'] = 'Passwords do not match.';
  }

  return $errors;
}