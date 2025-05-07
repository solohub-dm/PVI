
DROP TABLE IF EXISTS teachers_tables;
DROP TABLE IF EXISTS students_tables;

DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS students;

DROP TABLE IF EXISTS tables;

DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS specialties;
DROP TABLE IF EXISTS fields;

CREATE TABLE fields (
  id INT PRIMARY KEY,
  full_name VARCHAR(40) NOT NULL UNIQUE
);

DELIMITER $$

CREATE TRIGGER validate_field_id_range
BEFORE INSERT ON fields
FOR EACH ROW
BEGIN
  IF NEW.id < 1 OR NEW.id > 29 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'id в таблиці fields має бути в діапазоні від 1 до 29';
  END IF;
END$$

DELIMITER ;

INSERT INTO fields (id, full_name) VALUES
  (11, 'Математика та статистика'),
  (12, 'Інформаційні технології');

CREATE TABLE specialties (
  id INT PRIMARY KEY,
  field_id INT NOT NULL,
  short_name VARCHAR(4) NOT NULL UNIQUE,
  full_name VARCHAR(40) NOT NULL UNIQUE,

  FOREIGN KEY (field_id) REFERENCES fields(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

DELIMITER $$

CREATE TRIGGER validate_specialty_id
BEFORE INSERT ON specialties
FOR EACH ROW
BEGIN
  DECLARE expected_min INT;
  DECLARE expected_max INT;

  SET expected_min = NEW.field_id * 10 + 1;
  SET expected_max = NEW.field_id * 10 + 9;

  IF NEW.id < expected_min OR NEW.id > expected_max THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Невірний формат id: має бути field_id * 10 + x, де x ∈ [1..9]';
  END IF;
END$$

DELIMITER ;

INSERT INTO specialties (id, field_id, short_name, full_name) VALUES
  (121, 12, 'ПЗ', 'Інженерія програмного забезпечення'),
  (122, 12, 'КН', 'Комп\'ютерні науки'),
  (123, 12, 'КІ', 'Комп\'ютерна інженерія'),
  (124, 12, 'СА', 'Системний аналіз');

CREATE TABLE groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  specialty_id INT NOT NULL,
  group_year INT NOT NULL,
  group_number INT NOT NULL,
  name VARCHAR(9) NOT NULL,
  FOREIGN KEY (specialty_id) REFERENCES specialties(id),
  UNIQUE(name)
);

DELIMITER $$

CREATE TRIGGER update_group_name BEFORE INSERT ON groups
FOR EACH ROW
BEGIN
  DECLARE specialty_short_name VARCHAR(4);
  DECLARE course_number INT;

  SELECT short_name INTO specialty_short_name
  FROM specialties
  WHERE id = NEW.specialty_id;

  IF CURDATE() >= DATE_FORMAT(CURDATE(), '%Y-09-01') THEN
    SET course_number = YEAR(CURDATE()) - NEW.group_year + 1;
  ELSE
    SET course_number = YEAR(CURDATE()) - NEW.group_year;
  END IF;

  SET NEW.name = CONCAT(specialty_short_name, '-', course_number, NEW.group_number);
END $$

DELIMITER ;

INSERT INTO groups (specialty_id, group_year, group_number) VALUES
  (121, 2021, 1),
  (121, 2021, 2),
  (121, 2021, 3),
  (121, 2022, 1),
  (121, 2022, 2),
  (121, 2022, 3),
  (121, 2023, 1),
  (121, 2023, 2),
  (121, 2023, 3),
  (121, 2024, 1),
  (121, 2024, 2),
  (121, 2024, 3),

  (122, 2021, 1),
  (122, 2021, 2),
  (122, 2021, 3),
  (122, 2022, 1),
  (122, 2022, 2),
  (122, 2022, 3),
  (122, 2023, 1),
  (122, 2023, 2),
  (122, 2023, 3),
  (122, 2024, 1),
  (122, 2024, 2),
  (122, 2024, 3);

CREATE TABLE `students` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(40) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(40) NOT NULL,
  `last_name` VARCHAR(40) NOT NULL,
  `gender` ENUM('Male','Female') NOT NULL,
  `birthday` DATE NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `id_group` INT,
  `url_avatar` VARCHAR(256) NOT NULL DEFAULT 'uploads/avatars/avatar_default.png',
  
  `registered_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `data_updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  
  INDEX `idx_first_last` (`first_name`, `last_name`),
  INDEX `idx_last_first` (`last_name`, `first_name`),
  INDEX 'idx_group_name' ('group_name'),
  INDEX `idx_status_updated` (`status_updated_at`),
  INDEX `idx_data_updated` (`data_updated_at`),

  FOREIGN KEY (`id_group`) REFERENCES `groups`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE students ADD COLUMN group_name VARCHAR(9) NOT NULL DEFAULT '';

DELIMITER $$

CREATE TRIGGER update_students_group_name
AFTER UPDATE ON groups
FOR EACH ROW
BEGIN
  IF NEW.name <> OLD.name THEN
    UPDATE students
    SET group_name = NEW.name
    WHERE group_name = OLD.name;
  END IF;
END $$

DELIMITER ;

CREATE TABLE `teachers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(40) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(40) NOT NULL,
  `last_name` VARCHAR(40) NOT NULL,
  `gender` ENUM('Male','Female') NOT NULL,
  `birthday` DATE NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `url_avatar` VARCHAR(256) NOT NULL DEFAULT 'uploads/avatars/avatar_default.png',

  `registered_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `data_updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  
  INDEX `idx_first_last` (`first_name`, `last_name`),
  INDEX `idx_last_first` (`last_name`, `first_name`),
  INDEX `idx_status_updated` (`status_updated_at`),
  INDEX `idx_data_updated` (`data_updated_at`),

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE OR REPLACE VIEW users AS
SELECT
    id,
    email,
    first_name,
    last_name,
    url_avatar,
    status,
    'student' AS role
FROM students
UNION ALL
SELECT
    id,
    email,
    first_name,
    last_name,
    url_avatar,
    status,
    'teacher' AS role
FROM teachers;

CREATE TABLE remember_tokens (
    user_id INT NOT NULL,
    user_type ENUM('student', 'teacher') NOT NULL,
    token VARCHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    PRIMARY KEY (user_id, user_type),
    INDEX(token)
);

SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS delete_expired_tokens
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM remember_tokens WHERE expires_at < NOW();

-- CREATE OR REPLACE VIEW all_users AS
-- SELECT
--     id,
--     email,
--     first_name,
--     last_name,
--     gender,
--     birthday,
--     url_avatar,
--     status,
--     registered_at,
--     status_updated_at,
--     data_updated_at,
--     'student' AS role
-- FROM students
-- UNION ALL
-- SELECT
--     id,
--     email,
--     first_name,
--     last_name,
--     gender,
--     birthday,
--     url_avatar,
--     status,
--     registered_at,
--     status_updated_at,
--     data_updated_at,
--     'teacher' AS role
-- FROM teachers;

DELIMITER $$

CREATE TRIGGER update_table_on_students_change
AFTER UPDATE ON students
FOR EACH ROW
BEGIN
  IF NEW.status <> OLD.status THEN
    UPDATE tables
    SET status_updated_at_student = NOW()
    WHERE id IN (
      SELECT id_table FROM students_tables WHERE id_student = NEW.id
    );
  ELSE
    UPDATE tables
    SET data_updated_at_student = NOW()
    WHERE id IN (
      SELECT id_table FROM students_tables WHERE id_student = NEW.id
    );
  END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER update_timestamps_on_students_update
BEFORE UPDATE ON students
FOR EACH ROW
BEGIN
  IF NEW.status <> OLD.status THEN
    SET NEW.status_updated_at = NOW();

    UPDATE tables
    SET status_updated_at_student = NOW()
    WHERE id IN (
      SELECT id_table FROM students_tables WHERE id_student = NEW.id
    );
  ELSE
    SET NEW.data_updated_at = NOW();

    UPDATE tables
    SET data_updated_at_student = NOW()
    WHERE id IN (
      SELECT id_table FROM students_tables WHERE id_student = NEW.id
    );
  END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER update_timestamps_on_teachers_update
BEFORE UPDATE ON teachers
FOR EACH ROW
BEGIN
  IF NEW.status <> OLD.status THEN
    SET NEW.status_updated_at = NOW();
  ELSE
    SET NEW.data_updated_at = NOW();
  END IF;
END$$

DELIMITER ;

CREATE TABLE tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_updated_at_student DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_updated_at_student DATETIME DEFAULT CURRENT_TIMESTAMP,
    joined_at_student DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE tables ADD COLUMN id_created_by INT;

ALTER TABLE tables
  ADD CONSTRAINT fk_tables_created_by_teacher
  FOREIGN KEY (id_created_by) REFERENCES teachers(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

CREATE TABLE students_tables (
    id_student INT,
    id_table INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_student_table UNIQUE (id_student, id_table),

    INDEX `idx_id_table` (`id_table`),

    FOREIGN KEY (id_student) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (id_table) REFERENCES tables(id) ON DELETE CASCADE
);

CREATE TABLE teachers_tables (
    id_teacher INT,
    id_table INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_teacher_table UNIQUE (id_teacher, id_table),

    INDEX `idx_id_table` (`id_table`),

    FOREIGN KEY (id_teacher) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (id_table) REFERENCES tables(id) ON DELETE CASCADE
);
