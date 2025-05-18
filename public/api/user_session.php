<?php
require_once '../../app/core/Session.php';

session_start();
header('Content-Type: application/json');
echo json_encode(['user' => $_SESSION['user'] ?? null]);