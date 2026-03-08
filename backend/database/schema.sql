-- Canteen Pre-Ordering System Database Schema
-- Run this file after creating the database: canteen_db

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin', 'staff') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(150) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  available_quantity INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  date DATE NOT NULL DEFAULT (CURDATE())
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  pickup_slot VARCHAR(50) NOT NULL,
  status ENUM('pending', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_id INT NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_id) REFERENCES menu(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_deadline VARCHAR(5) NOT NULL DEFAULT '10:00'
);

-- Insert default settings
INSERT INTO settings (order_deadline)
SELECT '10:00' WHERE NOT EXISTS (SELECT 1 FROM settings LIMIT 1);
