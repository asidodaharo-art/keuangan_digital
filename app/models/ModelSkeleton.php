<?php
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// =====================================================================
// PHP MVC MODEL SKELETON (DOKUMENTASI TEKNIS QUERY DATABASE)
// =====================================================================
// Contoh cetak biru penulisan interaksi data MySQL berbasis class PHP.

require_once __DIR__ . '/../../config/database.php';

class ModelSkeleton {

    /**
     * Mengambil profil instansi pembayar
     */
    public static function getInstansiProfile() {
        $db = Database::connect();
        $stmt = $db->query("SELECT * FROM instansi WHERE id = 1 LIMIT 1");
        return $stmt->fetch();
    }

    /**
     * Memperbarui logo dan informasi profil instansi
     */
    public static function updateInstansi($pemda, $unit, $nama, $alamat, $email, $telepon, $website, $logo_url) {
        $db = Database::connect();
        $sql = "UPDATE instansi SET 
                    pemerintah_daerah = :pemda,
                    unit_organisasi = :unit,
                    nama = :nama, 
                    alamat = :alamat, 
                    email = :email, 
                    telepon = :telepon, 
                    website = :website, 
                    logo_url = :logo_url 
                WHERE id = 1";
        
        $stmt = $db->prepare($sql);
        return $stmt->execute([
            'pemda' => $pemda,
            'unit' => $unit,
            'nama' => $nama,
            'alamat' => $alamat,
            'email' => $email,
            'telepon' => $telepon,
            'website' => $website,
            'logo_url' => $logo_url
        ]);
    }

    /**
     * Memverifikasi kredensial login multi-role
     */
    public static function authenticate($username, $password) {
        $db = Database::connect();
        $sql = "SELECT * FROM users WHERE username = :username LIMIT 1";
        $stmt = $db->prepare($sql);
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();

        if ($user) {
            // Verifikasi password hash bcrypt
            if (password_verify($password, $user['password'])) {
                return $user; // Kirim data user penuh
            }
        }
        return false;
    }
}
?>
