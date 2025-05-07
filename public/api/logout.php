<?php

require_once '../../app/controllers/AuthController.php';
header('Content-Type: application/json');

AuthController::logout();