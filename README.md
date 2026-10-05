# DiyetWeb - Kişiselleştirilmiş Diyet, Dışarıda Yemek & Karbonhidrat Takipçisi

DiyetWeb; boy, kilo, yaş ve aktivite değerlerinize göre günlük kalori ve makrolarınızı hesaplayan, **öğün sayısını dilediğiniz gibi seçebildiğiniz**, **dışarıda yediğiniz yemeklerin ve kaçamakların kalorisini kaydedebildiğiniz**, **diyabet / insülin direnci için karbonhidrat sayımı (KE)** yapabilen ve **maksimum 100g protein sınırını** koruyan kapsamlı bir beslenme uygulamasıdır.

---

## 🌟 Yeni Eklenen Özellikler

### 1. 🍽️ Esnek Öğün Sayısı Seçimi
Form üzerinden dilediğiniz beslenme ritmini seçebilirsiniz:
- **2 Öğün:** Aralıklı Oruç (16:8) uyumlu Sabah Kahvaltısı (10:30) ve Akşam Yemeği (19:00).
- **2 Ana Öğün + 1 Ara Öğün (Varsayılan):** Sabah Kahvaltısı, İkindi Ara Öğünü ve Akşam Yemeği.
- **3 Ana Öğün:** Klasik Kahvaltı, Öğle Yemeği ve Akşam Yemeği.
- **3 Ana Öğün + 1 Ara Öğün:** Kahvaltı, Öğle, İkindi Ara Öğünü ve Akşam Yemeği.
- **3 Ana Öğün + 2 Ara Öğün:** Kahvaltı, Kuşluk Ara, Öğle, İkindi Ara ve Akşam Yemeği.
*Seçilen öğün sayısına göre günlük hedef kalori ve makrolar otomatik olarak dağıtılır.*

---

### 2. ✍️ Yediklerim & Dışarıda Yemek Takipçisi
Hafta sonu dışarıda yemek yediğinizde veya restorana gittiğinizde aldığınız kalorileri anlık olarak takip edebilirsiniz:
- **Popüler Restoran Menüleri (Hızlı Ekle):** Izgara Köfte Menü, Tavuk Şiş Dürüm, Pizza dilimi, Et Döner, Hamburger, Izgara Somon gibi sık tüketilen dışarı yemeklerini tek tıkla günlüğünüze ekleyebilirsiniz.
- **Manuel Yemek Girişi:** Yediğiniz yemeğin adını, öğününü, kalorisini, karbonhidratını, proteinini ve yağını yazıp listenize ekleyebilirsiniz.
- **Canlı Bütçe Çubuğu:** Günlük hedef kalorinizden ne kadar yediğinizi ve ne kadar hakkınız kaldığını anlık gösterir.
- **Maksimum 100g Protein Güvenlik Alarmı:** Gün içinde yediğiniz toplam protein 100 gramı aşarsa sistem kırmızı uyarı verir (`⚠️ DİKKAT: 100g Sınırı Aşıldı`).
- **Veri Kalıcılığı (LocalStorage):** Sayfayı kapatsanız veya yenileseniz dahi kaydettiğiniz yemekler silinmez.

---

### 3. 🩸 Diyabet & Karbonhidrat Sayımı (KE Modu)
Diyabet, insülin direnci veya reaktif hipoglisemi yaşayan bireyler için klinik karbonhidrat sayımı entegre edilmiştir:
- **1 KE = 15g Karbonhidrat:** Standart diyetisyen kuralı uygulanır.
- Menüdeki tüm yiyeceklerin ve günlük toplamın kaç **Karbonhidrat Eşdeğeri (KE)** olduğu hesaplanır.
- Tek öğünde 4 KE (60g CHO) aşıldığında ani şeker fırlamasına karşı uyarı verilir.
- Sayfadaki **"Diyabet & Karbonhidrat Rehberi"** sekmesinde glisemik indeks, lif kalkanı ve besinlerin KE eşdeğer tablosu yer alır.

---

### 4. 🛡️ Maksimum 100g Protein Koruması
Tüm hazır menüler ve kalori hesaplamaları günlük protein miktarının **100 gramı aşmaması** garantisiyle yapılandırılmıştır.

---

### 5. 🖨️ Sayfa Altı Hızlı Yazdır / PDF Butonları
- **Haftalık / Günlük Yemek Listesi Altında:** Günün menüsünü veya 7 günlük programı tek tıkla A4 çıktısına / PDF'e dönüştürür.
- **Alışveriş Listesi Altında:** Yalnızca alışveriş listesini temiz ve okunaklı biçimde yazdırır.

---

