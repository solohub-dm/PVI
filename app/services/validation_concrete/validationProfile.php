<?php
require_once __DIR__ . './../validation.php';

function validateProfileData($data) {
  $errors = [];

  if (isEmpty($data['first_name'] ?? '')) {
    $errors['first_name'] = 'First name is required.';
  } elseif (!isValidName($data['first_name'])) {
    $errors['first_name'] = 'Invalid first name format.';

  } elseif (isEmpty($data['last_name'] ?? '')) {
    $errors['last_name'] = 'Last name is required.';
  } elseif (!isValidName($data['last_name'])) {
    $errors['last_name'] = 'Invalid last name format.';

  } elseif (isEmpty($data['birthday'] ?? '')) {
      $errors['birthday'] = 'Birthday is required.';
  } elseif (!isValidDate($data['birthday'])) {
      $errors['birthday'] = 'Invalid birthday.';

  } elseif (isEmpty($data['gender'] ?? '')) {
    $errors['gender'] = 'Gender is required.';
  } elseif (!isValidGender($data['gender'])) {
    $errors['gender'] = 'Invalid gender.';
  
  } elseif ($data['password'] !== '' && $data['password_repeat'] !== '') {
    if (isEmpty($data['password'] ?? '')) {
      $errors['password'] = 'Password is required.';
    } elseif (!isValidPassword($data['password'])) {
      $errors['password'] = 'Invalid password format.';

    } elseif (isEmpty($data['password_repeat'] ?? '')) {
      $errors['password_repeat'] = 'Password repeat is required.';
    } elseif (($data['password'] ?? '') !== ($data['password_repeat'] ?? '')) {
      $errors['password_repeat'] = 'Passwords do not match.';
    }
  }

  return $errors;
}