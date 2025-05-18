<?php
require_once '../../app/controllers/ProfileController.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? null;

switch ($action) {
    case 'regenerateAvatar':
        ProfileController::regenerateAvatar();
        break;
    case 'uploadAvatar':
        ProfileController::uploadAvatar();
        break;
    case 'updateData':
        ProfileController::updateData();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Unknown action']);
}