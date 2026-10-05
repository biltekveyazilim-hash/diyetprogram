/**
 * DiyetWeb - Supabase Bulut Veritabanı Entegrasyonu
 * 
 * Bu dosya Supabase bağlantısını yönetir.
 * Eğer Supabase anahtarları girilmemişse sistem sorunsuz şekilde
 * LocalStorage üzerinden çalışmaya devam eder (Offline-First / Zero Breakage).
 */

// Supabase Yapılandırması (Kullanıcı isterse buraya doğrudan yazabilir veya web arayüzünden kaydedebilir)
const SUPABASE_CONFIG = {
  url: localStorage.getItem("diyetweb_supabase_url") || "",
  anonKey: localStorage.getItem("diyetweb_supabase_anon_key") || ""
};

let supabaseClient = null;

/**
 * Supabase İstemcisini Başlat
 */
function initSupabase() {
  if (typeof window.supabase !== "undefined" && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      updateDbStatusBadge(true);
      console.log("DiyetWeb: Supabase veritabanına başarıyla bağlanıldı.");
      return supabaseClient;
    } catch (err) {
      console.error("DiyetWeb: Supabase başlatma hatası:", err);
      updateDbStatusBadge(false);
      return null;
    }
  } else {
    updateDbStatusBadge(false);
    return null;
  }
}

/**
 * Üst bardaki DB durum rozetini güncelle
 */
function updateDbStatusBadge(isConnected) {
  const badge = document.getElementById("db-status-badge");
  if (!badge) return;

  if (isConnected) {
    badge.className = "badge badge-supabase-connected";
    badge.innerHTML = `<i class="fa-solid fa-cloud-check"></i> Supabase Bulut Aktif`;
    badge.title = "Verileriniz Supabase bulut veritabanında güvenle saklanıyor.";
  } else {
    badge.className = "badge badge-outline";
    badge.innerHTML = `<i class="fa-solid fa-hard-drive"></i> Yerel Depolama (Offline)`;
    badge.title = "Supabase anahtarları girilmediği için veriler tarayıcınızın yerel hafızasında (LocalStorage) saklanıyor.";
  }
}

/**
 * Supabase Anahtarlarını Kaydet
 */
function saveSupabaseCredentials(url, anonKey) {
  url = url.trim();
  anonKey = anonKey.trim();

  localStorage.setItem("diyetweb_supabase_url", url);
  localStorage.setItem("diyetweb_supabase_anon_key", anonKey);

  SUPABASE_CONFIG.url = url;
  SUPABASE_CONFIG.anonKey = anonKey;

  return initSupabase();
}

/**
 * Profil Bilgilerini Kaydet (Supabase & LocalStorage)
 */
async function syncProfileToCloud(profileData) {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .insert([{
          gender: profileData.gender,
          age: profileData.age,
          height: profileData.height,
          weight: profileData.weight,
          activity: profileData.activity,
          goal: profileData.goal,
          meal_pattern: profileData.mealPattern,
          is_diabetic: profileData.isDiabetic,
          target_calories: profileData.targetCalories,
          target_protein: profileData.targetProtein,
          target_carbs: profileData.targetCarbs,
          target_fat: profileData.targetFat,
          target_water: profileData.targetWater
        }]);

      if (error) {
        console.warn("Supabase profil kayıt uyarısı:", error.message);
      } else {
        console.log("Profil Supabase'e kaydedildi.");
      }
    } catch (e) {
      console.warn("Supabase profil bağlantı hatası:", e);
    }
  }
}

/**
 * Yeni Bir Yemeği Buluta Kaydet
 */
async function syncFoodLogToCloud(foodItem) {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('food_logs')
        .insert([{
          food_name: foodItem.name,
          meal_type: foodItem.mealType,
          calories: foodItem.cal,
          carbs: foodItem.carb,
          protein: foodItem.prot,
          fat: foodItem.fat
        }]);

      if (error) {
        console.warn("Supabase yemek kayıt uyarısı:", error.message);
      }
    } catch (e) {
      console.warn("Supabase bağlantı hatası:", e);
    }
  }
}

/**
 * Buluttaki Yemek Kayıtlarını Getir
 */
async function fetchFoodLogsFromCloud() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('food_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(item => ({
          id: item.id,
          name: item.food_name,
          mealType: item.meal_type,
          cal: item.calories,
          carb: item.carbs,
          prot: item.protein,
          fat: item.fat
        }));
      }
    } catch (e) {
      console.warn("Supabase veri çekme hatası:", e);
    }
  }
  return null;
}

/**
 * Buluttaki Bir Yemeği Sil
 */
async function deleteFoodLogFromCloud(foodId) {
  if (supabaseClient && typeof foodId === "string" && foodId.includes("-")) {
    try {
      await supabaseClient
        .from('food_logs')
        .delete()
        .eq('id', foodId);
    } catch (e) {
      console.warn("Supabase silme hatası:", e);
    }
  }
}

/**
 * Buluttaki Tüm Yemek Günlüğünü Sıfırla
 */
async function clearFoodLogsFromCloud() {
  if (supabaseClient) {
    try {
      await supabaseClient
        .from('food_logs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (e) {
      console.warn("Supabase tümünü silme hatası:", e);
    }
  }
}

// Global olarak erişilebilir kıl
window.DiyetWebCloud = {
  init: initSupabase,
  saveCredentials: saveSupabaseCredentials,
  syncProfile: syncProfileToCloud,
  syncFoodLog: syncFoodLogToCloud,
  fetchFoodLogs: fetchFoodLogsFromCloud,
  deleteFoodLog: deleteFoodLogFromCloud,
  clearFoodLogs: clearFoodLogsFromCloud,
  getConfig: () => ({ ...SUPABASE_CONFIG })
};
