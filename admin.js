const API_URL = 'https://backend-ruangan-icc.vercel.app/api/reservasi';

async function ambilDataReservasi() {
    try {
        const respons = await fetch(API_URL);
        const data = await respons.json();

        const isiTabel = document.getElementById('tabel-admin');
        isiTabel.innerHTML = '';

        data.forEach(reservasi => {
            const baris = `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="py-3 px-4">${reservasi.id}</td>
                <td class="py-3 px-4 font-medium text-slate-900">
                    ${reservasi.peminjaman}
                    <div class="text-xs text-slate-500 font-normal mt-1">Kep: ${reservasi.keperluan}</div>
                </td>
                <td class="py-3 px-4">
                    ${reservasi.nim}
                    <div class="text-xs text-slate-500 mt-1">Smt ${reservasi.semester}</div>
                </td>
                <td class="py-3 px-4">
                    Ruang ${reservasi.ruangan}
                    <div class="text-xs text-slate-500 mt-1">${reservasi.gedung}, ${reservasi.lantai}</div>
                </td>
                <td class="py-3 px-4">${reservasi.waktu}</td>
                <td class="py-3 px-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        reservasi.status === 'Disetujui' ? 'bg-green-100 text-green-700' : 
                        reservasi.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                    }">
                        ${reservasi.status}
                    </span>
                </td>
                <td class="py-3 px-4 text-center whitespace-nowrap">
                    <button onclick="ubahStatus(${reservasi.id}, 'Disetujui')" class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-md shadow-sm mr-2 transition-colors">
                        Setuju
                    </button>
                    <button onclick="ubahStatus(${reservasi.id}, 'Ditolak')" class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors">
                        Tolak
                    </button>
                    <!-- Tambahan tombol Hapus jika diperlukan admin -->
                    <button onclick="hapusReservasi(${reservasi.id})" class="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white text-xs font-semibold rounded-md shadow-sm ml-2 transition-colors">
                        Hapus
                    </button>
                </td>
            </tr>
        `;            
            isiTabel.innerHTML += baris;
        });
    } catch (error) {
        console.error('Gagal mengambil data:', error);
    }
}

ambilDataReservasi();

const formReservasi = document.getElementById('form-reservasi');
if (formReservasi) {
    formReservasi.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        
        const inputPeminjam = document.getElementById('peminjam').value;
        const inputRuangan = document.getElementById('ruangan').value;
        const inputWaktu = document.getElementById('waktu').value;
        const inputNim = document.getElementById('nim').value;
        const inputSemester = document.getElementById('semester').value;
        const inputGedung = document.getElementById('gedung').value;
        const inputLantai = document.getElementById('lantai').value;
        const inputKeperluan = document.getElementById('keperluan').value;

        if (!inputPeminjam || !inputRuangan || !inputWaktu || !inputNim || !inputSemester || !inputGedung || !inputLantai || !inputKeperluan) {
            showToast('Tolong isi semua kolom form terlebih dahulu!', 'error');
            return;
        }

        const dataBaru = {
            peminjaman: inputPeminjam,
            ruangan: inputRuangan,
            waktu: inputWaktu,
            nim: inputNim,
            semester: inputSemester, 
            gedung: inputGedung,
            lantai: inputLantai,
            keperluan: inputKeperluan
        };

        try {
            const respons = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataBaru)
            });

            const result = await respons.json();

            if (respons.ok){
                formReservasi.reset();
                ambilDataReservasi();
                showToast('Data berhasil ditambahkan admin', 'sukses');
            } else {
                showToast(result.error || result.pesan || 'Backend menolak menyimpan data', 'error');
            }
        } catch (error){
            console.error('Gagal menghubungi server:', error);
            showToast('Terjadi masalah jaringan', 'error');
        }
    });
}

async function hapusReservasi(id) {
    const konfirmasi = confirm('Yakin ingin menghapus jadwal ruangan ini?');
    if (!konfirmasi) return;

    try {
        const respons = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (respons.ok) {
            ambilDataReservasi(); 
            showToast('Data berhasil dihapus', 'sukses');
        } else {
            showToast('Server menolak menghapus data', 'error');
        }
    } catch (error) {
        console.error('Gagal terhubung ke server:', error);
        showToast('Terjadi masalah jaringan saat menghapus', 'error');
    }
}

async function ubahStatus(id, statusBaru) {
    try {
        const respons = await fetch(`${API_URL}/${id}`, {
            method:'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ statusBaru: statusBaru })
        });

        if (respons.ok){
            ambilDataReservasi();
            showToast(`Status berhasil diubah menjadi ${statusBaru}!`, 'sukses');
        } else {
            showToast('Gagal memperbarui status.', 'error');
        }
    } catch (error) {
        console.error('Gagal terhubung ke server:', error);
        showToast('Terjadi masalah jaringan', 'error');
    }
}

function showToast(pesan, tipe = 'sukses') {
    const toast = document.createElement('div');
    const bgColor = tipe === 'sukses' ? 'bg-emerald-600' : 'bg-rose-600';
    
    toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold transition-all duration-300 transform translate-y-4 opacity-0 ${bgColor}`;
    toast.innerText = pesan;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-4', 'opacity-0');
        
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
