/**
 * DiyetWeb - Esnek Öğünlü Diyet, Dışarıda Yemek & Kalori/Karbonhidrat Takipçisi
 * 
 * Özellikler:
 * 1. Seçilebilir Öğün Sayısı (2 Öğün, 2+1, 3 Öğün, 3+1, 3+2)
 * 2. Yediklerim & Dışarıda Yemek Takipçisi (Manuel giriş, hazır popüler restoran menüleri)
 * 3. Diyabet & Karbonhidrat Sayımı Modu (1 KE = 15g Karbonhidrat)
 * 4. Maksimum 100g Protein Koruması (Asla 100g protein aşılmaz, aşılırsa uyarı verir)
 * 5. LocalStorage ile günlük yenen yemeklerin saklanması
 */

// ==========================================
// 1. POPÜLER DIŞARIDA YEMEK ŞABLONLARI
// ==========================================
const DINING_OUT_TEMPLATES = [
  { name: "Izgara Köfte + Salata + Ayran", cat: "Dışarıda Yemek", cal: 580, carb: 35, prot: 38, fat: 32, note: "Klasik dışarıda ızgara menüsü" },
  { name: "Tavuk Şiş / Dürüm Menü", cat: "Dışarıda Yemek", cal: 520, carb: 48, prot: 36, fat: 18, note: "Lavaşlı tavuk şiş porsiyon" },
  { name: "Et Döner Porsiyon + Lavaş", cat: "Dışarıda Yemek", cal: 620, carb: 42, prot: 44, fat: 30, note: "Porsiyon yaprak et döner" },
  { name: "2 Dilim Karışık Pizza", cat: "Kaçamak / Hafta Sonu", cal: 560, carb: 64, prot: 22, fat: 24, note: "Orta boy karışık pizza" },
  { name: "Klasik Hamburger + Patates", cat: "Kaçamak / Hafta Sonu", cal: 790, carb: 86, prot: 28, fat: 38, note: "Tek köfteli burger ve küçük boy patates" },
  { name: "Restoranda Izgara Somon & Fırın Patates", cat: "Dışarıda Yemek", cal: 540, carb: 26, prot: 38, fat: 28, note: "Omega-3 deposu sağlıklı restoran tercihi" },
  { name: "Tavuklu Sezar Salata (soslu)", cat: "Dışarıda Yemek", cal: 440, carb: 18, prot: 34, fat: 26, note: "Sosuna dikkat edilerek tüketilmeli" },
  { name: "Kafe Tipi Latte + Fit Yulaf Kurabiyesi", cat: "Ara Öğün", cal: 240, carb: 28, prot: 7, fat: 10, note: "Dışarıda kahve molası" }
];

