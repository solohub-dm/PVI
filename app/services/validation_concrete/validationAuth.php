<?php
require_once __DIR__ . './../validation.php';

function validateAuthData($data) {
  $errors = [];

  if (isEmpty($data['email'])) {
    $errors['email'] = 'Email is required.';
  } elseif (!isValidEmailGeneral($data['email'])) {
    $errors['email'] = 'Invalid email format.';
    
  } elseif (isEmpty($data['password'])) {
    $errors['password'] = 'Password is required.';
  } elseif (!isValidPassword($data['password'])) {
    $errors['password'] = 'Invalid password format.';
  }

  return $errors;
}