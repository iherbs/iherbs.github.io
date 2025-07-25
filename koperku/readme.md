# Koperku - Aplikasi Koperasi, Kas dan Tabungan

Selamat datang di Koperku, solusi digital untuk mengelola Koperasi, Kas, dan Tabungan secara profesional dan mudah digunakan. Modernkan operasional, tingkatkan akurasi, dan berdayakan anggota Anda dengan sistem kami.

## Panduan Penggunaan Aplikasi

Dokumen ini digunakan untuk memandu Anda dalam menggunakan fitur-fitur utama yang tersedia di aplikasi Koperku.

### 1. Dashboard
- **Fungsi**: Halaman utama yang memberikan ringkasan kondisi keuangan koperasi Anda secara cepat.
- **Cara Penggunaan**:
    - **Kartu Statistik**: Lihat ringkasan bulanan untuk Total Pendapatan, Total Biaya, dan Laba/Rugi.
    - **Total Saldo Simpanan**: Menampilkan total dana simpanan dari semua anggota.
    - **Grafik Aktivitas**: Visualisasi perbandingan jumlah simpanan yang masuk dan pinjaman yang cair dalam 6 bulan terakhir.
    - **Filter Periode**: Anda dapat mengubah bulan dan tahun untuk melihat data statistik pada periode tertentu.

### 2. Simpanan Wajib
- **Fungsi**: Mengelola dan memantau pembayaran simpanan wajib dari setiap anggota.
- **Cara Penggunaan**:
    - **Tab Tunggakan**: Menampilkan daftar anggota yang memiliki tunggakan simpanan wajib secara kumulatif. Anda bisa langsung mencatat pembayaran dari sini.
    - **Tab Sudah Membayar**: Menampilkan daftar anggota yang telah membayar simpanan wajib pada periode (bulan dan tahun) yang dipilih.
    - **Penting**: Fitur ini memerlukan "Jenis Simpanan" dengan nama **Wajib** dan nominal simpanan wajib yang telah diatur di halaman **Pengaturan**.

### 3. Simpanan
- **Fungsi**: Mencatat semua jenis transaksi simpanan, seperti Simpanan Pokok, Sukarela, Qurban, dll.
- **Cara Penggunaan**:
    - **Tab Catatan Transaksi**:
        - Klik **"Tambah Transaksi"** untuk mencatat setoran atau penarikan.
        - Isi formulir: pilih anggota, jenis simpanan, jumlah, tanggal, dan tipe transaksi (setoran/penarikan).
        - Anda dapat mengedit atau menghapus transaksi melalui menu aksi (ikon titik tiga).
    - **Tab Jenis Simpanan**:
        - Kelola kategori simpanan Anda di sini (misal: Simpanan Pendidikan, Hari Raya).
        - Jenis simpanan "Pokok" dan "Wajib" adalah bawaan sistem dan tidak dapat dihapus.

### 4. Angsuran
- **Fungsi**: Memantau status pembayaran angsuran pinjaman anggota setiap bulannya.
- **Cara Penggunaan**:
    - Pilih bulan dan tahun untuk melihat status pembayaran pada periode tersebut.
    - **Tab Belum Membayar**: Menampilkan daftar anggota yang memiliki pinjaman aktif namun belum membayar angsuran di bulan yang dipilih. Klik ikon pensil untuk langsung diarahkan ke halaman detail pinjaman dan mencatat pembayaran.
    - **Tab Sudah Membayar**: Menampilkan riwayat anggota yang telah melunasi angsuran di bulan yang dipilih.

### 5. Pendapatan
- **Fungsi**: Mencatat semua sumber pendapatan di luar bunga pinjaman, misalnya hibah, donasi, atau penjualan aset.
- **Cara Penggunaan**:
    - **Tab Catatan Pendapatan**: Catat transaksi pendapatan baru, lihat riwayat, edit, atau hapus.
    - **Tab Jenis Pendapatan**: Kelola kategori pendapatan Anda (misal: Donasi, Hibah, Sewa Aset).

