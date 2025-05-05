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

CREATE TABLE groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  specialty_id INT NOT NULL,
  group_year INT NOT NULL,
  group_number INT NOT NULL,
  name VARCHAR(9) NOT NULL,
  FOREIGN KEY (specialty_id) REFERENCES specialties(id),
  UNIQUE(name)
);

CREATE TABLE `students` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(40) NOT NULL UNIQUE,
  `password` VARCHAR(64) NOT NULL,
  `first_name` VARCHAR(40) NOT NULL,
  `last_name` VARCHAR(40) NOT NULL,
  `gender` ENUM('Male','Female') NOT NULL,
  `birthday` DATE NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `id_group` INT,
  
  `registered_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `data_updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  
  INDEX `idx_first_last` (`first_name`, `last_name`),
  INDEX `idx_last_first` (`last_name`, `first_name`),
  INDEX `idx_status_updated` (`status_updated_at`),
  INDEX `idx_data_updated` (`data_updated_at`),

  FOREIGN KEY (`id_group`) REFERENCES `groups`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `teachers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(40) NOT NULL UNIQUE,
  `password` VARCHAR(64) NOT NULL,
  `first_name` VARCHAR(40) NOT NULL,
  `last_name` VARCHAR(40) NOT NULL,
  `gender` ENUM('Male','Female') NOT NULL,
  `birthday` DATE NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  
  `registered_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `data_updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  
  INDEX `idx_first_last` (`first_name`, `last_name`),
  INDEX `idx_last_first` (`last_name`, `first_name`),
  INDEX `idx_status_updated` (`status_updated_at`),
  INDEX `idx_data_updated` (`data_updated_at`),

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


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

CREATE TABLE tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE tables
ADD COLUMN status_updated_at_student DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN data_updated_at_student DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN joined_at_student DATETIME DEFAULT CURRENT_TIMESTAMP;

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
