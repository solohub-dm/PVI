<?php
require_once '../../app/controllers/RegisterController.php';
header('Content-Type: application/json');

RegisterController::register();
