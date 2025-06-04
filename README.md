# CUBEDB


# cubeDB

> **cubeDB**,  Çok Boyutlu Vektor Destekli Bellek İçi Veri Küpleri Oluşturmayı ve Yönetmeyi Sağlayan Yeni Nesil Veri Tabanıdır. Amaç Çok boyutlu, versiyonlanabilir, yüksek performanslı bir bellek içi veri yapısıoluşturmaktır. JavaScript ile geliştirilmiş olup yapay zeka projelerinde, hızlı önbellekleme ihtiyaçlarında ve zaman bazlı veri yönetimi senaryolarında kullanılmak üzere tasarlanmıştır.

---

## 🚀 Özellikler

* 📐 **3 Boyutlu Veri Yapısı** – `X` ve `Y` konumlarında veri, `Z` ekseninde zaman bazlı versiyon.
* 🧠 **Zaman Takibi** – `commit()` ile veri snapshot’ı al, `rollback(z)` ile geçmişe dön.
* 🧮 **Veri Karşılaştırma** – `diff(z1, z2)` ile iki versiyon arasındaki farkları gör.
* 📦 **Snapshot Alma** – `snapshot(z)` ile belirli bir Z versiyonunun anlık halini döndür.
* 🔗 **Redis / Hazelcast Uyumlu** – Genişletilebilir adapter mimarisi ile entegre çalışma (yakında).
* 🧲 **Vektör Tabanlı AI Entegrasyonu** – Vektör benzerliği ve veri drift analizi (geliştiriliyor).

---

## 📁 Proje Yapısı

```
cubeDB/
├── src/                # Temel sınıflar ve çekirdek yapı
│   └── cubeCore.js
├── test/               # Birim testleri
│   └── test.cubeCore.js
├── adapters/           # Redis, Hazelcast gibi platform adapter'ları
├── utils/              # Yardımcı modüller (serializer, logger vs.)
├── LICENSE             # Telif hakkı bildirimi
└── README.md           # Bu döküman
```

---

## 🛠 Kurulum

```bash
npm install cubeDB
```

Ya da manuel olarak klonlayarak başla:

```bash
git clone https://github.com/kullanici-adi/cubeDB.git
cd cubeDB
npm install
```

---

## 📘 Örnek Kullanım

```javascript
const CubeCore = require('./src/cubeCore');

const cube = new CubeCore();
cube.set(0, 0, 'Ali');
cube.commit();
cube.set(0, 1, 'Veli');
cube.commit();

console.log(cube.get(0, 0));       // "Ali"
console.log(cube.get(0, 1));       // "Veli"
console.log(cube.snapshot(0));     // İlk versiyon snapshot’ı
console.log(cube.diff(0, 1));      // Değişiklikleri gösterir
```

---

## ⚖️ Lisans

Bu proje açık kaynak değildir. Tüm hakları Poyraz Alkan’a aittir. Detaylar için `LICENSE` dosyasına bakınız.

---

## 📩 İletişim

Her türlü lisanslama ve ticari kullanım talebi için:

📧 **Email:** \[[your-email@example.com](mailto:your-email@example.com)]