// ==========================================
// 2. ÖĞÜN VERİ TABANI (7 GÜNLÜK & TÜM ÖĞÜN TİPLERİ)
// ==========================================
// Her gün için: kahvaltı, ara öğün (kuşluk), öğle, ara öğün (ikindi), akşam yemeği
const MASTER_MEALS = [
  {
    dayIndex: 0,
    dayName: "1. Gün - Klasik Akdeniz Dengesi",
    breakfast: {
      title: "1. Ana Öğün: Doyurucu Akdeniz Kahvaltısı",
      time: "10:30",
      icon: "fa-egg",
      colorClass: "badge-breakfast",
      note: "Yumurta ve zeytinin sağlıklı yağları tokluk süresini uzatır, insülin dalgalanmasını önler.",
      items: [
        { name: "Haşlanmış Yumurta (veya 1 tatlı kaşığı zeytinyağında)", portion: "2 adet (100g)", cal: 155, prot: 13, carb: 1.1, fat: 10.6 },
        { name: "Tam Yağlı Beyaz Peynir veya Şirden Mayalı Peynir", portion: "40g (2 parmak dilim)", cal: 110, prot: 8, carb: 0.8, fat: 8.5 },
        { name: "Az Tuzlu Siyah / Yeşil Zeytin", portion: "6-8 adet (25g)", cal: 45, prot: 0.3, carb: 1.2, fat: 4.5 },
        { name: "Tam Buğday veya Ekşi Mayalı Ekmek", portion: "2 ince dilim (60g)", cal: 140, prot: 5.5, carb: 28, fat: 1.2 },
        { name: "Ceviz İçi", portion: "2 tam ceviz (15g)", cal: 98, prot: 2.2, carb: 2.1, fat: 9.8 },
        { name: "Mevsim Yeşillikleri (Roka, Maydanoz, Salatalık)", portion: "1 büyük kase", cal: 35, prot: 1.5, carb: 6, fat: 0.4 }
      ]
    },
    morningSnack: {
      title: "Kuşluk Ara Öğünü",
      time: "11:00",
      icon: "fa-mug-hot",
      colorClass: "badge-snack",
      note: "Hafif metabolizma canlandırıcı ara öğün.",
      items: [
        { name: "Filtre Kahve veya Şekersiz Yeşil Çay", portion: "1 büyük kupa", cal: 4, prot: 0.1, carb: 0.8, fat: 0 },
        { name: "Çiğ Badem", portion: "6-8 adet (10g)", cal: 60, prot: 2.1, carb: 2.1, fat: 5.2 }
      ]
    },
    lunch: {
      title: "Öğle Yemeği: Zeytinyağlı Sebze & Siyez Bulguru",
      time: "13:00",
      icon: "fa-bowl-rice",
      colorClass: "badge-lunch",
      note: "Yüksek posa içeriğiyle kan şekerini stabil tutar.",
      items: [
        { name: "Zeytinyağlı Taze Fasulye veya Kabak Yemeği", portion: "7-8 yemek kaşığı (180g)", cal: 140, prot: 3.5, carb: 16, fat: 7.0 },
        { name: "Siyez veya Başbaşı Bulgur Pilavı", portion: "4 yemek kaşığı (100g pişmiş)", cal: 145, prot: 4.2, carb: 30, fat: 1.1 },
        { name: "Doğal Ev Yoğurdu (pul biberli)", portion: "4 yemek kaşığı (150g)", cal: 95, prot: 5.5, carb: 7.2, fat: 4.8 },
        { name: "Bol Limonlu Yeşil Salata", portion: "1 büyük kase", cal: 40, prot: 1.2, carb: 5, fat: 1.5 }
      ]
    },
    afternoonSnack: {
      title: "İkindi Ara Öğünü: Meyve & Badem",
      time: "16:00",
      icon: "fa-apple-whole",
      colorClass: "badge-snack",
      note: "Akşam yemeğinde aşırı yemenin önüne geçen kalkan öğün.",
      items: [
        { name: "Yeşil veya Kırmızı Elma (tarçınlı)", portion: "1 orta boy (150g)", cal: 80, prot: 0.5, carb: 20, fat: 0.3 },
        { name: "Çiğ Badem veya Fındık", portion: "10 adet (15g)", cal: 90, prot: 3.2, carb: 3.2, fat: 7.8 },
        { name: "Şekersiz Rezene veya Yeşil Çay", portion: "1 fincan (200ml)", cal: 2, prot: 0.1, carb: 0.5, fat: 0 }
      ]
    },
    dinner: {
      title: "2. Ana Öğün: Kekikli Izgara Tavuk Göğsü & Salata",
      time: "19:00",
      icon: "fa-drumstick-bite",
      colorClass: "badge-dinner",
      note: "Protein 100g sınırını aşmamak için tavuk porsiyonu 150g tartılmıştır.",
      items: [
        { name: "Kekikli & Sarımsaklı Izgara Tavuk Göğsü", portion: "150g (çiğ tartım)", cal: 245, prot: 44, carb: 0, fat: 5.2 },
        { name: "Fırında Karışık Sebze Garnitür (Brokoli & Havuç)", portion: "1 tabak (150g)", cal: 70, prot: 2.8, carb: 10, fat: 2.0 },
        { name: "Zeytinyağlı & Nar Ekşili Akdeniz Salatası", portion: "1 porsiyon (1 tatlı kaşığı zeytinyağı)", cal: 80, prot: 1.5, carb: 5, fat: 6.0 },
        { name: "Probiyotik Ayran veya Yoğurt", portion: "1 su bardağı (200ml)", cal: 75, prot: 4.2, carb: 5.8, fat: 3.5 }
      ]
    }
  },
  {
    dayIndex: 1,
    dayName: "2. Gün - Tok Tutan Lifli Menü",
    breakfast: {
      title: "1. Ana Öğün: Avokadolu & Yumurtalı Enerji Kahvaltısı",
      time: "10:30",
      icon: "fa-bread-slice",
      colorClass: "badge-breakfast",
      note: "Avokado ve yumurta birlikteliği kan şekerini gün boyu dengeler.",
      items: [
        { name: "Göz veya Çırpılmış Yumurta (1 çay kaşığı tereyağı)", portion: "2 adet (100g)", cal: 170, prot: 13, carb: 1.1, fat: 12.5 },
        { name: "Ezilmiş Olgun Avokado (limonlu)", portion: "Yarım avokado (75g)", cal: 120, prot: 1.5, carb: 6, fat: 11 },
        { name: "Çörek Otlu Lor Peyniri", portion: "3 yemek kaşığı (50g)", cal: 75, prot: 9.5, carb: 1.8, fat: 3.2 },
        { name: "Ekşi Mayalı Çavdar Ekmeği", portion: "2 dilim (60g)", cal: 140, prot: 5.2, carb: 28, fat: 1.2 },
        { name: "Söğüş Domates, Biber, Salatalık", portion: "Serbest porsiyon", cal: 30, prot: 1.2, carb: 5.5, fat: 0.3 }
      ]
    },
    morningSnack: {
      title: "Kuşluk Ara Öğünü",
      time: "11:00",
      icon: "fa-lemon",
      colorClass: "badge-snack",
      note: "Tazeleyici C vitamini ve antioksidan desteği.",
      items: [
        { name: "Limonlu Taze Nane Çayı", portion: "1 kupa", cal: 3, prot: 0.1, carb: 0.6, fat: 0 },
        { name: "Ceviz İçi", portion: "1 tam ceviz (8g)", cal: 52, prot: 1.2, carb: 1.1, fat: 5.2 }
      ]
    },
    lunch: {
      title: "Öğle Yemeği: Kıymalı / Sebzeli Mercimek Çorbası & Yoğurt",
      time: "13:00",
      icon: "fa-bowl-food",
      colorClass: "badge-lunch",
      note: "Kırmızı mercimek bitkisel lif ve B grubu vitaminleriyle zengindir.",
      items: [
        { name: "Süzme Kırmızı Mercimek Çorbası", portion: "1.5 kepçe (250ml)", cal: 165, prot: 8.5, carb: 26, fat: 3.2 },
        { name: "Naneli ve Salatalıklı Yoğurtlu Cacık", portion: "1 büyük kase (200g)", cal: 105, prot: 6.2, carb: 8.0, fat: 5.0 },
        { name: "Karakılçık Ekmeği", portion: "1 dilim (30g)", cal: 70, prot: 2.6, carb: 14, fat: 0.6 },
        { name: "Mor Lahana & Roka Salatası", portion: "1 kase", cal: 35, prot: 1.2, carb: 6, fat: 0.5 }
      ]
    },
    afternoonSnack: {
      title: "İkindi Ara Öğünü: Doğal Kefir & Çilek",
      time: "16:00",
      icon: "fa-glass-water",
      colorClass: "badge-snack",
      note: "Probiyotik bakteriler bağırsak sağlığını destekler.",
      items: [
        { name: "Sade Doğal Kefir", portion: "1 su bardağı (200ml)", cal: 110, prot: 6.5, carb: 9.5, fat: 5.0 },
        { name: "Taze Çilek veya Yaban Mersini", portion: "6-8 adet (100g)", cal: 45, prot: 0.8, carb: 10, fat: 0.4 }
      ]
    },
    dinner: {
      title: "2. Ana Öğün: Fırında Hindi Sote & Fırın Sebzeler",
      time: "19:00",
      icon: "fa-fire-burner",
      colorClass: "badge-dinner",
      note: "Hindi eti düşük yağ ve yüksek sindirilebilir protein içerir.",
      items: [
        { name: "Fırında Sebzeli Hindi Kuşbaşı", portion: "140g hindi + biber, mantar", cal: 220, prot: 38, carb: 4.0, fat: 5.0 },
        { name: "Fırınlanmış Zeytinyağlı Kabak & Karnabahar", portion: "1 tabak (200g)", cal: 90, prot: 3.2, carb: 10, fat: 4.2 },
        { name: "Doğal Ev Yoğurdu", portion: "3 yemek kaşığı (120g)", cal: 80, prot: 4.5, carb: 6.0, fat: 4.0 },
        { name: "Yeşil Çoban Salata", portion: "1 tabak", cal: 40, prot: 1.2, carb: 5, fat: 1.5 }
      ]
    }
  },
  {
    dayIndex: 2,
    dayName: "3. Gün - Balık & Omega-3 Günü",
    breakfast: {
      title: "1. Ana Öğün: Mantarlı & Maydanozlu 2 Yumurtalı Omlet",
      time: "10:30",
      icon: "fa-egg",
      colorClass: "badge-breakfast",
      note: "Mantar D vitamini ve mineral deposudur.",
      items: [
        { name: "Mantarlı & Maydanozlu Omlet", portion: "2 yumurta + 60g mantar", cal: 180, prot: 14.5, carb: 2.5, fat: 12.5 },
        { name: "Ezine / Tulum Peyniri", portion: "35g (1.5 kibrit kutusu)", cal: 115, prot: 7.5, carb: 0.5, fat: 9.2 },
        { name: "Zeytin Çeşitleri", portion: "6 adet (20g)", cal: 40, prot: 0.3, carb: 1.0, fat: 4.0 },
        { name: "Kızarmış Ekşi Mayalı Ekmek", portion: "2 ince dilim (60g)", cal: 140, prot: 5.5, carb: 28, fat: 1.2 },
        { name: "Çeri Domates & Nane Tabağı", portion: "1 tabak", cal: 30, prot: 1.2, carb: 5.0, fat: 0.3 }
      ]
    },
    morningSnack: {
      title: "Kuşluk Ara Öğünü",
      time: "11:00",
      icon: "fa-mug-hot",
      colorClass: "badge-snack",
      note: "Sade Türk kahvesi metabolizma hızlandırır.",
      items: [
        { name: "Sade Türk Kahvesi veya Espresso", portion: "1 fincan", cal: 2, prot: 0.1, carb: 0.3, fat: 0 },
        { name: "Çiğ Fındık", portion: "8 adet (10g)", cal: 65, prot: 1.5, carb: 1.7, fat: 6.0 }
      ]
    },
    lunch: {
      title: "Öğle Yemeği: Zeytinyağlı Enginar veya Pırasa & Bulgur",
      time: "13:00",
      icon: "fa-leaf",
      colorClass: "badge-lunch",
      note: "Enginar karaciğeri temizler ve safra akışını destekler.",
      items: [
        { name: "Zeytinyağlı Garnitürlü Enginar", portion: "1.5 adet (180g)", cal: 150, prot: 3.5, carb: 20, fat: 6.5 },
        { name: "Siyez Bulguru Pilavı", portion: "3 yemek kaşığı (75g)", cal: 110, prot: 3.2, carb: 23, fat: 0.8 },
        { name: "Yoğurtlu Semizotu Salatası", portion: "1 kase (150g)", cal: 90, prot: 4.8, carb: 6.2, fat: 4.5 }
      ]
    },
    afternoonSnack: {
      title: "İkindi Ara Öğünü: Yoğurt & Chia Tohumu",
      time: "16:00",
      icon: "fa-seedling",
      colorClass: "badge-snack",
      note: "Chia tohumunun jelleşen lifleri uzun süreli tokluk hissi sağlar.",
      items: [
        { name: "Süzme Yoğurt", portion: "3 yemek kaşığı (100g)", cal: 90, prot: 8.0, carb: 4.0, fat: 4.5 },
        { name: "Chia Tohumu & Taze Kivi", portion: "1 tatlı kaşığı chia + yarım kivi", cal: 60, prot: 1.5, carb: 8.5, fat: 1.8 }
      ]
    },
    dinner: {
      title: "2. Ana Öğün: Fırında Somon / Levrek & Bebek Patates",
      time: "19:00",
      icon: "fa-fish",
      colorClass: "badge-dinner",
      note: "Haftada 2 gün balık tüketimi kalp damar sağlığı için gereklidir.",
      items: [
        { name: "Fırında Somon veya Levrek Fileto", portion: "160g (pişmiş)", cal: 290, prot: 36, carb: 0, fat: 15.5 },
        { name: "Fırında Biberiyeli Bebek Patates", portion: "1 orta boy (120g)", cal: 105, prot: 2.4, carb: 24, fat: 0.2 },
        { name: "Zeytinyağlı Buharda Brokoli", portion: "1 kase (150g)", cal: 75, prot: 3.2, carb: 8.5, fat: 3.8 },
        { name: "Rokalı Kırmızı Soğanlı Balık Salatası", portion: "1 büyük tabak", cal: 55, prot: 1.8, carb: 4.5, fat: 3.5 }
      ]
    }
  },
  {
    dayIndex: 3,
    dayName: "4. Gün - Bitkisel Protein & Zeytinyağlı",
    breakfast: {
      title: "1. Ana Öğün: Çılbır (Yoğurtlu Poşe Yumurta) & Ekmek",
      time: "10:30",
      icon: "fa-egg",
      colorClass: "badge-breakfast",
      note: "Sarımsaklı yoğurt probiyotik, poşe yumurta kaliteli protein sağlar.",
      items: [
        { name: "Poşe Yumurta (kaynar suda)", portion: "2 adet (100g)", cal: 150, prot: 13, carb: 1.0, fat: 10.2 },
        { name: "Sarımsaklı Süzme Yoğurt Yatağı", portion: "4 yemek kaşığı (120g)", cal: 110, prot: 9.5, carb: 5.0, fat: 5.5 },
        { name: "Pul Biberli Sızma Zeytinyağı", portion: "1 tatlı kaşığı (5ml)", cal: 45, prot: 0, carb: 0, fat: 5.0 },
        { name: "Tam Tahıllı Ekmek", portion: "2 dilim (60g)", cal: 140, prot: 5.5, carb: 28, fat: 1.2 },
        { name: "Taze Roka & Domates Salatası", portion: "1 tabak", cal: 30, prot: 1.2, carb: 5.0, fat: 0.3 }
      ]
    },
    morningSnack: {
      title: "Kuşluk Ara Öğünü",
      time: "11:00",
      icon: "fa-mug-hot",
      colorClass: "badge-snack",
      note: "Metabolizma dostu yeşil çay.",
      items: [
        { name: "Yeşil Çay (limonlu)", portion: "1 fincan", cal: 3, prot: 0.1, carb: 0.6, fat: 0 },
        { name: "Kavrulmamış Kabak Çekirdeği", portion: "1 tatlı kaşığı (8g)", cal: 45, prot: 2.2, carb: 1.2, fat: 3.8 }
      ]
    },
    lunch: {
      title: "Öğle Yemeği: Zeytinyağlı Barbunya & Salata",
      time: "13:00",
      icon: "fa-seedling",
      colorClass: "badge-lunch",
      note: "Barbunya çözünür lif açısından zengindir, kolesterolü dengeler.",
      items: [
        { name: "Zeytinyağlı Barbunya Pilaki", portion: "6 yemek kaşığı (160g)", cal: 190, prot: 9.0, carb: 28, fat: 5.0 },
        { name: "Doğal Ev Yoğurdu", portion: "4 yemek kaşığı (150g)", cal: 95, prot: 5.5, carb: 7.2, fat: 4.8 },
        { name: "Bol Marullu Limonlu Salata", portion: "1 kase", cal: 35, prot: 1.2, carb: 5, fat: 1.0 }
      ]
    },
    afternoonSnack: {
      title: "İkindi Ara Öğünü: Kuru Kayısı & Fındık",
      time: "16:00",
      icon: "fa-cookie-bite",
      colorClass: "badge-snack",
      note: "Gün kurusu kayısı bağırsak hareketlerini artırır.",
      items: [
        { name: "Gün Kurusu Kayısı", portion: "2 adet (30g)", cal: 75, prot: 1.0, carb: 18, fat: 0.2 },
        { name: "Çiğ Fındık", portion: "10 adet (12g)", cal: 78, prot: 1.8, carb: 2.0, fat: 7.2 },
        { name: "Melisa veya Papatya Çayı", portion: "1 fincan", cal: 2, prot: 0, carb: 0.5, fat: 0 }
      ]
    },
    dinner: {
      title: "2. Ana Öğün: Geleneksel Nohut Yemeği & Karabuğday",
      time: "19:00",
      icon: "fa-bowl-food",
      colorClass: "badge-dinner",
      note: "Baklagil ve karabuğday et kalitesinde aminoasit profili sunar.",
      items: [
        { name: "Etsiz Nohut Yemeği", portion: "7-8 yemek kaşığı (200g)", cal: 250, prot: 13.5, carb: 36, fat: 6.0 },
        { name: "Karabuğday (Greçka) Pilavı", portion: "4 yemek kaşığı (100g pişmiş)", cal: 125, prot: 4.5, carb: 25, fat: 1.1 },
        { name: "Ev Yapımı Cacık", portion: "1 kase (150g)", cal: 85, prot: 5.0, carb: 6.5, fat: 4.2 },
        { name: "Çoban Salata (zeytinyağlı)", portion: "1 porsiyon", cal: 75, prot: 1.5, carb: 6, fat: 5.0 }
      ]
    }
  },
  {
    dayIndex: 4,
    dayName: "5. Gün - Enerjik & Dinamik Gün",
    breakfast: {
      title: "1. Ana Öğün: Fırın Sebzeli Menemen & Peynir Şöleni",
      time: "10:30",
      icon: "fa-pepper-hot",
      colorClass: "badge-breakfast",
      note: "Pişmiş domateste bulunan likopen, zeytinyağı ile emilimi en yüksek noktaya ulaşır.",
      items: [
        { name: "Geleneksel Menemen (2 yumurtalı)", portion: "1 porsiyon (200g)", cal: 230, prot: 14, carb: 7, fat: 16 },
        { name: "Lor Peyniri (çörekotlu)", portion: "3 yemek kaşığı (50g)", cal: 70, prot: 9.0, carb: 2.0, fat: 2.5 },
        { name: "Kırma Yeşil Zeytin", portion: "6 adet (20g)", cal: 38, prot: 0.3, carb: 0.8, fat: 4.0 },
        { name: "Tam Buğday Ekmeği", portion: "2 ince dilim (60g)", cal: 140, prot: 5.5, carb: 28, fat: 1.2 },
        { name: "Maydanoz, Nane ve Roka", portion: "Serbest tabak", cal: 25, prot: 1.2, carb: 4, fat: 0.2 }
      ]
    },
    morningSnack: {
      title: "Kuşluk Ara Öğünü",
      time: "11:00",
      icon: "fa-mug-hot",
      colorClass: "badge-snack",
      note: "Doğal antioksidan molası.",
      items: [
        { name: "Ihlamur veya Adaçayı", portion: "1 kupa", cal: 3, prot: 0.1, carb: 0.6, fat: 0 },
        { name: "Ceviz İçi", portion: "1 tam ceviz (8g)", cal: 52, prot: 1.2, carb: 1.1, fat: 5.2 }
      ]
    },
    lunch: {
      title: "Öğle Yemeği: Zeytinyağlı Kabak Kalye & Yoğurt",
      time: "13:00",
      icon: "fa-bowl-rice",
      colorClass: "badge-lunch",
      note: "Hafif, su oranı yüksek ve ödem atıcı bir öğle seçeneği.",
      items: [
        { name: "Zeytinyağlı Dereotlu Kabak Yemeği", portion: "7-8 yemek kaşığı (200g)", cal: 120, prot: 2.8, carb: 12, fat: 6.5 },
        { name: "Bulgur Pilavı", portion: "3 yemek kaşığı (80g)", cal: 115, prot: 3.5, carb: 24, fat: 0.8 },
        { name: "Sarımsaklı Yoğurt", portion: "4 yemek kaşığı (150g)", cal: 95, prot: 5.5, carb: 7.2, fat: 4.8 }
      ]
    },
    afternoonSnack: {
      title: "İkindi Ara Öğünü: Fıstık Ezmeli Muz Dilimleri",
      time: "16:00",
      icon: "fa-lemon",
      colorClass: "badge-snack",
      note: "Yoğun günler ve antrenman öncesi mükemmel magnezyum kaynağı.",
      items: [
        { name: "Küçük Boy Yerli Muz", portion: "1 adet (90g)", cal: 80, prot: 1.0, carb: 20, fat: 0.3 },
        { name: "Şekersiz Doğal Fıstık Ezmesi", portion: "1 tatlı kaşığı (10g)", cal: 60, prot: 2.5, carb: 1.8, fat: 5.0 }
      ]
    },
    dinner: {
      title: "2. Ana Öğün: Izgara Ev Köftesi & Köz Sebzeler",
      time: "19:00",
      icon: "fa-burger",
      colorClass: "badge-dinner",
      note: "Köfte porsiyonu günlük 100g protein tavanını korumak için 4 adetle dengelenmiştir.",
      items: [
        { name: "Izgara Ev Köftesi (dana kıyma)", portion: "4 adet orta boy (120g pişmiş)", cal: 270, prot: 32, carb: 3, fat: 14.5 },
        { name: "Köz Patlıcan & Kırmızı Biber Salatası", portion: "1 porsiyon (1 tatlı kaşığı zeytinyağı)", cal: 110, prot: 2.2, carb: 12, fat: 6.0 },
        { name: "Fırınlanmış Baharatlı Patates", portion: "1 orta boy (100g)", cal: 95, prot: 2.0, carb: 22, fat: 0.2 },
        { name: "Doğal Yayık Ayranı", portion: "1 büyük bardak (250ml)", cal: 90, prot: 4.5, carb: 6.5, fat: 4.2 }
      ]
    }
  },
  {
    dayIndex: 5,
    dayName: "6. Gün - Pratik & Hafta Sonu Seçenekleri",
    breakfast: {
      title: "1. Ana Öğün: Hindi Fümeli Sıcak Tost & Yumurta",
      time: "10:30",
      icon: "fa-bread-slice",
      colorClass: "badge-breakfast",
      note: "Hafta sonu pratikliği arayanlar için dengeli tam tahıllı tost menüsü.",
      items: [
        { name: "Haşlanmış Yumurta", portion: "1 adet (50g)", cal: 75, prot: 6.5, carb: 0.5, fat: 5.3 },
        { name: "Tam Buğday Ekmeğinde Hindi Fümeli Kaşarlı Tost", portion: "2 dilim ekmek + 30g kaşar + 2 dilim füme", cal: 260, prot: 17, carb: 28, fat: 9.5 },
        { name: "Zeytin Çeşitleri", portion: "5 adet (18g)", cal: 35, prot: 0.2, carb: 0.8, fat: 3.5 },
        { name: "Ceviz İçi", portion: "2 tam ceviz (15g)", cal: 98, prot: 2.2, carb: 2.1, fat: 9.8 },
        { name: "Domates, Salatalık ve Taze Biber Söğüş", portion: "Serbest porsiyon", cal: 30, prot: 1.2, carb: 5.5, fat: 0.3 }
      ]
    },
    morningSnack: {
      title: "Kuşluk Ara Öğünü",
      time: "11:00",
      icon: "fa-mug-hot",
      colorClass: "badge-snack",
      note: "Hafta sonu keyif kahvesi.",
      items: [
        { name: "Filtre Kahve (şekersiz)", portion: "1 kupa", cal: 3, prot: 0.2, carb: 0.3, fat: 0 },
        { name: "Çiğ Badem", portion: "5-6 adet (8g)", cal: 48, prot: 1.7, carb: 1.7, fat: 4.1 }
      ]
    },
    lunch: {
      title: "Öğle Yemeği: Ton Balıklı Akdeniz Salatası",
      time: "13:00",
      icon: "fa-fish",
      colorClass: "badge-lunch",
      note: "Hafta sonu dışarıda veya evde kolay hazırlanan omega-3 kaynağı.",
      items: [
        { name: "Yağı Süzülmüş Ton Balığı", portion: "80g (küçük kutu)", cal: 110, prot: 22, carb: 0, fat: 2.5 },
        { name: "Bol Yeşillik & Mısır Salatası", portion: "1 büyük kase (2 yemek kaşığı mısır)", cal: 120, prot: 3.5, carb: 16, fat: 4.5 },
        { name: "Grissini veya Tam Buğday Galeta", portion: "2 adet (20g)", cal: 80, prot: 2.5, carb: 15, fat: 1.0 }
      ]
    },
    afternoonSnack: {
      title: "İkindi Ara Öğünü: Süzme Yoğurt & Nar Taneleri",
      time: "16:00",
      icon: "fa-bowl-rice",
      colorClass: "badge-snack",
      note: "Nar antioksidan açısından hücreleri yenileyen süper gıdadır.",
      items: [
        { name: "Süzme Yoğurt", portion: "4 yemek kaşığı (120g)", cal: 110, prot: 9.5, carb: 5.0, fat: 5.5 },
        { name: "Ayıklanmış Taze Nar veya Yaban Mersini", portion: "3 yemek kaşığı (50g)", cal: 42, prot: 0.8, carb: 9.5, fat: 0.4 },
        { name: "Toz Tarçın", portion: "1 çay kaşığı", cal: 5, prot: 0.1, carb: 1.0, fat: 0 }
      ]
    },
    dinner: {
      title: "2. Ana Öğün: Güveçte Mantarlı Tavuk Sote & Cacık",
      time: "19:00",
      icon: "fa-fire-burner",
      colorClass: "badge-dinner",
      note: "Güveç lezzeti dışarıdaki restoran menülerini aratmaz.",
      items: [
        { name: "Mantarlı & Renkli Biberli Tavuk Sote", portion: "150g tavuk göğsü + sebze", cal: 260, prot: 42, carb: 6, fat: 6.8 },
        { name: "Fırında Baharatlı Karnabahar / Brokoli", portion: "1 porsiyon (150g)", cal: 85, prot: 3.0, carb: 10, fat: 3.5 },
        { name: "Karabuğday veya Basmati Pilavı", portion: "3 yemek kaşığı (80g)", cal: 110, prot: 3.2, carb: 23, fat: 0.8 },
        { name: "Nane & Sarımsaklı Cacık", portion: "1 kase (150g)", cal: 85, prot: 5.0, carb: 6.5, fat: 4.2 }
      ]
    }
  },
  {
    dayIndex: 6,
    dayName: "7. Gün - Arındırıcı & Hafif Pazar",
    breakfast: {
      title: "1. Ana Öğün: Sebzeli Fırın Fit Frittata / Yumurta",
      time: "10:30",
      icon: "fa-egg",
      colorClass: "badge-breakfast",
      note: "Ispanak ve kabakla fırında kabaran pazar omleti.",
      items: [
        { name: "Fırında Sebzeli Frittata (2 yumurta + ıspanak)", portion: "1 dilim (180g)", cal: 190, prot: 14.5, carb: 4.5, fat: 12 },
        { name: "Beyaz Peynir / Çeçil Peyniri", portion: "35g (1 dilim)", cal: 100, prot: 7.5, carb: 0.6, fat: 7.8 },
        { name: "Doğal Sele Zeytini", portion: "6 adet (20g)", cal: 40, prot: 0.3, carb: 1.0, fat: 4.0 },
        { name: "Ekşi Mayalı Ekmek", portion: "2 ince dilim (60g)", cal: 140, prot: 5.5, carb: 28, fat: 1.2 },
        { name: "Bol Dereotu, Maydanoz, Salatalık", portion: "Serbest kase", cal: 30, prot: 1.5, carb: 5, fat: 0.3 }
      ]
    },
    morningSnack: {
      title: "Kuşluk Ara Öğünü",
      time: "11:00",
      icon: "fa-mug-hot",
      colorClass: "badge-snack",
      note: "Pazar rehavetini dağıtan tazeleyici zencefilli çay.",
      items: [
        { name: "Zencefilli & Limonlu Yeşil Çay", portion: "1 kupa", cal: 4, prot: 0.1, carb: 0.8, fat: 0 },
        { name: "Kavrulmamış Fındık", portion: "6 adet (8g)", cal: 50, prot: 1.2, carb: 1.3, fat: 4.8 }
      ]
    },
    lunch: {
      title: "Öğle Yemeği: Zeytinyağlı Kereviz veya Taze Fasulye",
      time: "13:00",
      icon: "fa-leaf",
      colorClass: "badge-lunch",
      note: "Sindirim sistemini yormayan arındırıcı öğle öğünü.",
      items: [
        { name: "Portakallı Zeytinyağlı Kereviz", portion: "6 yemek kaşığı (180g)", cal: 135, prot: 2.5, carb: 18, fat: 6.0 },
        { name: "Siyez Bulguru", portion: "3 yemek kaşığı (75g)", cal: 110, prot: 3.2, carb: 23, fat: 0.8 },
        { name: "Ev Yoğurdu", portion: "3 yemek kaşığı (120g)", cal: 80, prot: 4.5, carb: 6.0, fat: 4.0 }
      ]
    },
    afternoonSnack: {
      title: "İkindi Ara Öğünü: Yeşil Elma & Ceviz İçi",
      time: "16:00",
      icon: "fa-apple-whole",
      colorClass: "badge-snack",
      note: "Meyvedeki lif ve cevizdeki yağ kan şekerini sabit tutar.",
      items: [
        { name: "Ekşi Yeşil Elma", portion: "1 orta boy (150g)", cal: 78, prot: 0.5, carb: 19, fat: 0.3 },
        { name: "Ceviz İçi", portion: "2 tam ceviz (15g)", cal: 98, prot: 2.2, carb: 2.1, fat: 9.8 }
      ]
    },
    dinner: {
      title: "2. Ana Öğün: Havuçlu Yeşil Mercimek Yemeği & Salata",
      time: "19:00",
      icon: "fa-leaf",
      colorClass: "badge-dinner",
      note: "Haftayı hafif kapatmak için ideal bağırsak dostu menü.",
      items: [
        { name: "Havuçlu Yeşil Mercimek Yemeği", portion: "7-8 yemek kaşığı (200g)", cal: 240, prot: 15.5, carb: 35, fat: 5.5 },
        { name: "Fırında Baharatlı Kabak & Brokoli", portion: "1 tabak (180g)", cal: 85, prot: 3.2, carb: 10, fat: 3.5 },
        { name: "Doğal Ev Yoğurdu (pul biberli)", portion: "4 yemek kaşığı (150g)", cal: 95, prot: 5.5, carb: 7.2, fat: 4.8 },
        { name: "Nar Ekşili Roka Salatası", portion: "1 porsiyon (1 tatlı kaşığı zeytinyağı)", cal: 75, prot: 1.5, carb: 5, fat: 5.5 }
      ]
    }
  }
];

