const API_URL = 'https://backend-ruangan-icc.vercel.app/api/reservasi';

async function ambilDataReservasi() {
    try {
        const respons = await fetch(API_URL);
        const data = await respons.json();

        const isiTabel = document.getElementById('daftar-reservasi');
        isiTabel.innerHTML = '';

        data.forEach(reservasi => {
            const baris = `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="py-3 px-4">${reservasi.id}</td>
                <td class="py-3 px-4 font-medium text-slate-900">${reservasi.peminjaman}</td>
                <td class="py-3 px-4">${reservasi.nim}</td>
                <td class="py-3 px-4">${reservasi.semester}</td>
                <td class="py-3 px-4">${reservasi.gedung}</td>
                <td class="py-3 px-4">${reservasi.lantai}</td>
                <td class="py-3 px-4">${reservasi.ruangan}</td>
                <td class="py-3 px-4">${reservasi.waktu}</td>
                <td class="py-3 px-4">${reservasi.keperluan}</td>
                <td class="py-3 px-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${reservasi.status === 'Disetujui' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                        ${reservasi.status}
                    </span>
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

async function tambahReservasi() {
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

        if (respons.ok) {
            document.getElementById('peminjam').value = '';
            document.getElementById('ruangan').value = '';
            document.getElementById('waktu').value = '';
            document.getElementById('nim').value = '';
            document.getElementById('semester').value = '';
            document.getElementById('gedung').value = '';
            document.getElementById('lantai').value = '';
            document.getElementById('keperluan').value = '';
            
            ambilDataReservasi();
            showToast('Yeay! Reservasi berhasil dikirim.', 'sukses');
        } else {
            showToast(result.error || result.pesan || 'Gagal mengirim reservasi.', 'error');
        }
    } catch (error) {
        console.error('Gagal menghubungi server:', error);
        showToast('Terjadi masalah jaringan.', 'error');
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