### 6. 🔄 Sol Menü Besin Değişim & Kalori Eşitleyici
- **Referans Besin Seçimi:** Menüdeki bir besini (örn: 150g tavuk göğsü, 2 dilim ekmek, beyaz peynir, ceviz vb.) seçebilir veya doğrudan istediğiniz kalori, protein ve karbonhidrat değerini elle yazabilirsiniz.
- **Eşdeğer Porsiyon Hesaplayıcı:** Yerine yemek istediğiniz gıdayı (örn: Somon, Köfte, Haşlanmış Yumurta, Nohut, Lor Peyniri, Bulgur vb.) seçtiğinizde, **tam olarak aynı kaloriye** denk gelmesi gereken porsiyonu (gram veya adet olarak) otomatik hesaplar.
- **Makro & 100g Protein Koruması:** Değişim sonrasında oluşacak protein, karbonhidrat (KE) ve yağ değerlerini gösterir, 100g protein sınırını aşmadığını doğrular.
- **Tek Tıkla Günlüğe Aktarma:** "Bu Değişimi Günlüğüme Ekle" butonuyla hesaplanan besini doğrudan yemek günlüğünüze ekleyebilirsiniz.

---

## 🚀 Nasıl Çalıştırılır?

1. `c:\Users\KadriyeTUNA\Desktop\diyetweb` klasöründeki `index.html` dosyasına **çift tıklayın** (veya tarayıcınızda açın).
2. Sol panelden boy, kilo, öğün sayısı ve diyabet modunu seçip **"Kalori Hesapla & Menüyü Güncelle"** butonuna basın.
3. Üstteki sekmelerden **"Yediklerim & Dışarıda Yemek Takipçisi"** sekmesine geçerek gün içinde veya hafta sonu dışarıda yediklerinizi kaydedin.

---

## 📁 Dosya Yapısı

```
diyetweb/
├── index.html       # Esnek sekmeli arayüz, öğün seçici, yemek günlüğü ve diyabet rehberi
├── style.css        # Responsive dashboard tasarımı, canlı bütçe çubukları ve yazdırma stilleri
├── app.js           # Mifflin-St Jeor hesabı, esnek öğün motoru, KE çevirici ve localStorage günlüğü
├── supabase.js      # Supabase JavaScript bulut veritabanı entegrasyonu
├── schema.sql       # Supabase için hazır PostgreSQL veritabanı şeması & RLS politikaları
├── vercel.json      # Vercel statik yayınlama & yönlendirme yapılandırması
└── README.md        # Kullanım kılavuzu ve teknik detaylar
```

---

## ☁️ Supabase Veritabanı Kurulumu (Adım Adım)

1. **Supabase Hesabı Açın:** [supabase.com](https://supabase.com) adresine gidin ve GitHub hesabınızla giriş yapın.
2. **Yeni Proje Oluşturun:** "New Project" butonuna basın, bir proje adı (örn: `diyetweb-db`) ve veritabanı şifresi belirleyip oluşturun.
3. **Tabloları Yükleyin:**
   - Sol menüden **SQL Editor** simgesine tıklayın.
   - Projenizdeki [schema.sql](file:///c:/Users/KadriyeTUNA/Desktop/diyetweb/schema.sql) dosyasının tüm içeriğini kopyalayıp buraya yapıştırın.
   - Sağ alttaki yeşil **"RUN"** butonuna basın. *(Böylece `profiles` ve `food_logs` tablolarınız ve güvenlik kurallarınız saniyeler içinde kurulur).*
4. **Bağlantı Bilgilerini Alın:**
   - Sol menünün en altındaki **Project Settings** (Dişli çark) -> **API** sekmesine gidin.
   - Buradaki **Project URL** ve **anon public Key** değerlerini kopyalayın.
   - Web sayfanızın sağ üstündeki **"☁️ Veritabanı"** butonuna basıp bu değerleri yapıştırarak kaydedin.

---

## 🚀 Vercel Üzerinde Yayınlama (Adım Adım)

1. **GitHub Repositorisi:**
   - Masaüstünüzdeki `diyetweb` klasörünü GitHub hesabınıza yeni bir repo olarak yükleyin (örn: `diyetweb`).
2. **Vercel'e Bağlanın:**
   - [vercel.com](https://vercel.com) adresine gidip GitHub hesabınızla giriş yapın.
   - **"Add New..." -> "Project"** butonuna tıklayın.
   - GitHub listenizden **`diyetweb`** deposunu bulun ve **"Import"** butonuna basın.
   - Framework Preset kısmında herhangi bir ayarı değiştirmenize gerek yoktur (HTML/CSS/JS otomatik algılanır).
   - **"Deploy"** butonuna basın!
3. Yaklaşık 30 saniye sonra web siteniz `https://diyetweb-xxx.vercel.app` şeklinde dünya çapında yayına açılmış olacaktır.