// ==========================================
// 3. UYGULAMA DURUMU (STATE)
// ==========================================
let currentDayIndex = 0;
let isDiabeticMode = false;
let selectedMealPattern = "2_meals_1_snack";

let calculatedMetrics = {
  bmr: 1420,
  tdee: 1950,
  targetCalories: 1650,
  bmi: 24.1,
  bmiCategory: "Normal",
  minIdealWeight: 54,
  maxIdealWeight: 70,
  targetWater: 2.4,
  targetProtein: 85, // Maksimum 100g garantisi
  targetCarbs: 180,
  targetFat: 62,
  targetKE: 12.0 // 180g / 15 = 12 KE
};

// LocalStorage'dan günlük yenen yemekleri al
const STORAGE_KEY = "diyetweb_logged_foods_v1";
let loggedFoods = [];
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    loggedFoods = JSON.parse(saved);
  }
} catch (e) {
  loggedFoods = [];
}

// ==========================================
// 4. DOM ELEMANLARI
// ==========================================
const dietForm = document.getElementById("diet-form");
const ageInput = document.getElementById("age");
const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const activitySelect = document.getElementById("activity");
const mealPatternSelect = document.getElementById("meal-pattern");
const diabeticModeToggle = document.getElementById("diabetic-mode");

const daySelector = document.getElementById("day-selector");
const prevDayBtn = document.getElementById("prev-day-btn");
const nextDayBtn = document.getElementById("next-day-btn");
const randomizeBtn = document.getElementById("randomize-btn");
const printBtn = document.getElementById("print-btn");

