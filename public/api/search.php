<?php
require_once '../../app/controllers/SearchController.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? null;
$query = $_POST['query'] ?? $_GET['query'] ?? '';
$limit = isset($_POST['limit']) ? (int)$_POST['limit'] : (isset($_GET['limit']) ? (int)$_GET['limit'] : 10);

switch ($action) {
    case 'searchUsers':
        echo json_encode(SearchController::searchUsers($query, $limit));
        break;
    case 'searchStudents':
        echo json_encode(SearchController::searchStudents($query, $limit));
        break;
    case 'searchTeachers':
        echo json_encode(SearchController::searchTeachers($query, $limit));
        break;
    case 'searchAllStudents':
        echo json_encode(SearchController::searchAllStudents($limit));
        break;
    case 'searchAllTeachers':
        echo json_encode(SearchController::searchAllTeachers( $limit));
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Unknown action']);
}