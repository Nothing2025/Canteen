-- =============================================================
-- Canteen Pre-Ordering System — Database Schema
-- Run this script in MySQL/MariaDB to set up the database
-- =============================================================

-- Create and select database
CREATE DATABASE IF NOT EXISTS canteen_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE canteen_db;

-- -------------------------------------------------------------
-- Table: users
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)     NOT NULL,
  email       VARCHAR(150)     NOT NULL UNIQUE,
  password    VARCHAR(255)     NOT NULL,
  role        ENUM('student','admin','staff') NOT NULL DEFAULT 'student',
  created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_users_email (email),
  INDEX idx_users_role  (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- Table: menu
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menu (
  id                 INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  item_name          VARCHAR(150)   NOT NULL,
  price              DECIMAL(10,2)  NOT NULL CHECK (price >= 0),
  available_quantity INT UNSIGNED   NOT NULL DEFAULT 0,
  is_active          TINYINT(1)     NOT NULL DEFAULT 1,
  date               DATE           NOT NULL DEFAULT (CURDATE()),
  PRIMARY KEY (id),
  INDEX idx_menu_date_active (date, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- Table: orders
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id      INT UNSIGNED    NOT NULL,
  total_amount DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  pickup_slot  VARCHAR(20)     NOT NULL,
  status       ENUM('pending','ready','completed','cancelled') NOT NULL DEFAULT 'pending',
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_orders_user_id   (user_id),
  INDEX idx_orders_status    (status),
  INDEX idx_orders_created   (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- Table: order_items
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id        INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  order_id  INT UNSIGNED   NOT NULL,
  menu_id   INT UNSIGNED   NOT NULL,
  quantity  INT UNSIGNED   NOT NULL DEFAULT 1,
  subtotal  DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  PRIMARY KEY (id),
  CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_oi_menu  FOREIGN KEY (menu_id)  REFERENCES menu(id)   ON DELETE RESTRICT,
  INDEX idx_oi_order_id (order_id),
  INDEX idx_oi_menu_id  (menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- Table: settings
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_deadline TIME         NOT NULL DEFAULT '10:00:00'
                              COMMENT 'Daily cut-off time for placing orders (HH:MM)',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default deadline row if none exists
INSERT INTO settings (order_deadline)
SELECT '10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM settings LIMIT 1);

-- -------------------------------------------------------------
-- Seed: default admin user
-- Password: Admin@123  (bcrypt hash — change after first login!)
-- -------------------------------------------------------------
INSERT INTO users (name, email, password, role) VALUES
  ('Admin', 'admin@canteen.com',
   '$2b$10$.IfAiq.4bwdosb9tR/ygdOQSPTk7A8oikfrC100qzbcAmaD/VlGCK',
   'admin')
ON DUPLICATE KEY UPDATE id = id;

-- Seed: default staff user  (password: Staff@123)
INSERT INTO users (name, email, password, role) VALUES
  ('Staff Member', 'staff@canteen.com',
   '$2b$10$7h9jmzFVgJ44aBjd7TklUOTtfOMP15BiW9hRAh1nliDEb4BaxowFq',
   'staff')
ON DUPLICATE KEY UPDATE id = id;

-- Seed: sample menu items for today
INSERT INTO menu (item_name, price, available_quantity, is_active, date) VALUES
  ('Masala Dosa',     45.00, 50, 1, CURDATE()),
  ('Idli Sambar',     30.00, 40, 1, CURDATE()),
  ('Veg Thali',       80.00, 30, 1, CURDATE()),
  ('Chicken Biryani', 120.00, 25, 1, CURDATE()),
  ('Paneer Butter Masala', 95.00, 20, 1, CURDATE()),
  ('Cold Coffee',     40.00, 60, 1, CURDATE()),
  ('Samosa (2 pcs)',  20.00, 100, 1, CURDATE()),
  ('Chole Bhature',   70.00, 35, 1, CURDATE())
ON DUPLICATE KEY UPDATE id = id;
