function hitungGrade(nilai) {
    if (nilai < 0 || nilai > 100) return 'input tidak valid!';
    if (nilai >= 90) return 'A - Sangat Memuaskan';
    if (nilai >= 80) return "B";
    if (nilai >= 70) return "C";
    if (nilai >= 60) return "D";
    return 'E - Tidak Lulus';
}

console.log(hitungGrade(95)); 
console.log(hitungGrade(72)); 
console.log(hitungGrade(150)); 

for (let i = 1; i <= 30; i++) {
    if (i % 15 === 0 )    console.log(`${i}: FizzBuzz`);
    else if (i % 3 === 0) console.log(`${i}: Fizz`);
    else if (i % 5 === 0) console.log(`${i}: Buzz`);
    else                  console.log(i);
}