// Header Badges
const headerDiabeticBadge = document.getElementById("header-diabetic-badge");
const activeMealBadge = document.getElementById("active-meal-badge");

// Metrics DOM
const bmiValEl = document.getElementById("bmi-val");
const bmiCatEl = document.getElementById("bmi-category");
const idealWeightEl = document.getElementById("ideal-weight-range");
const targetCaloriesEl = document.getElementById("target-calories");
const bmrTdeeInfoEl = document.getElementById("bmr-tdee-info");
const waterIntakeEl = document.getElementById("water-intake");

// Macro Elements
const proteinTargetEl = document.getElementById("protein-macro-target");
const carbsTargetEl = document.getElementById("carbs-macro-target");
const fatTargetEl = document.getElementById("fat-macro-target");
const barProteinEl = document.getElementById("bar-protein");
const barCarbsEl = document.getElementById("bar-carbs");
const barFatEl = document.getElementById("bar-fat");
const diabeticKeSummary = document.getElementById("diabetic-ke-summary");
const carbsKeNote = document.getElementById("carbs-ke-note");

// Meal Plan Container & Totals
const mealsContainer = document.getElementById("meals-container");
const totalMealCaloriesEl = document.getElementById("total-meal-calories");
const totalMealProteinEl = document.getElementById("total-meal-protein");
const totalMealCarbsEl = document.getElementById("total-meal-carbs");
const totalMealFatEl = document.getElementById("total-meal-fat");
const totalMealKeEl = document.getElementById("total-meal-ke");
const diabeticPlanBanner = document.getElementById("diabetic-plan-banner");
const planDescText = document.getElementById("plan-desc-text");
const timelineGrid = document.getElementById("timeline-grid");

// Tab Elements
const navTabs = document.querySelectorAll(".nav-tab");
const tabPanes = document.querySelectorAll(".tab-pane");
const loggedCountBadge = document.getElementById("logged-count-badge");

// Tracker Form & Elements
const quickFoodTagsContainer = document.getElementById("quick-food-tags");
const customFoodForm = document.getElementById("custom-food-form");
const foodNameInput = document.getElementById("food-name-input");
const foodMealTypeSelect = document.getElementById("food-meal-type");
const foodCalInput = document.getElementById("food-cal-input");
const foodCarbInput = document.getElementById("food-carb-input");
const foodProtInput = document.getElementById("food-prot-input");
const foodFatInput = document.getElementById("food-fat-input");
const kePreviewNote = document.getElementById("ke-preview-note");
const clearLogBtn = document.getElementById("clear-log-btn");

// Tracker Budget Live Display
const loggedCalsTotalEl = document.getElementById("logged-cals-total");
const budgetCalsTargetEl = document.getElementById("budget-cals-target");
const budgetRemainingText = document.getElementById("budget-remaining-text");
const loggedCaloriesBar = document.getElementById("logged-calories-bar");
const loggedProteinTotalEl = document.getElementById("logged-protein-total");
const loggedCarbsTotalEl = document.getElementById("logged-carbs-total");
const loggedFatTotalEl = document.getElementById("logged-fat-total");
const loggedKeBadge = document.getElementById("logged-ke-badge");
const proteinWarningBadge = document.getElementById("protein-warning-badge");

// Tracker Table
const loggedItemsTbody = document.getElementById("logged-items-tbody");
const emptyLogState = document.getElementById("empty-log-state");

// ==========================================
// 5. HESAPLAMA METODLARI
// ==========================================

