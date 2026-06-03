# Panduan Penggunaan Aplikasi Akuntansi

Selamat datang di Aplikasi Akuntansi Modern! Dokumen ini akan memandu Anda melalui fitur-fitur utama aplikasi dan cara menggunakannya secara efektif.

## Daftar Isi
1.  [Dashboard](#1-dashboard)
2.  [Jurnal](#2-jurnal)
3.  [Hutang](#3-hutang)
4.  [Piutang](#4-piutang)
5.  [Aset Tetap](#5-aset-tetap)
6.  [Laporan](#6-laporan)
7.  [Pengaturan](#7-pengaturan)
8.  [Bantuan](#8-bantuan)

---

### 1. Dashboard

Dashboard adalah halaman utama yang memberikan ringkasan visual dari kondisi keuangan perusahaan Anda. Di sini Anda dapat melihat:
- **Posisi Keuangan:** Komposisi Aset, Liabilitas, dan Ekuitas.
- **Distribusi Jurnal:** Proporsi jenis transaksi yang Anda catat.
- **Arus Kas:** Ringkasan kas masuk, kas keluar, dan kas bersih.
- **Ringkasan Tahunan:** Grafik perbandingan antara Pendapatan dan Beban setiap bulan.

Anda dapat memfilter data di Dashboard berdasarkan **bulan** dan **tahun** untuk menganalisis periode tertentu.

---

### 2. Jurnal

Halaman Jurnal adalah pusat dari semua pencatatan transaksi Anda.

#### Mencatat Transaksi
Ada dua cara utama untuk mencatat transaksi:

1.  **Pintasan (Tombol +):**
    - Gunakan tombol `+` untuk mencatat transaksi umum dengan cepat.
    - **Pemasukan/Pengeluaran Biasa:** Cukup pilih jenis transaksi, isi akun yang relevan, deskripsi, dan nominal.
    - **Penjualan dengan HPP:** Pilih jenis **"Penjualan"**. Selain mengisi detail penjualan, Anda bisa mengaktifkan dan mengisi bagian HPP (Harga Pokok Penjualan). Saat disimpan, aplikasi akan **otomatis membuat 2 jurnal terpisah**: satu untuk penjualan dan satu untuk HPP.
    - **Penting:** Untuk mencatat **Bayar Hutang**, **Dibayar Piutang**, dan **Penyusutan**, jangan gunakan pintasan ini. Buka halaman terkait untuk pengelolaan yang lebih akurat.

2.  **Jurnal Umum (Ikon Buku+):**
    - Gunakan ini untuk mencatat transaksi yang lebih kompleks yang melibatkan lebih dari dua akun (misalnya, pembayaran gaji dengan potongan pajak, pembelian aset dengan uang muka).
    - Anda dapat menambahkan baris sebanyak yang diperlukan. Pastikan total **Debit** dan **Kredit** seimbang sebelum menyimpan.

---

### 3. Hutang

Halaman ini membantu Anda mengelola semua hutang perusahaan.

- **Daftar Hutang:** Menampilkan semua hutang yang belum lunas. Hutang baru akan otomatis muncul di sini setiap kali Anda mencatat transaksi yang mengkredit akun bertipe "Liability" (misal: pembelian kredit).
- **Membayar Hutang:**
    - Klik tombol **Bayar** di samping item hutang.
    - Isi tanggal, akun kas/bank, dan nominal pokok yang dibayar.
    - Sistem akan secara otomatis membuat jurnal pembayaran yang benar.
- **Riwayat Pembayaran:**
    - Klik tombol **Lihat Riwayat** untuk melihat semua pembayaran yang pernah dilakukan.
    - Klik ikon **History (jam)** di samping tombol Bayar untuk melihat riwayat pembayaran *spesifik* untuk satu hutang.

---

### 4. Piutang

Halaman ini berfungsi mirip dengan halaman Hutang, tetapi untuk mengelola piutang (tagihan ke pelanggan).

- **Daftar Piutang:** Menampilkan semua piutang yang belum dilunasi. Piutang baru akan otomatis muncul saat Anda mencatat transaksi penjualan ke akun "Piutang Usaha".
- **Menerima Pembayaran:**
    - Klik tombol **Terima** di samping item piutang.
    - Isi tanggal, akun kas/bank tujuan, dan nominal yang diterima.
- **Riwayat Penerimaan:**
    - Klik tombol **Lihat Riwayat** untuk melihat semua penerimaan piutang.
    - Klik ikon **History (jam)** di samping tombol Terima untuk melihat riwayat penerimaan dari piutang spesifik tersebut.

---

### 5. Aset Tetap

Halaman ini digunakan untuk mengelola aset berwujud jangka panjang dan penyusutannya.

- **Daftar Aset Tetap:** Menampilkan semua aset tetap (misal: Kendaraan, Peralatan) yang telah Anda catat melalui jurnal pembelian.
- **Mencatat Penyusutan:**
    1. Klik tombol **Susutkan** di samping aset yang relevan.
    2. Masukkan **Masa Manfaat** aset dalam tahun. Aplikasi akan otomatis menghitung nominal penyusutan bulanan.
    3. Pilih akun beban dan akun akumulasi penyusutan yang sesuai.
    4. Simpan untuk membuat jurnal penyusutan.
- **Riwayat Penyusutan:**
    - Klik tombol **Lihat Riwayat** untuk melihat semua jurnal penyusutan yang pernah dibuat.
    - Klik ikon **History (jam)** untuk melihat riwayat penyusutan aset yang spesifik.

---

### 6. Laporan

Aplikasi ini dapat menghasilkan beberapa laporan keuangan penting secara otomatis.

- **Buku Besar:** Rincian semua transaksi (debit, kredit, saldo) untuk setiap akun.
- **Neraca Saldo:** Daftar semua akun beserta saldo debit dan kreditnya untuk memastikan keseimbangan.
- **Laba Rugi:** Kinerja keuangan (Pendapatan vs Beban) dalam suatu periode.
- **Neraca:** Posisi keuangan (Aset, Liabilitas, Ekuitas) pada titik waktu tertentu.
- **Arus Kas:** Pergerakan kas dari aktivitas operasional, investasi, dan pendanaan.

Anda juga dapat **mengunduh semua laporan** dalam satu file Excel dari halaman utama Laporan.

---

### 7. Pengaturan

Di sini Anda dapat mengelola struktur dan data dasar aplikasi.

- **Profil Perusahaan:** Isi detail perusahaan Anda yang akan muncul di kop laporan.
- **Kode Akun (COA):**
    - Kelola **Kategori Akun** (misal: "Aset Lancar", "Beban Administrasi").
    - Tambah atau edit **Akun** di dalam setiap kategori (misal: "Kas", "Beban Gaji").
- **Keamanan:** Atur kata sandi untuk melindungi akses ke aplikasi.
- **Backup & Restore:** Simpan atau pulihkan semua data aplikasi Anda.
- **Reset Data:** Hapus semua data transaksi atau kembalikan COA ke pengaturan awal.

**Penting:** Akun atau kategori yang sudah pernah digunakan dalam jurnal tidak dapat dihapus untuk menjaga integritas data.

---

### 8. Bantuan

Halaman ini berisi panduan warna untuk setiap jenis transaksi yang ada di aplikasi, membantu Anda mengidentifikasi jenis-jenis jurnal dengan cepat di halaman Jurnal.