<?php
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// =====================================================================
// ENTRY POINT / ROUTER UTAMA PHP MVC NATIVE
// =====================================================================
// File ini menangani incoming request URL dari .htaccess dan memetakan
// ke Controller yang tepat di lingkungan server produksi (cPanel/InfinityFree).

// Mulai session php untuk status login multi-role
session_start();

// Load file konfigurasi database
require_once __DIR__ . '/config/database.php';

// Router sederhana berbasis parameter query URL
$url = isset($_GET['url']) ? rtrim($_GET['url'], '/') : 'landing';

// Routing handler map
switch ($url) {
    case 'landing':
        // Membuka landing page aplikasi
        require_page('landing');
        break;
        
    case 'login':
        // Menangani aksi post login
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            handle_login_action();
        } else {
            require_page('login');
        }
        break;

    case 'logout':
        // Mengakhiri sesi masuk
        session_destroy();
        header("Location: index.php?url=landing");
        exit();
        break;

    case 'dashboard':
        // Verifikasi sesi login
        check_auth();
        require_page('dashboard');
        break;

    case 'master':
        check_auth();
        require_page('master');
        break;

    case 'spj':
        check_auth();
        require_page('spj');
        break;

    case 'bapp':
        check_auth();
        require_page('bapp');
        break;

    case 'settings':
        check_auth();
        // Hanya Admin yang bisa masuk ke user management
        if ($_SESSION['user_role'] !== 'Admin') {
            header("Location: index.php?url=dashboard&error=restricted");
            exit();
        }
        require_page('settings');
        break;

    default:
        // Render 404 Not Found Page
        http_response_code(404);
        echo "<h1 style='font-family:sans-serif; text-align:center; padding-top:20%; color:#d32f2f;'>404 Halaman Tidak Ditemukan</h1>";
        break;
}

// Helper untuk menyematkan layout view terpisah
function require_page($page_name) {
    // Menyediakan Kop Surat/Profil Instansi otomatis dari DB PDO
    try {
        $db = Database::connect();
        $stmt = $db->query("SELECT * FROM instansi WHERE id = 1 LIMIT 1");
        $instansi = $stmt->fetch();
    } catch (Exception $e) {
        $instansi = [
            'pemerintah_daerah' => 'PEMERINTAH PROVINSI DKI JAKARTA',
            'unit_organisasi' => 'DINAS PEKERJAAN UMUM DAN PENATAAN RUANG',
            'nama' => 'Dinas Pekerjaan Umum dan Penataan Ruang',
            'alamat' => 'Jl. Jenderal Sudirman No. 123',
            'telepon' => '021-8273928',
            'email' => 'info@pupr.go.id',
            'website' => 'www.pupr.go.id',
            'logo_url' => 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=150&q=80'
        ];
    }
    
    // Simulasikan data session agar template aman bekerja
    $user_name_logged = isset($_SESSION['user_name']) ? $_SESSION['user_name'] : 'Tamu';
    $user_role_logged = isset($_SESSION['user_role']) ? $_SESSION['user_role'] : 'Tamu';

    // Rute render template simulasi
    echo "<!-- TEMPLATE LOADED: app/views/{$page_name}.php -->";
    echo "<!DOCTYPE html><html lang='id'><head><meta charset='utf-8'><title>Dinas PUPR - BAPP</title></head>";
    echo "<body style='font-family:sans-serif; background:#f4f6f9; margin:0;'>";
    echo "<div style='background:#2196F3; color:white; padding:15px; font-weight:bold;'>🏢 {$instansi['nama']} - BAPP Digital Engine</div>";
    echo "<div style='padding:30px; text-align:center;'>";
    echo "<h3>Mode PHP Native File Controller Simulator 8.x</h3>";
    echo "<p>Halaman <strong style='color:#2196F3;'>{$page_name}.php</strong> termuat secara logis.</p>";
    echo "<p>Untuk melihat visualisasi interaktif realtime berkualitas tinggi lengkap dengan diagram, silakan periksa Iframe render output React pada layar browser AI Studio.</p>";
    echo "<p><a href='index.php?url=landing' style='color:#2196F3; font-weight:bold; text-decoration:none;'>Kembali ke Beranda</a></p>";
    echo "</div></body></html>";
    exit();
}

// Verifikator Sesi Login
function check_auth() {
    if (!isset($_SESSION['user_id'])) {
        header("Location: index.php?url=login&error=unauthenticated");
        exit();
    }
}

// Simulasi Aksi Autentikasi Pengirim Form POST
function handle_login_action() {
    $user = isset($_POST['username']) ? $_POST['username'] : '';
    $pass = isset($_POST['password']) ? $_POST['password'] : '';

    if (($user === 'admin' || $user === 'user') && $pass === 'password') {
        $_SESSION['user_id'] = $user === 'admin' ? 1 : 2;
        $_SESSION['user_name'] = $user === 'admin' ? 'Muhammad Irfan' : 'Soni Setiawan';
        $_SESSION['user_role'] = $user === 'admin' ? 'Admin' : 'User';
        header("Location: index.php?url=dashboard");
        exit();
    } else {
        header("Location: index.php?url=login&error=invalid_credentials");
        exit();
    }
}
?>