function calculateNutrition() {
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const age = parseFloat(ageInput.value) || 28;
  const height = parseFloat(heightInput.value) || 168;
  const weight = parseFloat(weightInput.value) || 68;
  const activity = parseFloat(activitySelect.value) || 1.375;
  const goal = document.querySelector('input[name="goal"]:checked').value;
  selectedMealPattern = mealPatternSelect.value;
  isDiabeticMode = diabeticModeToggle.checked;

  // 1. BMI Hesabı
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  let bmiCategory = "Normal";
  let bmiColor = "#15803d";
  let bmiBg = "#dcfce7";

  if (bmi < 18.5) {
    bmiCategory = "Zayıf";
    bmiColor = "#b45309";
    bmiBg = "#fef3c7";
  } else if (bmi >= 18.5 && bmi < 25) {
    bmiCategory = "Normal Kilo";
    bmiColor = "#15803d";
    bmiBg = "#dcfce7";
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = "Fazla Kilolu";
    bmiColor = "#c2410c";
    bmiBg = "#ffedd5";
  } else {
    bmiCategory = "Obezite Aralığı";
    bmiColor = "#b91c1c";
    bmiBg = "#fee2e2";
  }

  const minIdeal = Math.round(18.5 * (heightInMeters * heightInMeters));
  const maxIdeal = Math.round(24.9 * (heightInMeters * heightInMeters));

  // 2. BMR (Mifflin - St Jeor)
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  bmr = Math.round(bmr);

  // 3. TDEE
  const tdee = Math.round(bmr * activity);

  // 4. Hedef Kalori
  let targetCalories = tdee;
  if (goal === "lose_fast") {
    targetCalories = Math.max(1250, tdee - 600);
  } else if (goal === "lose") {
    targetCalories = Math.max(1300, tdee - 400);
  } else if (goal === "maintain") {
    targetCalories = tdee;
  } else if (goal === "gain") {
    targetCalories = tdee + 350;
  }

  // 5. Su: Kilo * 35 ml
  const waterIntake = (Math.round((weight * 0.035) * 10) / 10).toFixed(1);

  // 6. Protein Hesabı: KESİNLİKLE MAKSİMUM 100g SINIRI
  let calculatedProtein = Math.round(weight * 1.2);
  if (calculatedProtein > 98) {
    calculatedProtein = 98; // 100g tavanını asla aşamaz!
  }
  if (calculatedProtein < 65) {
    calculatedProtein = 65;
  }

  const proteinCal = calculatedProtein * 4;
  const fatCal = targetCalories * 0.30;
  const calculatedFat = Math.round(fatCal / 9);
  const carbCal = Math.max(0, targetCalories - (proteinCal + fatCal));
  const calculatedCarbs = Math.round(carbCal / 4);

  // Diyabet: 1 KE = 15g CHO
  const targetKE = (calculatedCarbs / 15).toFixed(1);

  calculatedMetrics = {
    bmr,
    tdee,
    targetCalories,
    bmi: bmi.toFixed(1),
    bmiCategory,
    bmiColor,
    bmiBg,
    minIdealWeight: minIdeal,
    maxIdealWeight: maxIdeal,
    targetWater: waterIntake,
    targetProtein: calculatedProtein,
    targetCarbs: calculatedCarbs,
    targetFat: calculatedFat,
    targetKE
  };

  updateMetricsUI();
  renderMealPlan();
  renderTrackerBudget();
  renderTimeline();
}

/**
 * Üst Metrik Kartlarını Güncelle
 */
function updateMetricsUI() {
  bmiValEl.textContent = calculatedMetrics.bmi;
  bmiCatEl.textContent = calculatedMetrics.bmiCategory;
  bmiCatEl.style.color = calculatedMetrics.bmiColor;
  bmiCatEl.style.backgroundColor = calculatedMetrics.bmiBg;
  idealWeightEl.textContent = `İdeal Kilo: ${calculatedMetrics.minIdealWeight} - ${calculatedMetrics.maxIdealWeight} kg`;

  targetCaloriesEl.textContent = calculatedMetrics.targetCalories.toLocaleString('tr-TR');
  bmrTdeeInfoEl.textContent = `BMR: ${calculatedMetrics.bmr} kcal | Harcama: ${calculatedMetrics.tdee} kcal`;
  waterIntakeEl.textContent = calculatedMetrics.targetWater;

  const protPct = Math.round((calculatedMetrics.targetProtein * 4 / calculatedMetrics.targetCalories) * 100);
  const carbsPct = Math.round((calculatedMetrics.targetCarbs * 4 / calculatedMetrics.targetCalories) * 100);
  const fatPct = Math.round((calculatedMetrics.targetFat * 9 / calculatedMetrics.targetCalories) * 100);

  proteinTargetEl.innerHTML = `<strong>${calculatedMetrics.targetProtein}g</strong> (%${protPct})`;
  carbsTargetEl.innerHTML = `<strong>${calculatedMetrics.targetCarbs}g</strong> (%${carbsPct})`;
  fatTargetEl.innerHTML = `<strong>${calculatedMetrics.targetFat}g</strong> (%${fatPct})`;

  barProteinEl.style.width = `${Math.min(100, protPct * 3)}%`;
  barCarbsEl.style.width = `${Math.min(100, carbsPct * 1.5)}%`;
  barFatEl.style.width = `${Math.min(100, fatPct * 2)}%`;

  // Diyabet Modu kontrolleri
  if (isDiabeticMode) {
    headerDiabeticBadge.style.display = "inline-flex";
    diabeticKeSummary.style.display = "inline-flex";
    diabeticKeSummary.innerHTML = `<i class="fa-solid fa-droplet"></i> Hedef: ${calculatedMetrics.targetKE} KE (1 KE = 15g CHO)`;
    carbsKeNote.innerHTML = `<strong>${calculatedMetrics.targetKE} KE</strong> Karbonhidrat Eşdeğeri`;
    diabeticPlanBanner.style.display = "flex";
    totalMealKeEl.style.display = "inline-block";
  } else {
    headerDiabeticBadge.style.display = "none";
    diabeticKeSummary.style.display = "none";
    carbsKeNote.textContent = "Kompleks & Lifli karbonhidratlar";
    diabeticPlanBanner.style.display = "none";
    totalMealKeEl.style.display = "none";
  }

  // Öğün Rozeti
  const patternNames = {
    "2_meals": "2 Öğün (Sabah + Akşam)",
    "2_meals_1_snack": "2 Ana Öğün + 1 Ara",
    "3_meals": "3 Ana Öğün",
    "3_meals_1_snack": "3 Ana Öğün + 1 Ara",
    "3_meals_2_snacks": "3 Ana Öğün + 2 Ara"
  };
  activeMealBadge.innerHTML = `<i class="fa-solid fa-utensils"></i> ${patternNames[selectedMealPattern] || "2 Ana + 1 Ara"}`;
  planDescText.textContent = `${patternNames[selectedMealPattern]} düzenine ve 100g protein kuralına tam uyumlu plan.`;

  // Tracker bütçe hedefi
  budgetCalsTargetEl.textContent = calculatedMetrics.targetCalories.toLocaleString('tr-TR');
}

/**
 * Seçilen Öğün Sayısına Göre Menüyü Dinamik Oluştur
 */
