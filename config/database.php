<?php
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// =====================================================================
// KONFIGURASI DATABASE MYSQL (KONEKSI PDO PHP NATIVE)
// =====================================================================
// Digunakan oleh sistem backend PHP saat di-deploy ke hosting / InfinityFree.

define('DB_HOST', 'sql123.infinityfree.com'); // Ganti dengan hostname server MySQL InfinityFree Anda
define('DB_NAME', 'epiz_34567890_bapp');       // Ganti dengan nama database Anda
define('DB_USER', 'epiz_34567890');            // Ganti dengan username database Anda
define('DB_PASS', 'AtX9y7z2pK5as');            // Ganti dengan password database/cPanel Anda

class Database {
    private static $connection = null;

    public static function connect() {
        if (self::$connection === null) {
            try {
                $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ];
                self::$connection = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // Jangan meng-output detail password jika error (keamanan utama)
                die("Koneksi Database Gagal: " . $e->getMessage());
            }
        }
        return self::$connection;
    }
}
?>
