## Nama Anggota kelompok
1. Eko Prasetyo Julianto (42230007) --Dashboard service
2. Ni Komang Sintya Dewi (42230012) --Taskplanner service
3. Luh Gede Sindy Pratiwi (42230014) --Frontend service
4. Putu Surya Jaya Permana (42230040) --Auth service
5. I Gede Agus Perdana Putra (42230058) --Todo service
   
## Tema Aplikasi
**Taskflow** Aplikasi Manajemen Tugas dengan fitur pengelolaan project, autentikasi pengguna, todo list, notifikasi tenggat waktu, serta halaman dashboard untuk monitoring aktivitas.

## Arsitektur Layanan
Proyek ini terdiri dari 6 container utama:
1. **MongoBD** (database service)
2. **Auth Service** "Login, Register, Token JWT"
3. **TaskPlanner** "Manajemen tugas/ project"
4. **Dashboard Service** "History dan Ringkas Aktivitas"
5. **Todo Service** "Sistem todo list dan notifikasi"
6. **Frontend** "Antarmuka aplikasi TaskFlow"
Semua service berjalan independen, saling terhubung hanya melalui API, dan berbagi data

## Cara Menjalankan
1. Membangun dan menjalankan semua container menggunakan "docker compose up --build"
2. Akses layanan melalui browser
Frontend: http://localhost:5173
Auth Service: http://localhost:5050
TaskPlanner: http://localhost:5005
Todo Service: http://localhost:5010
Dashboard Service: http://localhost:3001
MongoDB: port 27017
Semua service otomatis terhubung satu sama lain melalui docker network.