function renderMealPlan() {
  const currentPlan = MASTER_MEALS[currentDayIndex];
  if (!currentPlan) return;

  // Seçilen öğün desenine göre öğün listesini hazırla
  let activeMeals = [];

  if (selectedMealPattern === "2_meals") {
    // 2 Öğün: Kahvaltı + Akşam
    activeMeals = [
      { ...currentPlan.breakfast, title: "1. Ana Öğün: Kahvaltı", time: "10:30 - 11:30" },
      { ...currentPlan.dinner, title: "2. Ana Öğün: Akşam Yemeği", time: "18:30 - 19:30" }
    ];
  } else if (selectedMealPattern === "2_meals_1_snack") {
    // 2 Ana + 1 Ara
    activeMeals = [
      { ...currentPlan.breakfast, title: "1. Ana Öğün: Kahvaltı", time: "10:30 - 11:30" },
      { ...currentPlan.afternoonSnack, title: "Ara Öğün: İkindi Atıştırmalığı", time: "15:30 - 16:30" },
      { ...currentPlan.dinner, title: "2. Ana Öğün: Akşam Yemeği", time: "19:00 - 20:00" }
    ];
  } else if (selectedMealPattern === "3_meals") {
    // 3 Ana Öğün
    activeMeals = [
      { ...currentPlan.breakfast, title: "1. Ana Öğün: Kahvaltı", time: "08:30 - 09:30" },
      { ...currentPlan.lunch, title: "2. Ana Öğün: Öğle Yemeği", time: "12:30 - 13:30" },
      { ...currentPlan.dinner, title: "3. Ana Öğün: Akşam Yemeği", time: "19:00 - 20:00" }
    ];
  } else if (selectedMealPattern === "3_meals_1_snack") {
    // 3 Ana + 1 Ara
    activeMeals = [
      { ...currentPlan.breakfast, title: "1. Ana Öğün: Kahvaltı", time: "08:30 - 09:30" },
      { ...currentPlan.lunch, title: "2. Ana Öğün: Öğle Yemeği", time: "12:30 - 13:30" },
      { ...currentPlan.afternoonSnack, title: "Ara Öğün: İkindi Denge Öğünü", time: "16:00 - 16:30" },
      { ...currentPlan.dinner, title: "3. Ana Öğün: Akşam Yemeği", time: "19:30 - 20:30" }
    ];
  } else if (selectedMealPattern === "3_meals_2_snacks") {
    // 3 Ana + 2 Ara
    activeMeals = [
      { ...currentPlan.breakfast, title: "1. Ana Öğün: Kahvaltı", time: "08:30 - 09:30" },
      { ...currentPlan.morningSnack, title: "1. Ara Öğün: Kuşluk Molası", time: "10:45 - 11:15" },
      { ...currentPlan.lunch, title: "2. Ana Öğün: Öğle Yemeği", time: "12:30 - 13:30" },
      { ...currentPlan.afternoonSnack, title: "2. Ara Öğün: İkindi Molası", time: "16:30 - 17:00" },
      { ...currentPlan.dinner, title: "3. Ana Öğün: Akşam Yemeği", time: "19:30 - 20:30" }
    ];
  }

  // Kalori ölçekleme faktörü
  // Öğün sayısına göre baz kalori ayarı
  let baseSum = 0;
  activeMeals.forEach(m => m.items.forEach(i => baseSum += i.cal));
  const scale = calculatedMetrics.targetCalories / (baseSum || 1600);

  mealsContainer.innerHTML = "";

  let dailyTotalCal = 0;
  let dailyTotalProt = 0;
  let dailyTotalCarbs = 0;
  let dailyTotalFat = 0;

  activeMeals.forEach((meal) => {
    let mealCal = 0;
    let mealProt = 0;
    let mealCarbs = 0;
    let mealFat = 0;

    meal.items.forEach(item => {
      const itemCal = Math.round(item.cal * (0.85 + 0.15 * scale));
      const itemProt = item.prot; // Protein 100g kuralı gereği sabit ve garantili tutulur
      const itemCarb = Math.round(item.carb * scale);
      const itemFat = Math.round(item.fat * (0.9 + 0.1 * scale));

      mealCal += itemCal;
      mealProt += itemProt;
      mealCarbs += itemCarb;
      mealFat += itemFat;
    });

    dailyTotalCal += mealCal;
    dailyTotalProt += mealProt;
    dailyTotalCarbs += mealCarbs;
    dailyTotalFat += mealFat;

    const mealKE = (mealCarbs / 15).toFixed(1);

    const mealCard = document.createElement("div");
    mealCard.className = "meal-item";

    let itemsHtml = meal.items.map(item => {
      const itemKe = (item.carb / 15).toFixed(1);
      const keTag = isDiabeticMode ? `<span class="item-ke-inline"><i class="fa-solid fa-droplet"></i> ${itemKe} KE</span>` : '';
      return `
        <tr>
          <td class="food-name"><i class="fa-solid fa-circle-dot"></i> ${item.name} ${keTag}</td>
          <td class="food-portion">${item.portion}</td>
          <td class="food-nutrition">${item.cal} kcal | <strong>${item.prot}g P</strong></td>
        </tr>
      `;
    }).join("");

    // Diyabet uyarısı (Eğer tek öğünde 4 KE / 60g aşılırsa)
    let diabeticAlertTag = "";
    if (isDiabeticMode) {
      if (mealCarbs > 60) {
        diabeticAlertTag = `<span class="meal-ke-tag" style="background:#fee2e2;color:#991b1b;"><i class="fa-solid fa-triangle-exclamation"></i> ${mealKE} KE (Yüksek)</span>`;
      } else {
        diabeticAlertTag = `<span class="meal-ke-tag"><i class="fa-solid fa-droplet"></i> ${mealKE} KE (${mealCarbs}g CHO)</span>`;
      }
    }

    mealCard.innerHTML = `
      <div class="meal-header-row">
        <div class="meal-title-group">
          <div class="meal-badge-icon ${meal.colorClass}">
            <i class="fa-solid ${meal.icon}"></i>
          </div>
          <div>
            <h3>${meal.title}</h3>
            <span class="meal-time-tag"><i class="fa-regular fa-clock"></i> Tavsiye Saat: ${meal.time}</span>
          </div>
        </div>
        <div class="meal-nutrients-summary">
          <span class="meal-cals"><i class="fa-solid fa-fire"></i> ${mealCal} kcal</span>
          <span class="meal-prot"><i class="fa-solid fa-shield"></i> ${mealProt.toFixed(1)}g Protein</span>
          ${diabeticAlertTag}
        </div>
      </div>
      <div class="meal-body">
        <table class="food-items-table">
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <div class="meal-prep-note">
          <strong><i class="fa-solid fa-circle-info"></i> Beslenme Notu:</strong> ${meal.note}
        </div>
      </div>
    `;

    mealsContainer.appendChild(mealCard);
  });

  // Toplam Değerleri Güncelle
  totalMealCaloriesEl.textContent = `${dailyTotalCal.toLocaleString('tr-TR')} kcal`;
  totalMealProteinEl.textContent = `${dailyTotalProt.toFixed(0)}g`;
  totalMealCarbsEl.textContent = `${dailyTotalCarbs}g`;
  totalMealFatEl.textContent = `${dailyTotalFat}g`;

  // KE Toplamı
  const totalDailyKE = (dailyTotalCarbs / 15).toFixed(1);
  totalMealKeEl.textContent = `${totalDailyKE} KE`;

  // Protein 100g kuralı rozeti
  const protPillBadge = document.querySelector(".highlight-pill .stat-badge");
  if (dailyTotalProt <= 100) {
    protPillBadge.innerHTML = `<i class="fa-solid fa-check"></i> ${dailyTotalProt.toFixed(0)}g ≤ 100g (Kurala Uygun)`;
    protPillBadge.style.background = "#dbeafe";
    protPillBadge.style.color = "#1e40af";
  } else {
    protPillBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> 100g Limiti Aşıldı!`;
    protPillBadge.style.background = "#fee2e2";
    protPillBadge.style.color = "#991b1b";
  }

  daySelector.value = currentDayIndex;
}

/**
 * Dinamik Saat Çizelgesi (Öğün Sayısına Göre)
 */
function renderTimeline() {
  timelineGrid.innerHTML = "";
  let steps = [];

  if (selectedMealPattern === "2_meals") {
    steps = [
      { time: "10:30 - 11:30", title: "1. Ana Öğün (Sabah)", desc: "Protein, zeytinyağı ve lifli gıdalarla zengin doyurucu başlangıç." },
      { time: "15:00 - 16:00", title: "Sıvı & Çay Molası", desc: "Bol su, maden suyu veya şekersiz yeşil çay ile hidrasyon." },
      { time: "18:30 - 19:30", title: "2. Ana Öğün (Akşam)", desc: "Balık, tavuk veya baklagil; bol salata eşliğinde hafif akşam yemeği." }
    ];
  } else if (selectedMealPattern === "2_meals_1_snack") {
    steps = [
      { time: "10:30 - 11:30", title: "1. Ana Öğün (Sabah)", desc: "Zinde kalmak için kaliteli protein ve sağlıklı yağlar içeren kahvaltı." },
      { time: "15:30 - 16:30", title: "Ara Öğün (İkindi)", desc: "Kan şekerini dengeleyen meyve, kuruyemiş veya probiyotik yoğurt." },
      { time: "19:00 - 20:00", title: "2. Ana Öğün (Akşam)", desc: "Günün son ana öğünü; sindirimi rahatlatıcı zeytinyağlı sebze ve protein." }
    ];
  } else if (selectedMealPattern === "3_meals") {
    steps = [
      { time: "08:30 - 09:30", title: "Kahvaltı", desc: "Güne enerjik başlangıç için yumurtalı ve peynirli klasik kahvaltı." },
      { time: "12:30 - 13:30", title: "Öğle Yemeği", desc: "Lifli sebze, baklagil ve bulgur ile tokluğu koruyan öğle menüsü." },
      { time: "19:00 - 20:00", title: "Akşam Yemeği", desc: "Yağsız protein ve taze salata ile sindirimi kolay akşam bitirişi." }
    ];
  } else if (selectedMealPattern === "3_meals_1_snack") {
    steps = [
      { time: "08:30 - 09:30", title: "Kahvaltı", desc: "Tam buğday ekmeği ve proteinle dengeli başlangıç." },
      { time: "12:30 - 13:30", title: "Öğle Yemeği", desc: "Sebze, yoğurt ve kompleks karbonhidrat içeren öğle yemeği." },
      { time: "16:00 - 16:30", title: "İkindi Ara Öğünü", desc: "Şeker düşüşünü önleyen kuruyemiş ve bitki çayı." },
      { time: "19:30 - 20:30", title: "Akşam Yemeği", desc: "Hafif pişirilmiş ızgara veya zeytinyağlı akşam menüsü." }
    ];
  } else {
    steps = [
      { time: "08:30 - 09:00", title: "Kahvaltı", desc: "Sabah proteini ve tam tahıl." },
      { time: "10:45 - 11:15", title: "Kuşluk Ara Öğünü", desc: "Hafif meyve veya kuruyemiş." },
      { time: "12:30 - 13:30", title: "Öğle Yemeği", desc: "Dengeli ana öğün." },
      { time: "16:30 - 17:00", title: "İkindi Ara Öğünü", desc: "Yoğurt veya kefir molası." },
      { time: "19:30 - 20:30", title: "Akşam Yemeği", desc: "Hafif protein & sebze." }
    ];
  }

  steps.forEach(step => {
    const el = document.createElement("div");
    el.className = "timeline-step";
    el.innerHTML = `
      <div class="step-time"><i class="fa-regular fa-clock"></i> ${step.time}</div>
      <div class="step-title">${step.title}</div>
      <p>${step.desc}</p>
    `;
    timelineGrid.appendChild(el);
  });
}

// ==========================================
// 6. YEDİKLERİM & DIŞARIDA YEMEK TAKİPÇİSİ
// ==========================================

/**
 * Hızlı Dışarıda Yemek Butonlarını Listele
 */
function renderQuickDiningTemplates() {
  quickFoodTagsContainer.innerHTML = "";
  DINING_OUT_TEMPLATES.forEach(tpl => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quick-tag-btn";
    const keVal = (tpl.carb / 15).toFixed(1);
    btn.innerHTML = `
      <span>${tpl.name}</span>
      <span class="badge-num">${tpl.cal} kcal</span>
      <span class="badge-num" style="color:#2563eb;">${tpl.prot}g P</span>
      <span class="badge-num" style="color:#d97706;">${keVal} KE</span>
    `;
    btn.addEventListener("click", () => {
      addFoodToLog({
        id: Date.now(),
        name: tpl.name,
        mealType: tpl.cat,
        cal: tpl.cal,
        carb: tpl.carb,
        prot: tpl.prot,
        fat: tpl.fat
      });
    });
    quickFoodTagsContainer.appendChild(btn);
  });
}

/**
 * Yemeği Listeye Ekle
 */
function addFoodToLog(foodItem) {
  loggedFoods.unshift(foodItem);
  saveLoggedFoods();
  renderTrackerBudget();
  renderLoggedFoodsTable();

  // Supabase Bulut Senkronizasyonu
  if (window.DiyetWebCloud && typeof window.DiyetWebCloud.syncFoodLog === "function") {
    window.DiyetWebCloud.syncFoodLog(foodItem);
  }
}

/**
 * LocalStorage Kaydet
 */
function saveLoggedFoods() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedFoods));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

/**
 * Tracker Canlı Tüketim & Kalan Bütçe Çubuğunu Güncelle
 */
function renderTrackerBudget() {
  let totalCal = 0;
  let totalProt = 0;
  let totalCarb = 0;
  let totalFat = 0;

  loggedFoods.forEach(item => {
    totalCal += parseFloat(item.cal) || 0;
    totalProt += parseFloat(item.prot) || 0;
    totalCarb += parseFloat(item.carb) || 0;
    totalFat += parseFloat(item.fat) || 0;
  });

  totalCal = Math.round(totalCal);
  totalProt = Math.round(totalProt);
  totalCarb = Math.round(totalCarb);
  totalFat = Math.round(totalFat);

  loggedCalsTotalEl.textContent = totalCal.toLocaleString('tr-TR');
  budgetCalsTargetEl.textContent = calculatedMetrics.targetCalories.toLocaleString('tr-TR');

  const remaining = calculatedMetrics.targetCalories - totalCal;
  if (remaining >= 0) {
    budgetRemainingText.textContent = `Kalan: ${remaining.toLocaleString('tr-TR')} kcal`;
    budgetRemainingText.style.color = "#059669";
  } else {
    budgetRemainingText.textContent = `Hedef ${Math.abs(remaining)} kcal Aşıldı!`;
    budgetRemainingText.style.color = "#dc2626";
  }

  // Progress Bar
  const pct = Math.min(100, Math.round((totalCal / (calculatedMetrics.targetCalories || 1)) * 100));
  loggedCaloriesBar.style.width = `${pct}%`;
  if (totalCal > calculatedMetrics.targetCalories) {
    loggedCaloriesBar.className = "progress-bar bar-warning";
  } else {
    loggedCaloriesBar.className = "progress-bar bar-calories";
  }

  // Protein Takibi: MAKSİMUM 100g KORUMASI
  loggedProteinTotalEl.textContent = `${totalProt}g`;
  if (totalProt > 100) {
    proteinWarningBadge.className = "bp-badge bp-badge-danger";
    proteinWarningBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> DİKKAT: 100g Sınırı Aşıldı! (${totalProt}g)`;
  } else {
    proteinWarningBadge.className = "bp-badge";
    proteinWarningBadge.innerHTML = `<i class="fa-solid fa-check"></i> ${totalProt}g ≤ 100g (Güvenli)`;
  }

  // Karbonhidrat & KE
  loggedCarbsTotalEl.textContent = `${totalCarb}g`;
  const loggedKE = (totalCarb / 15).toFixed(1);
  loggedKeBadge.textContent = `${loggedKE} KE (15g CHO = 1 KE)`;

  loggedFatTotalEl.textContent = `${totalFat}g`;
  loggedCountBadge.textContent = loggedFoods.length;
}

