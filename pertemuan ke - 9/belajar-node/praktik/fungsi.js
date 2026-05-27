const kalkulator = {
tambah: (a, b) => a + b,
kurangi: (a, b) => a - b,
kali: (a, b) => a * b,
bagi: (a, b) => b !== 0 ? a / b : 'Error: dibagi nol!',
pangkat: (a, b) => a ** b,
};
console.log(kalkulator.tambah(10, 5)); 
console.log(kalkulator.bagi(10, 0)); 
console.log(kalkulator.pangkat(2, 8)); 

function terapkan(arr, fn) { return arr.map(fn); }
console.log(terapkan([1,2,3,4], x => x**2)); 
console.log(terapkan([1,2,3,4], x => x%2===0)); 


function buatRekening(saldoAwal) {
let saldo = saldoAwal;
return {
setor: (n) => { saldo += n; console.log(`Saldo: ${saldo}`); },
tarik: (n) => { if (n > saldo) { console.log('Saldo kurang!'); return; }
saldo -= n; console.log(`Saldo: ${saldo}`); },
cek: () => saldo,
};
}
const rek = buatRekening(500000);
rek.setor(200000); 
rek.tarik(1000000); 
rek.tarik(100000); 