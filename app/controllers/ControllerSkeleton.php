<?php
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// =====================================================================
// PHP MVC CONTROLLER SKELETON (DOKUMENTASI TEKNIS PENGEMBANGAN)
// =====================================================================
// Digunakan sebagai contoh cetak biru (blueprint) bagi developer dinas
// untuk memperluas (custom) penambahan halaman baru dengan tertata.

require_once __DIR__ . '/../../config/database.php';

class ControllerSkeleton {

    /**
     * Menampilkan daftar data dengan pencarian dan pagination (Read)
     */
    public function index() {
        // Cek login sesi
        if (!isset($_SESSION['user_id'])) {
            header("Location: index.php?url=login");
            exit();
        }

        $db = Database::connect();
        
        // Menangani input pencarian (Search)
        $search = isset($_GET['search']) ? '%' . $_GET['search'] . '%' : '%';
        
        // Logika SQL pencarian pagu
        $sql = "SELECT * FROM master_data 
                WHERE kode_rekening LIKE :search 
                   OR sub_kegiatan LIKE :search 
                ORDER BY kode_rekening ASC";
                
        $stmt = $db->prepare($sql);
        $stmt->execute(['search' => $search]);
        $items = $stmt->fetchAll();

        // Mengirim data ke File View Terkait
        // include __DIR__ . '/../views/master/index.php';
        return $items;
    }

    /**
     * Menangani input penambahan data baru (Create)
     */
    public function create() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $kode = $_POST['kode_rekening'] ?? '';
            $program = $_POST['program'] ?? '';
            $sub = $_POST['sub_kegiatan'] ?? '';
            $pagu = $_POST['pagu'] ?? 0;

            if (empty($kode) || empty($sub) || $pagu <= 0) {
                $_SESSION['error_flash'] = 'Mohon isi seluruh bidang wajib!';
                header("Location: index.php?url=master");
                exit();
            }

            try {
                $db = Database::connect();
                $sql = "INSERT INTO master_data (kode_rekening, program, sub_kegiatan, pagu) 
                        VALUES (:kode, :program, :sub, :pagu)";
                $stmt = $db->prepare($sql);
                $stmt->execute([
                    'kode' => $kode,
                    'program' => $program,
                    'sub' => $sub,
                    'pagu' => $pagu
                ]);

                $_SESSION['success_flash'] = 'Rekening berhasil ditambahkan!';
            } catch (PDOException $e) {
                $_SESSION['error_flash'] = 'Kode rekening sudah terdaftar di sistem!';
            }

            header("Location: index.php?url=master");
            exit();
        }
    }

    /**
     * Menangani edit / pembaruan data (Update)
     */
    public function update($id) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $pagu = $_POST['pagu'] ?? 0;

            $db = Database::connect();
            $sql = "UPDATE master_data SET pagu = :pagu WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->execute([
                'pagu' => $pagu,
                'id' => $id
            ]);

            $_SESSION['success_flash'] = 'Alokasi Pagu berhasil diperbarui!';
            header("Location: index.php?url=master");
            exit();
        }
    }

    /**
     * Menghapus data dari database (Delete)
     */
    public function delete($id) {
        if ($_SESSION['user_role'] !== 'Admin') {
            die("Error: Anda tidak memiliki wewenang!");
        }

        $db = Database::connect();
        $sql = "DELETE FROM master_data WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute(['id' => $id]);

        $_SESSION['success_flash'] = 'Data rekening sukses dihapus!';
        header("Location: index.php?url=master");
        exit();
    }
}
?>