### 6. Biaya Operasional
- **Fungsi**: Mencatat semua pengeluaran yang berkaitan dengan operasional koperasi.
- **Cara Penggunaan**:
    - **Tab Catatan Biaya**: Catat transaksi biaya baru, seperti biaya listrik, ATK, atau gaji.
    - **Tab Jenis Biaya**: Kelola kategori biaya Anda (misal: ATK, Transportasi, Listrik & Air).

### 7. Pinjaman
- **Fungsi**: Mengelola seluruh siklus pinjaman anggota, dari pengajuan hingga pelunasan.
- **Cara Penggunaan**:
    - Klik **"Tambah Pinjaman"** untuk membuat pinjaman baru. Isi data anggota, jumlah pokok, tenor, bunga, dan biaya admin. Sistem akan menghitung angsuran per bulan secara otomatis.
    - Klik pada salah satu baris pinjaman untuk melihat **detail pinjaman**. Di halaman detail, Anda dapat:
        - Melihat ringkasan pinjaman.
        - Mencatat pembayaran cicilan baru.
        - Melihat riwayat pembayaran cicilan.

### 8. Anggota
- **Fungsi**: Pusat data untuk mengelola semua anggota koperasi.
- **Cara Penggunaan**:
    - Klik **"Tambah Anggota"** untuk mendaftarkan anggota baru.
    - Isi data diri anggota. Kolom **PIN** bersifat opsional dan digunakan untuk melindungi halaman cek saldo publik milik anggota.
    - **Aksi per Anggota**:
        - **Edit**: Mengubah data anggota.
        - **Bagikan Tautan**: Mendapatkan URL unik yang bisa dibagikan kepada anggota untuk mengecek saldo simpanan mereka secara mandiri.
        - **Hapus**: Menghapus data anggota.

### 9. Riwayat Transaksi
- **Fungsi**: Buku kas digital yang mencatat semua transaksi keuangan (kas masuk dan keluar) dari seluruh modul.
- **Cara Penggunaan**:
    - Halaman ini bersifat *read-only* dan menampilkan log transaksi yang terurut dari yang terbaru.
    - Gunakan fitur paginasi di bagian bawah untuk menavigasi riwayat transaksi.

### 10. Laporan
- **Fungsi**: Menghasilkan berbagai jenis laporan keuangan secara otomatis.
- **Cara Penggunaan**:
    - Pilih jenis laporan yang ingin Anda lihat.
    - Untuk laporan seperti Arus Kas, Laba Rugi, dan Simpanan Anggota, Anda dapat memfilternya berdasarkan periode bulan dan tahun.
    - Untuk laporan **Simpanan Anggota**, tersedia tombol **"Ekspor ke Excel"** untuk mengunduh data dalam format `.xlsx`.

### 11. Pengaturan
- **Fungsi**: Mengonfigurasi informasi dasar dan parameter koperasi Anda.
- **Cara Penggunaan**:
    - **Profil Koperasi**: Ubah nama koperasi Anda.
    - **Pengaturan Publik**:
        - Aktifkan laporan publik (saat ini Laporan Arus Kas).
        - Buat URL kustom yang mudah diingat (misal: `koperku.com/lap/kas-rt-sejahtera`).
        - Lindungi laporan publik dengan kata sandi.
    - **Pengaturan Keuangan**: Atur nominal default untuk **Simpanan Wajib** yang akan digunakan di modul Simpanan Wajib.
    - **Pengaturan SHU**: Atur persentase alokasi Sisa Hasil Usaha (SHU) untuk Jasa Modal dan Jasa Usaha.
    - **Ubah Kata Sandi**: Ganti kata sandi login Anda.

### 12. Bukti Transaksi
- **Kuitansi**: Cetak bukti transaksi.

---
*Terima kasih telah menggunakan Koperku!*
