const target = 1000000;

let saldo = Number(localStorage.getItem("saldo")) || 0;
let pemasukan = Number(localStorage.getItem("pemasukan")) || 0;
let pengeluaran = Number(localStorage.getItem("pengeluaran")) || 0;
let history = JSON.parse(localStorage.getItem("history")) || [];
let dark = localStorage.getItem("dark") === "true";

// Format Rupiah
function rupiah(angka){
    return "Rp" + angka.toLocaleString("id-ID");
}

// Simpan Data
function simpan(){
    localStorage.setItem("saldo", saldo);
    localStorage.setItem("pemasukan", pemasukan);
    localStorage.setItem("pengeluaran", pengeluaran);
    localStorage.setItem("history", JSON.stringify(history));
}

// Tambah Riwayat
function tambahHistory(teks){
    history.unshift({
        waktu:new Date().toLocaleString("id-ID"),
        teks:teks
    });

    if(history.length > 20){
        history.pop();
    }

    simpan();
    tampilHistory();
}

// Tampilkan Riwayat
function tampilHistory(){

    const ul=document.getElementById("history");

    ul.innerHTML="";

    if(history.length===0){
        ul.innerHTML="<li>Belum ada transaksi</li>";
        return;
    }

    history.forEach(item=>{
        ul.innerHTML += `
        <li>
            <strong>${item.teks}</strong><br>
            <small>${item.waktu}</small>
        </li>`;
    });

}

// Update Tampilan
function update(){

    document.getElementById("saldo").innerText=rupiah(saldo);
    document.getElementById("masuk").innerText=rupiah(pemasukan);
    document.getElementById("keluar").innerText=rupiah(pengeluaran);

    let persen=(saldo/target)*100;

    if(persen>100) persen=100;

    document.getElementById("persen").innerText=
    persen.toFixed(1)+"%";

    document.getElementById("progressBar").style.width=
    persen+"%";

    simpan();

}

// Tambah Saldo
document.getElementById("btnTambah").onclick=function(){

    let nominal=Number(document.getElementById("nominal").value);

    if(nominal<=0){
        alert("Masukkan nominal yang benar");
        return;
    }

    saldo+=nominal;
    pemasukan+=nominal;

    tambahHistory("➕ Menabung "+rupiah(nominal));

    document.getElementById("nominal").value="";

    update();

}

// Tarik Saldo
document.getElementById("btnKurang").onclick=function(){

    let nominal=Number(document.getElementById("nominal").value);

    if(nominal<=0){
        alert("Masukkan nominal");
        return;
    }

    if(nominal>saldo){
        alert("Saldo tidak cukup");
        return;
    }

    saldo-=nominal;
    pengeluaran+=nominal;

    tambahHistory("➖ Tarik "+rupiah(nominal));

    document.getElementById("nominal").value="";

    update();

}

// Transfer
document.getElementById("btnTransfer").onclick=function(){

    let nama=prompt("Transfer ke siapa?");

    if(!nama) return;

    let nominal=Number(prompt("Nominal transfer"));

    if(nominal<=0){
        alert("Nominal salah");
        return;
    }

    if(nominal>saldo){
        alert("Saldo tidak cukup");
        return;
    }

    saldo-=nominal;
    pengeluaran+=nominal;

    tambahHistory("💸 Transfer ke "+nama+" "+rupiah(nominal));

    update();

    alert("Transfer berhasil");

}

// Reset
document.getElementById("btnReset").onclick=function(){

    if(confirm("Reset semua data?")){

        saldo=0;
        pemasukan=0;
        pengeluaran=0;
        history=[];

        localStorage.clear();

        update();

        tampilHistory();

    }

}

// Dark Mode
const tombol=document.getElementById("darkMode");

function setDark(){

    if(dark){

        document.body.style.background=
        "linear-gradient(135deg,#000,#111,#222)";

        tombol.innerHTML="☀️";

    }else{

        document.body.style.background=
        "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)";

        tombol.innerHTML="🌙";

    }

}

tombol.onclick=function(){

    dark=!dark;

    localStorage.setItem("dark",dark);

    setDark();

}

// Jalankan
setDark();
update();
tampilHistory();