/**
 * Eklenen Yemekler Tablosunu Ekrana Bas
 */
function renderLoggedFoodsTable() {
  loggedItemsTbody.innerHTML = "";

  if (loggedFoods.length === 0) {
    emptyLogState.style.display = "block";
    return;
  }
  emptyLogState.style.display = "none";

  loggedFoods.forEach(food => {
    const tr = document.createElement("tr");
    const foodKE = (food.carb / 15).toFixed(1);

    tr.innerHTML = `
      <td><span class="badge-meal-cat">${food.mealType}</span></td>
      <td><strong>${food.name}</strong></td>
      <td>${food.cal} kcal</td>
      <td>${food.carb}g <small style="color:#be123c;">(${foodKE} KE)</small></td>
      <td>${food.prot}g</td>
      <td>${food.fat || 0}g</td>
      <td>
        <button class="btn-icon" data-id="${food.id}" title="Sil" style="color:#ef4444;">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;

    // Silme butonu event
    tr.querySelector("button").addEventListener("click", () => {
      deleteFoodFromLog(food.id);
    });

    loggedItemsTbody.appendChild(tr);
  });
}

function deleteFoodFromLog(id) {
  loggedFoods = loggedFoods.filter(f => f.id !== id);
  saveLoggedFoods();
  renderTrackerBudget();
  renderLoggedFoodsTable();

  // Supabase Buluttan Sil
  if (window.DiyetWebCloud && typeof window.DiyetWebCloud.deleteFoodLog === "function") {
    window.DiyetWebCloud.deleteFoodLog(id);
  }
}

// ==========================================
// 7. EVENT LISTENERS
// ==========================================

// Form Gönderildiğinde
dietForm.addEventListener("submit", (e) => {
  e.preventDefault();
  calculateNutrition();

  if (window.innerWidth < 1024) {
    document.getElementById("results-area").scrollIntoView({ behavior: "smooth" });
  }
});

// Öğün Sayısı Seçimi Değiştiğinde
mealPatternSelect.addEventListener("change", () => {
  calculateNutrition();
});

// Diyabet Modu Değiştiğinde
diabeticModeToggle.addEventListener("change", () => {
  calculateNutrition();
});

// Tab Değiştirme
navTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    navTabs.forEach(t => t.classList.remove("active"));
    tabPanes.forEach(p => p.classList.remove("active"));

    tab.classList.add("active");
    const targetTabId = tab.getAttribute("data-tab");
    const targetPane = document.getElementById(targetTabId);
    if (targetPane) {
      targetPane.classList.add("active");
    }
  });
});

// Karbonhidrat Girilirken KE Canlı Önizlemesi
foodCarbInput.addEventListener("input", () => {
  const carbVal = parseFloat(foodCarbInput.value) || 0;
  const keVal = (carbVal / 15).toFixed(1);
  kePreviewNote.innerHTML = `Karbonhidrat Eşdeğeri: <strong>${keVal} KE</strong> (${carbVal}g / 15)`;
});

// Özel Yemek Ekleme Formu
customFoodForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = foodNameInput.value.trim();
  const mealType = foodMealTypeSelect.value;
  const cal = parseFloat(foodCalInput.value) || 0;
  const carb = parseFloat(foodCarbInput.value) || 0;
  const prot = parseFloat(foodProtInput.value) || 0;
  const fat = parseFloat(foodFatInput.value) || 0;

  if (!name) return;

  addFoodToLog({
    id: Date.now(),
    name,
    mealType,
    cal,
    carb,
    prot,
    fat
  });

  // Formu temizle
  foodNameInput.value = "";
  foodCalInput.value = "";
  foodCarbInput.value = "";
  foodProtInput.value = "";
  foodFatInput.value = "";
  kePreviewNote.innerHTML = `Karbonhidrat Eşdeğeri: <strong>0 KE</strong> (15g = 1 KE)`;
});

// Günlüğü Sıfırla
clearLogBtn.addEventListener("click", () => {
  if (confirm("Bugün kaydettiğiniz tüm yiyecekler günlüğünüzden silinsin mi?")) {
    loggedFoods = [];
    saveLoggedFoods();
    renderTrackerBudget();
    renderLoggedFoodsTable();

    if (window.DiyetWebCloud && typeof window.DiyetWebCloud.clearFoodLogs === "function") {
      window.DiyetWebCloud.clearFoodLogs();
    }
  }
});

// Gün Seçici Kontrolleri
daySelector.addEventListener("change", (e) => {
  currentDayIndex = parseInt(e.target.value, 10);
  renderMealPlan();
});

prevDayBtn.addEventListener("click", () => {
  currentDayIndex = (currentDayIndex - 1 + MASTER_MEALS.length) % MASTER_MEALS.length;
  renderMealPlan();
});

nextDayBtn.addEventListener("click", () => {
  currentDayIndex = (currentDayIndex + 1) % MASTER_MEALS.length;
  renderMealPlan();
});

randomizeBtn.addEventListener("click", () => {
  let nextRandom;
  do {
    nextRandom = Math.floor(Math.random() * MASTER_MEALS.length);
  } while (nextRandom === currentDayIndex && MASTER_MEALS.length > 1);
  
  currentDayIndex = nextRandom;
  renderMealPlan();
});

// Tab Değiştirme Yardımcısı
function switchTab(tabId) {
  navTabs.forEach(t => {
    if (t.getAttribute("data-tab") === tabId) {
      t.classList.add("active");
    } else {
      t.classList.remove("active");
    }
  });
  tabPanes.forEach(p => {
    if (p.id === tabId) {
      p.classList.add("active");
    } else {
      p.classList.remove("active");
    }
  });
}

// Üstteki Yazdır Butonu
printBtn.addEventListener("click", () => {
  window.print();
});

// 1. Haftalık / Günlük Yemek Listesi Altındaki Yazdır Butonu
const printPlanBottomBtn = document.getElementById("print-plan-bottom-btn");
if (printPlanBottomBtn) {
  printPlanBottomBtn.addEventListener("click", () => {
    switchTab("tab-plan");
    document.body.classList.add("print-only-plan");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("print-only-plan");
    }, 1000);
  });
}

// 2. Alışveriş Listesi Altındaki Yazdır Butonu
const printShoppingBottomBtn = document.getElementById("print-shopping-bottom-btn");
if (printShoppingBottomBtn) {
  printShoppingBottomBtn.addEventListener("click", () => {
    switchTab("tab-shopping");
    document.body.classList.add("print-only-shopping");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("print-only-shopping");
    }, 1000);
  });
}

// 3. 7 Günlük Tüm Haftayı Yazdır Butonu
const printWeeklyOverviewBtn = document.getElementById("print-weekly-overview-btn");
if (printWeeklyOverviewBtn) {
  printWeeklyOverviewBtn.addEventListener("click", () => {
    switchTab("tab-plan");
    // Tüm günlerin başlıklarını ve öğünlerini geçici olarak yazdırılabilir hale getir
    const originalDay = currentDayIndex;
    let confirmPrint = confirm("7 günlük tüm menülerin tamamını yazdırmak istiyor musunuz?");
    if (confirmPrint) {
      window.print();
    }
  });
}

// ==========================================
// 8. BESİN DEĞİŞİM & KALORİ EŞİTLEME ARACI
// ==========================================

const EXCHANGE_TARGET_FOODS = {
  somon: { name: "Izgara Somon", cal100: 180, prot100: 22.5, carb100: 0, fat100: 10, unit: "g" },
  levrek: { name: "Levrek / Çupra (Beyaz Balık)", cal100: 105, prot100: 20, carb100: 0, fat100: 2.5, unit: "g" },
  kofte: { name: "Izgara Ev Köftesi", cal100: 225, prot100: 26, carb100: 2.5, fat100: 12, unit: "g" },
  hindi: { name: "Hindi Sote / Eti", cal100: 155, prot100: 27, carb100: 1.8, fat100: 3.5, unit: "g" },
  yumurta: { name: "Haşlanmış Yumurta", calPerUnit: 75, protPerUnit: 6.5, carbPerUnit: 0.5, fatPerUnit: 5.3, unit: "adet" },
  nohut: { name: "Nohut / Kuru Baklagil (Pişmiş)", cal100: 165, prot100: 9, carb100: 24, fat100: 3, unit: "g" },
  lor: { name: "Lor Peyniri", cal100: 150, prot100: 19, carb100: 3.5, fat100: 6.5, unit: "g" },
  kasar: { name: "Kaşar Peyniri", cal100: 350, prot100: 25, carb100: 1.5, fat100: 27, unit: "g" },
  ekmek: { name: "Tam Buğday Ekmeği", cal100: 240, prot100: 9, carb100: 48, fat100: 2, unit: "g" },
  bulgur: { name: "Bulgur Pilavı (Pişmiş)", cal100: 145, prot100: 4.2, carb100: 30, fat100: 1.1, unit: "g" },
  patates: { name: "Fırın Patates", cal100: 85, prot100: 2, carb100: 20, fat100: 0.1, unit: "g" },
  ceviz: { name: "Ceviz İçi / Badem", cal100: 650, prot100: 15, carb100: 14, fat100: 65, unit: "g" },
  avokado: { name: "Avokado", cal100: 160, prot100: 2, carb100: 8, fat100: 15, unit: "g" },
  yogurt: { name: "Doğal Yoğurt / Kefir", cal100: 65, prot100: 3.8, carb100: 5, fat100: 3.2, unit: "g" },
  muz: { name: "Muz / Taze Meyve", cal100: 89, prot100: 1.1, carb100: 23, fat100: 0.3, unit: "g" }
};

const swapSourceSelect = document.getElementById("swap-source-select");
const swapSourceName = document.getElementById("swap-source-name");
const swapSourceCal = document.getElementById("swap-source-cal");
const swapSourceProt = document.getElementById("swap-source-prot");
const swapSourceCarb = document.getElementById("swap-source-carb");
const swapSourceFat = document.getElementById("swap-source-fat");
const swapTargetSelect = document.getElementById("swap-target-select");

const srTargetCalEl = document.getElementById("sr-target-cal");
const swapPortionTextEl = document.getElementById("swap-portion-text");
const swapResultProtEl = document.getElementById("swap-result-prot");
const swapResultCarbEl = document.getElementById("swap-result-carb");
const swapResultFatEl = document.getElementById("swap-result-fat");
const swapProtWarningEl = document.getElementById("swap-prot-warning");
const applySwapToLogBtn = document.getElementById("apply-swap-to-log-btn");

let lastCalculatedSwap = null;

function calculateFoodExchange() {
  if (!swapSourceCal || !swapTargetSelect) return;

  const targetCal = parseFloat(swapSourceCal.value) || 0;
  const targetKey = swapTargetSelect.value;
  const foodData = EXCHANGE_TARGET_FOODS[targetKey];

  if (!foodData || targetCal <= 0) {
    if (swapPortionTextEl) {
      swapPortionTextEl.innerHTML = "Lütfen geçerli bir kalori değeri giriniz.";
    }
    return;
  }

  let portionText = "";
  let resProt = 0;
  let resCarb = 0;
  let resFat = 0;

  if (foodData.unit === "adet") {
    const pieces = (targetCal / foodData.calPerUnit).toFixed(1);
    const approxGrams = Math.round(pieces * 50);
    portionText = `${pieces} adet ${foodData.name} (~${approxGrams}g)`;
    resProt = Math.round(pieces * foodData.protPerUnit * 10) / 10;
    resCarb = Math.round(pieces * foodData.carbPerUnit * 10) / 10;
    resFat = Math.round(pieces * foodData.fatPerUnit * 10) / 10;
  } else {
    const grams = Math.round((targetCal / foodData.cal100) * 100);
    portionText = `${grams}g ${foodData.name}`;
    resProt = Math.round((grams * foodData.prot100 / 100) * 10) / 10;
    resCarb = Math.round((grams * foodData.carb100 / 100) * 10) / 10;
    resFat = Math.round((grams * foodData.fat100 / 100) * 10) / 10;
  }

  const resKE = (resCarb / 15).toFixed(1);

  if (srTargetCalEl) srTargetCalEl.textContent = `${targetCal} kcal Eşitlendi`;
  if (swapPortionTextEl) swapPortionTextEl.innerHTML = `Tüketmeniz Gereken: <strong>${portionText}</strong>`;
  if (swapResultProtEl) swapResultProtEl.innerHTML = `<i class="fa-solid fa-drumstick-bite"></i> ${resProt}g Protein`;
  if (swapResultCarbEl) swapResultCarbEl.innerHTML = `<i class="fa-solid fa-wheat-awn"></i> ${resCarb}g Karb (${resKE} KE)`;
  if (swapResultFatEl) swapResultFatEl.innerHTML = `<i class="fa-solid fa-droplet"></i> ${resFat}g Yağ`;

  if (swapProtWarningEl) {
    if (resProt > 50) {
      swapProtWarningEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:#d97706;"></i> <span>Yüksek tek öğün proteini (${resProt}g). Günlük 100g sınırını aşmamaya dikkat edin.</span>`;
    } else {
      swapProtWarningEl.innerHTML = `<i class="fa-solid fa-circle-check text-green"></i> <span>Maks. 100g protein kuralı ve kalori dengesiyle tam uyumludur.</span>`;
    }
  }

  lastCalculatedSwap = {
    name: `Değişim: ${portionText}`,
    mealType: "Menü Dışı Değişim",
    cal: targetCal,
    carb: resCarb,
    prot: resProt,
    fat: resFat
  };
}

