<?php
require_once '../../app/controllers/TableController.php';
require_once '../../app/models/tables/Table.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? null;

switch ($action) {
    case 'getFullInfo':
        $tableId = $_POST['tableId'] ?? $_GET['tableId'] ?? null;
        if ($tableId) {
            $tableInfo = TableController::getFullInfoById($tableId);
            echo json_encode(['success' => true, 'data' => $tableInfo]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Table ID is required']);
        }
        break;
    case 'addStudents':
        $tableId = $_POST['tableId'] ?? null;
        $studentIds = $_POST['studentIds'] ?? [];
        $result = TableController::addStudents($tableId, $studentIds);
        echo json_encode(['success' => $result]);
        break;

    case 'removeStudents':
        $tableId = $_POST['tableId'] ?? null;
        $studentIds = $_POST['studentIds'] ?? [];
        $result = TableController::removeStudents($tableId, $studentIds);
        echo json_encode(['success' => $result]);
        break;

    case 'getStudents':
        $tableId = $_GET['tableId'] ?? null;
        $limit = (int)($_GET['limit'] ?? 10);
        $offset = (int)($_GET['offset'] ?? 0);
        $students = TableController::getStudents($tableId, $limit, $offset);
        $total = Student::getStudentsCountByTable($tableId);
        echo json_encode(['students' => $students, 'total' => $total]);
        break;

    case 'getStudentsStatusUpdated':
        $tableId = $_GET['tableId'] ?? null;
        $lastUpdate = $_GET['lastUpdate'] ?? null;
        $limit = (int)($_GET['limit'] ?? 10);
        $offset = (int)($_GET['offset'] ?? 0);
        $students = TableController::getStudentsStatusUpdated($tableId, $lastUpdate, $limit, $offset);
        $total = Student::getStudentsCountByTable($tableId);
        echo json_encode(['students' => $students, 'total' => $total]);
        break;

    case 'updateFullInfo':
        $tableId = $_POST['tableId'] ?? null;
        $name = $_POST['name'] ?? '';
        $description = $_POST['description'] ?? '';
        $studentsToAdd = $_POST['studentsToAdd'] ?? [];
        $studentsToRemove = $_POST['studentsToRemove'] ?? [];
        $teachersToAdd = $_POST['teachersToAdd'] ?? [];
        $teachersToRemove = $_POST['teachersToRemove'] ?? [];

        // Перетворення рядків у масиви, якщо потрібно
        if (is_string($studentsToAdd)) $studentsToAdd = json_decode($studentsToAdd, true);
        if (is_string($studentsToRemove)) $studentsToRemove = json_decode($studentsToRemove, true);
        if (is_string($teachersToAdd)) $teachersToAdd = json_decode($teachersToAdd, true);
        if (is_string($teachersToRemove)) $teachersToRemove = json_decode($teachersToRemove, true);

        $result = Table::updateFullInfo($tableId, $name, $description, $studentsToAdd, $studentsToRemove, $teachersToAdd, $teachersToRemove);
        if ($result === true) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $result]);
        }
        break;

    case 'createFullInfo':
        session_start();
        $user = $_SESSION['user'] ?? null;
        $id_created_by = ($user && $user['role'] === 'teacher') ? $user['id'] : null;
        
        $name = $_POST['name'] ?? '';
        $description = $_POST['description'] ?? '';
        $studentsToAdd = $_POST['studentsToAdd'] ?? [];
        $teachersToAdd = $_POST['teachersToAdd'] ?? [];

        if (is_string($studentsToAdd)) $studentsToAdd = json_decode($studentsToAdd, true);
        if (is_string($teachersToAdd)) $teachersToAdd = json_decode($teachersToAdd, true);

        $tableId = Table::createFullInfo($name, $description, $studentsToAdd, $teachersToAdd, $id_created_by);
        echo json_encode(['success' => (bool)$tableId, 'tableId' => $tableId]);
        break;
    case 'getUserTables':
        session_start();
        $user = $_SESSION['user'] ?? null;
        if (!$user) {
            echo json_encode(['success' => false, 'error' => 'Not authorized']);
            exit;
        }
        $userId = $user['id'];
        $role = $user['role'];
        if ($role === 'student') {
            $sql = "SELECT t.id, t.name, t.id_created_by FROM tables t
                    JOIN students_tables st ON t.id = st.id_table
                    WHERE st.id_student = ?";
            $params = [$userId];
        } else if ($role === 'teacher') {
$sql = "SELECT DISTINCT t.id, t.name, t.id_created_by FROM tables t
        WHERE t.id_created_by = ?
        OR t.id IN (SELECT id_table FROM teachers_tables WHERE id_teacher = ?)";
$params = [$userId, $userId];
        } else {
            echo json_encode(['success' => false, 'error' => 'Unknown role']);
            exit;
        }
        $db = Database::connect();
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $tables = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'tables' => $tables]);
        break;
    case 'deleteTable':
        session_start();
        $user = $_SESSION['user'] ?? null;
        $tableId = $_POST['tableId'] ?? null;

        if (!$user || !$tableId) {
            echo json_encode(['success' => false, 'message' => 'Not authorized or no table id']);
            break;
        }

        // Отримати таблицю
        $db = Database::connect();
        $stmt = $db->prepare("SELECT id_created_by FROM tables WHERE id = ?");
        $stmt->execute([$tableId]);
        $table = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$table) {
            echo json_encode(['success' => false, 'message' => 'Table not found']);
            break;
        }

        // Якщо користувач автор — видалити таблицю
        if ($user['id'] == $table['id_created_by']) {
            $result = Table::deleteById($tableId);
            echo json_encode(['success' => $result]);
            break;
        }

        // Якщо користувач не автор — видалити його зв'язок
        if ($user['role'] === 'student') {
            $stmt = $db->prepare("DELETE FROM students_tables WHERE id_table = ? AND id_student = ?");
            $result = $stmt->execute([$tableId, $user['id']]);
            echo json_encode(['success' => $result]);
            break;
        } elseif ($user['role'] === 'teacher') {
            $stmt = $db->prepare("DELETE FROM teachers_tables WHERE id_table = ? AND id_teacher = ?");
            $result = $stmt->execute([$tableId, $user['id']]);
            echo json_encode(['success' => $result]);
            break;
        }

        echo json_encode(['success' => false, 'message' => 'Unknown role']);
        break;
    case 'getStudentsByIds':
        $ids = $_POST['ids'] ?? $_GET['ids'] ?? [];
        if (is_string($ids)) $ids = json_decode($ids, true);
        if (!is_array($ids) || empty($ids)) {
            echo json_encode(['success' => false, 'error' => 'No ids']);
            exit;
        }
        $students = TableController::getStudentsByIds($ids);
        echo json_encode(['success' => true, 'students' => $students]);
        break;


    default:
        echo json_encode(['error' => 'Unknown or missing action']);
        break;
}