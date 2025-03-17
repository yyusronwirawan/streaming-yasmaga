-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 18 Mar 2025 pada 00.33
-- Versi server: 10.6.21-MariaDB
-- Versi PHP: 8.3.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yasmagac_db_radio`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `contents`
--

CREATE TABLE `contents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `contents`
--

INSERT INTO `contents` (`id`, `name`, `metadata`, `created_at`, `updated_at`) VALUES
(1, 'logo', '{\"type\":\"image\",\"value\":\"image\",\"image\":\"content-images\\/7MeCRfSXVdunehYtz2iMH9CcGo6fGi5dI8i4p4cH.jpg\"}', '2024-10-19 03:55:13', '2024-11-05 05:23:33'),
(2, 'nama aplikasi', '{\"type\":\"text\",\"value\":\"Streaming Radio Yasmaga FM 96.9 MHz Ponorogo\",\"image\":null}', '2024-10-19 03:59:55', '2025-01-22 06:49:47'),
(3, 'stream url', '{\"type\":\"text\",\"value\":\"https:\\/\\/a12.siar.us\\/listen\\/yasmagafm\\/stream\",\"image\":null}', '2024-10-19 04:00:17', '2025-01-22 01:57:33'),
(5, 'footer', '{\"type\":\"text\",\"value\":\"2024 Radio Yasmaga FM 96.9 MHz. All rights reserved.\",\"image\":null}', NULL, '2025-01-22 06:53:05'),
(6, 'favicon', '{\"type\":\"image\",\"value\":\"image\",\"image\":\"content-images\\/7BzOr5DedY9wBRs9RLzD3MZpuYxx6vff9CX0PoDh.jpg\"}', NULL, '2024-10-26 13:06:40');

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_sessions_table', 1),
(3, '0001_01_02_000000_create_schedules_table', 1),
(4, '0001_01_03_000000_create_contents_table', 1),
(5, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(6, '0001_01_04_000000_create_promos_table', 2);

-- --------------------------------------------------------

--
-- Struktur dari tabel `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `promos`
--

CREATE TABLE `promos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `created_by` varchar(255) NOT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `promos`
--

INSERT INTO `promos` (`id`, `name`, `phone`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'Ponorogo', '08113375559', 'Administrator', 'Admin', '2024-10-22 11:12:40', '2024-11-14 03:27:43'),
(2, 'Pacitan', '087758700600', 'Admin', 'Admin', '2024-11-05 01:30:33', '2024-11-14 03:28:07'),
(3, 'Banyuwangi', '081234701692', 'Admin', 'Admin', '2024-11-05 01:30:54', '2024-11-14 03:28:53'),
(4, 'Jember', '082338019096', 'Admin', 'Admin', '2024-11-05 01:31:13', '2024-11-14 03:28:36'),
(5, 'Kediri', '087758700600', 'Admin', NULL, '2024-11-14 03:28:17', '2024-11-14 03:28:17'),
(6, 'Madiun', '085235031111', 'Admin', NULL, '2024-11-14 03:29:35', '2024-11-14 03:29:35'),
(7, 'Trenggalek', '085330103777', 'Admin', NULL, '2024-11-14 03:30:03', '2024-11-14 03:30:03'),
(8, 'Lampung', '081227645225', 'Admin', NULL, '2024-11-14 03:30:27', '2024-11-14 03:30:27'),
(9, 'Solo', '081548314892', 'Admin', NULL, '2024-11-14 03:30:45', '2024-11-14 03:30:45'),
(10, 'Medan', '082267673597', 'Admin', NULL, '2024-11-14 03:31:12', '2024-11-14 03:31:12'),
(11, 'Bojonegoro', '082244880169', 'Admin', NULL, '2024-11-14 03:31:31', '2024-11-14 03:31:31'),
(12, 'Padang', '085263830072', 'Admin', NULL, '2024-11-14 03:31:47', '2024-11-14 03:31:47');

-- --------------------------------------------------------

--
-- Struktur dari tabel `schedules`
--

CREATE TABLE `schedules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `date` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL,
  `created_by` varchar(255) NOT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `schedules`
--

INSERT INTO `schedules` (`id`, `name`, `image`, `date`, `time`, `created_by`, `updated_by`, `description`, `created_at`, `updated_at`) VALUES
(58, 'Geboy Pagi', NULL, 'Senin', '07:00 - 09:00', 'admin', NULL, NULL, '2025-01-22 08:20:56', '2025-01-22 08:20:56'),
(59, 'GMKY', NULL, 'Senin', '09:00 - 11:00', 'admin', 'admin', NULL, '2025-01-22 08:21:20', '2025-01-22 08:21:28'),
(60, 'Gado-Gado Nglaras/Balungan', NULL, 'Senin', '11:00 - 13:00', 'admin', 'Administrator', NULL, '2025-01-22 08:22:13', '2025-01-22 10:07:36'),
(61, 'Pesta Salak', NULL, 'Senin', '13:00 - 15:00', 'admin', NULL, NULL, '2025-01-22 08:23:33', '2025-01-22 08:23:33'),
(62, 'Dendang Sore', NULL, 'Senin', '15:00 - 17:00', 'admin', NULL, NULL, '2025-01-22 08:24:08', '2025-01-22 08:24:08'),
(63, 'Yasmaga Religi', NULL, 'Senin', '17:00 - 18:00', 'admin', NULL, NULL, '2025-01-22 08:24:41', '2025-01-22 08:24:41'),
(64, 'Extravaganza', NULL, 'Senin', '18:00 - 20:00', 'admin', NULL, NULL, '2025-01-22 08:25:14', '2025-01-22 08:25:14'),
(65, 'Rujak Campur', NULL, 'Senin', '20:00 - 22:00', 'admin', NULL, NULL, '2025-01-22 08:25:39', '2025-01-22 08:25:39'),
(66, 'Geboy Pagi', NULL, 'Selasa', '07:00 - 09:00', 'admin', NULL, NULL, '2025-01-22 08:26:08', '2025-01-22 08:26:08'),
(67, 'GMKY', NULL, 'Selasa', '09:00 - 11:00', 'admin', NULL, NULL, '2025-01-22 08:26:24', '2025-01-22 08:26:24'),
(68, 'Gado-Gado Nglaras/Balungan', NULL, 'Selasa', '11:00 - 13:00', 'admin', 'Administrator', NULL, '2025-01-22 08:26:41', '2025-01-22 10:07:54'),
(69, 'Pesta Salak', NULL, 'Selasa', '13:00 - 15:00', 'admin', NULL, NULL, '2025-01-22 08:26:59', '2025-01-22 08:26:59'),
(70, 'Dendang Sore', NULL, 'Selasa', '15:00 - 17:00', 'admin', NULL, NULL, '2025-01-22 08:27:20', '2025-01-22 08:27:20'),
(71, 'Yasmaga Religi', NULL, 'Selasa', '17:00 - 18:00', 'admin', NULL, NULL, '2025-01-22 08:27:46', '2025-01-22 08:27:46'),
(72, 'Extravaganza', NULL, 'Selasa', '18:00 - 20:00', 'admin', NULL, NULL, '2025-01-22 08:28:09', '2025-01-22 08:28:09'),
(73, 'Rujak Campur', NULL, 'Selasa', '20:00 - 22:00', 'admin', NULL, NULL, '2025-01-22 08:28:28', '2025-01-22 08:28:28'),
(74, 'Geboy Pagi', NULL, 'Rabu', '07:00 - 09:00', 'admin', NULL, NULL, '2025-01-22 08:29:23', '2025-01-22 08:29:23'),
(75, 'GMKY', NULL, 'Rabu', '09:00 - 11:00', 'admin', NULL, NULL, '2025-01-22 08:29:38', '2025-01-22 08:29:38'),
(76, 'Gado-Gado Nglaras/Balungan', NULL, 'Rabu', '11:00 - 13:00', 'admin', 'Administrator', NULL, '2025-01-22 08:30:07', '2025-01-22 10:07:46'),
(77, 'Pesta Salak', NULL, 'Rabu', '13:00 - 15:00', 'admin', NULL, NULL, '2025-01-22 08:30:25', '2025-01-22 08:30:25'),
(78, 'Dendang Sore', NULL, 'Rabu', '15:00 - 17:00', 'admin', NULL, NULL, '2025-01-22 08:30:39', '2025-01-22 08:30:39'),
(79, 'Yasmaga Religi', NULL, 'Rabu', '17:00 - 18:00', 'admin', NULL, NULL, '2025-01-22 08:30:55', '2025-01-22 08:30:55'),
(80, 'Extravaganza', NULL, 'Rabu', '18:00 - 20:00', 'admin', NULL, NULL, '2025-01-22 08:31:09', '2025-01-22 08:31:09'),
(81, 'Rujak Campur', NULL, 'Rabu', '20:00 - 22:00', 'admin', NULL, NULL, '2025-01-22 08:31:24', '2025-01-22 08:31:24'),
(82, 'Geboy Pagi', NULL, 'Kamis', '07:00 - 09:00', 'admin', NULL, NULL, '2025-01-22 08:31:39', '2025-01-22 08:31:39'),
(83, 'GMKY', NULL, 'Kamis', '09:00 - 11:00', 'admin', NULL, NULL, '2025-01-22 08:31:52', '2025-01-22 08:31:52'),
(84, 'Gado-Gado Nglaras/Balungan', NULL, 'Kamis', '11:00 - 13:00', 'admin', 'Administrator', NULL, '2025-01-22 08:32:05', '2025-01-22 10:08:03'),
(85, 'Pesta Salak', NULL, 'Kamis', '13:00 - 15:00', 'admin', NULL, NULL, '2025-01-22 08:32:21', '2025-01-22 08:32:21'),
(86, 'Dendang Sore', NULL, 'Kamis', '15:00 - 17:00', 'admin', NULL, NULL, '2025-01-22 08:32:35', '2025-01-22 08:32:35'),
(87, 'Yasmaga Religi', NULL, 'Kamis', '17:00 - 18:00', 'admin', NULL, NULL, '2025-01-22 08:32:48', '2025-01-22 08:32:48'),
(88, 'Extravaganza', NULL, 'Kamis', '18:00 - 20:00', 'admin', NULL, NULL, '2025-01-22 08:33:05', '2025-01-22 08:33:05'),
(89, 'Rujak Campur', NULL, 'Jumat', '20:00 - 22:00', 'admin', NULL, NULL, '2025-01-22 08:33:23', '2025-01-22 08:33:23'),
(90, 'Geboy Pagi', NULL, 'Jumat', '07:00 - 09:00', 'admin', NULL, NULL, '2025-01-22 08:33:38', '2025-01-22 08:33:38'),
(91, 'GMKY', NULL, 'Jumat', '09:00 - 11:00', 'admin', NULL, NULL, '2025-01-22 08:33:49', '2025-01-22 08:33:49'),
(92, 'Gado-Gado Nglaras/Balungan', NULL, 'Jumat', '11:00 - 13:00', 'admin', 'Administrator', NULL, '2025-01-22 08:34:07', '2025-01-22 10:08:15'),
(93, 'Pesta Salak', NULL, 'Jumat', '13:00 - 15:00', 'admin', NULL, NULL, '2025-01-22 08:34:25', '2025-01-22 08:34:25'),
(94, 'Dendang Sore', NULL, 'Jumat', '15:00 - 17:00', 'admin', NULL, NULL, '2025-01-22 08:34:40', '2025-01-22 08:34:40'),
(95, 'Yasmaga Religi', NULL, 'Jumat', '17:00 - 18:00', 'admin', NULL, NULL, '2025-01-22 08:34:54', '2025-01-22 08:34:54'),
(96, 'Extravaganza', NULL, 'Jumat', '18:00 - 20:00', 'admin', NULL, NULL, '2025-01-22 08:35:11', '2025-01-22 08:35:11'),
(97, 'Rujak Campur', NULL, 'Jumat', '20:00 - 22:00', 'admin', NULL, NULL, '2025-01-22 08:35:24', '2025-01-22 08:35:24'),
(99, 'Geboy Pagi', NULL, 'Sabtu', '07:00 - 09:00', 'admin', 'admin', NULL, '2025-01-22 08:37:12', '2025-01-22 08:57:50'),
(100, 'GMKY', NULL, 'Sabtu', '09:00 - 11:00', 'admin', 'admin', NULL, '2025-01-22 08:37:29', '2025-01-22 08:57:57'),
(101, 'Gado-Gado Nglaras/Balungan', NULL, 'Sabtu', '11:00 - 13:00', 'admin', 'Administrator', NULL, '2025-01-22 08:37:51', '2025-01-22 10:08:26'),
(102, 'Pesta Salak', NULL, 'Sabtu', '13:00 - 15:00', 'admin', NULL, NULL, '2025-01-22 08:59:03', '2025-01-22 08:59:03'),
(103, 'Dendang Sore', NULL, 'Sabtu', '15:00 - 17:00', 'admin', NULL, NULL, '2025-01-22 08:59:17', '2025-01-22 08:59:17'),
(104, 'Yasmaga Religi', NULL, 'Sabtu', '17:00 - 18:00', 'admin', NULL, NULL, '2025-01-22 08:59:35', '2025-01-22 08:59:35'),
(105, 'Extravaganza', NULL, 'Sabtu', '18:00 - 20:00', 'admin', NULL, NULL, '2025-01-22 08:59:54', '2025-01-22 08:59:54'),
(106, 'Rujak Campur', NULL, 'Sabtu', '20:00 - 22:00', 'admin', NULL, NULL, '2025-01-22 09:00:06', '2025-01-22 09:00:06'),
(107, 'Geboy Pagi', NULL, 'Minggu', '07:00 - 09:00', 'admin', NULL, NULL, '2025-01-22 09:00:50', '2025-01-22 09:00:50'),
(108, 'GMKY', NULL, 'Minggu', '09:00 - 11:00', 'admin', NULL, NULL, '2025-01-22 09:01:04', '2025-01-22 09:01:04'),
(109, 'Gado-Gado Nglaras/Balungan', NULL, 'Minggu', '11:00 - 13:00', 'admin', 'Administrator', NULL, '2025-01-22 09:01:18', '2025-01-22 10:08:34'),
(110, 'Pesta Salak', NULL, 'Minggu', '13:00 - 15:00', 'admin', NULL, NULL, '2025-01-22 09:01:34', '2025-01-22 09:01:34'),
(111, 'Dendang Sore', NULL, 'Minggu', '15:00 - 17:00', 'admin', NULL, NULL, '2025-01-22 09:01:48', '2025-01-22 09:01:48'),
(112, 'Yasmaga Religi', NULL, 'Minggu', '17:00 - 18:00', 'admin', NULL, NULL, '2025-01-22 09:02:21', '2025-01-22 09:02:21'),
(113, 'Extravaganza', NULL, 'Minggu', '18:00 - 20:00', 'admin', NULL, NULL, '2025-01-22 09:02:37', '2025-01-22 09:02:37'),
(114, 'Rujak Campur', NULL, 'Minggu', '20:00 - 22:00', 'admin', NULL, NULL, '2025-01-22 09:02:50', '2025-01-22 09:02:50'),
(115, 'Rujak Campur', NULL, 'Kamis', '20:00 - 22:00', 'Administrator', NULL, NULL, '2025-01-22 10:16:55', '2025-01-22 10:16:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` text NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `full_name`, `email`, `password`, `status`, `image`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Administrator', 'radioyasmaga@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 'user-images/tssqJaqc0FhkAoMhtWMNwKT47SXIBDkssd4Z0KtB.png', NULL, '2024-10-19 04:12:03', '2025-01-22 09:04:05');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `contents`
--
ALTER TABLE `contents`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indeks untuk tabel `promos`
--
ALTER TABLE `promos`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD UNIQUE KEY `sessions_id_unique` (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `contents`
--
ALTER TABLE `contents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `promos`
--
ALTER TABLE `promos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