// Event Listeners for Exchange Tool
if (swapSourceSelect) {
  swapSourceSelect.addEventListener("change", () => {
    const selOption = swapSourceSelect.options[swapSourceSelect.selectedIndex];
    if (swapSourceSelect.value !== "custom") {
      swapSourceName.value = selOption.getAttribute("data-name") || selOption.text;
      swapSourceCal.value = selOption.getAttribute("data-cal") || 0;
      swapSourceProt.value = selOption.getAttribute("data-prot") || 0;
      swapSourceCarb.value = selOption.getAttribute("data-carb") || 0;
      swapSourceFat.value = selOption.getAttribute("data-fat") || 0;
    }
    calculateFoodExchange();
  });
}

[swapSourceCal, swapSourceProt, swapSourceCarb, swapSourceFat, swapTargetSelect].forEach(el => {
  if (el) {
    el.addEventListener("input", calculateFoodExchange);
    el.addEventListener("change", calculateFoodExchange);
  }
});

if (applySwapToLogBtn) {
  applySwapToLogBtn.addEventListener("click", () => {
    if (!lastCalculatedSwap) {
      calculateFoodExchange();
    }
    if (lastCalculatedSwap) {
      addFoodToLog({
        id: Date.now(),
        ...lastCalculatedSwap
      });
      switchTab("tab-tracker");
      alert(`"${lastCalculatedSwap.name}" günlüğünüze başarıyla eklendi ve günlük kalori bütçenize işlendi!`);
    }
  });
}

// Sayfa Yüklendiğinde
window.addEventListener("DOMContentLoaded", () => {
  calculateNutrition();
  renderQuickDiningTemplates();
  renderTrackerBudget();
  renderLoggedFoodsTable();
  calculateFoodExchange();

  // Supabase Modal Kontrolleri
  const dbStatusBadge = document.getElementById("db-status-badge");
  const supabaseModal = document.getElementById("supabase-modal");
  const closeDbModalBtn = document.getElementById("close-db-modal-btn");
  const cancelDbModalBtn = document.getElementById("cancel-db-modal-btn");
  const supabaseConfigForm = document.getElementById("supabase-config-form");
  const modalSupabaseUrl = document.getElementById("modal-supabase-url");
  const modalSupabaseKey = document.getElementById("modal-supabase-key");

  if (dbStatusBadge && supabaseModal) {
    dbStatusBadge.addEventListener("click", () => {
      const cfg = window.DiyetWebCloud ? window.DiyetWebCloud.getConfig() : {};
      if (modalSupabaseUrl) modalSupabaseUrl.value = cfg.url || "";
      if (modalSupabaseKey) modalSupabaseKey.value = cfg.anonKey || "";
      supabaseModal.style.display = "flex";
    });

    const closeModal = () => { supabaseModal.style.display = "none"; };
    if (closeDbModalBtn) closeDbModalBtn.addEventListener("click", closeModal);
    if (cancelDbModalBtn) cancelDbModalBtn.addEventListener("click", closeModal);

    if (supabaseConfigForm) {
      supabaseConfigForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const url = modalSupabaseUrl.value.trim();
        const key = modalSupabaseKey.value.trim();
        if (window.DiyetWebCloud) {
          const client = window.DiyetWebCloud.saveCredentials(url, key);
          if (client) {
            alert("Harika! Supabase bulut veritabanına başarıyla bağlanıldı.");
            // Buluttaki yemekleri yükle
            window.DiyetWebCloud.fetchFoodLogs().then(cloudLogs => {
              if (cloudLogs && cloudLogs.length > 0) {
                loggedFoods = cloudLogs;
                saveLoggedFoods();
                renderTrackerBudget();
                renderLoggedFoodsTable();
              }
            });
          } else {
            alert("Anahtarlar tarayıcıya kaydedildi. İnternet veya anahtar formatınızı kontrol ediniz.");
          }
        }
        closeModal();
      });
    }
  }

  // Supabase Başlatma & Buluttaki Yemekleri Yükleme
  if (window.DiyetWebCloud && typeof window.DiyetWebCloud.init === "function") {
    const client = window.DiyetWebCloud.init();
    if (client) {
      window.DiyetWebCloud.fetchFoodLogs().then(cloudLogs => {
        if (cloudLogs && cloudLogs.length > 0) {
          loggedFoods = cloudLogs;
          saveLoggedFoods();
          renderTrackerBudget();
          renderLoggedFoodsTable();
        }
      });
    }
  }
});



