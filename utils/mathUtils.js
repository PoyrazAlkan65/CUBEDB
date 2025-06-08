// utils/mathUtils.js
/**
 * 
| Fonksiyon                    | Açıklama                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `clamp(value, min, max)`     | Bir değeri belirlenen min ve max aralığında sınırlar.                             |
| `lerp(start, end, t)`        | İki sayı arasında doğrusal interpolasyon yapar. `t` 0 ile 1 arasında bir orandır. |
| `round(value, decimals = 0)` | Verilen sayıyı belirlenen ondalık basamak sayısına yuvarlar.                      |
| `randomInt(min, max)`        | Belirtilen aralıkta rastgele tam sayı üretir. (her iki sınır dahil)               |
| `randomFloat(min, max)`      | Belirtilen aralıkta rastgele ondalıklı sayı üretir.                               |
| `factorial(n)`               | Verilen sayının faktöriyelini hesaplar (n!).                                      |
| `gcd(a, b)`                  | İki sayının en büyük ortak bölenini (GCD - Greatest Common Divisor) hesaplar.     |
| `lcm(a, b)`                  | İki sayının en küçük ortak katını (LCM - Least Common Multiple) hesaplar.         |
| `isPrime(n)`                 | Verilen sayının asal olup olmadığını kontrol eder.                                |
| `fibonacci(n)`               | Fibonacci dizisinin n. elemanını hesaplar.                                        |

 */
class MathUtils {
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  static lerp(start, end, t) {
    return start + t * (end - start);
  }

  static round(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  static factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    return n * MathUtils.factorial(n - 1);
  }

  static gcd(a, b) {
    if (!b) return a;
    return MathUtils.gcd(b, a % b);
  }

  static lcm(a, b) {
    return (a * b) / MathUtils.gcd(a, b);
  }

  static isPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;

    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  }

  static fibonacci(n) {
    if (n < 0) return NaN;
    if (n === 0) return 0;
    if (n === 1) return 1;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      const temp = a + b;
      a = b;
      b = temp;
    }
    return b;
  }
}

module.exports = MathUtils;
