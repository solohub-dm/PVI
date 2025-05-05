<?php
require_once __DIR__ . './validation.php';

function validateAuthData($data) {
  $errors = [];

  if (!isNotEmpty($data['email'])) {
    $errors['email'] = 'Email is required.';
  }
  if (!isValidEmail($data['email'])) {
    $errors['email'] = 'Invalid email format.';
  }
  if (!isNotEmpty($data['password'])) {
    $errors['password'] = 'Password is required.';
  }

  return $errors;
}