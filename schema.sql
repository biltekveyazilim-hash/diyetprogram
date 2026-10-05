-- ========================================================
-- DiyetWeb - Supabase Veritabanı Şeması
-- Supabase Dashboard -> SQL Editor kısmına yapıştırıp "RUN" butonuna basınız.
-- ========================================================

-- 1. Kullanıcı Profili ve Beslenme Tercihleri Tablosu
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    gender TEXT DEFAULT 'female',
    age INTEGER DEFAULT 28,
    height NUMERIC DEFAULT 168,
    weight NUMERIC DEFAULT 68,
    activity NUMERIC DEFAULT 1.375,
    goal TEXT DEFAULT 'lose',
    meal_pattern TEXT DEFAULT '2_meals_1_snack',
    is_diabetic BOOLEAN DEFAULT FALSE,
    target_calories INTEGER DEFAULT 1650,
    target_protein NUMERIC DEFAULT 85,
    target_carbs NUMERIC DEFAULT 180,
    target_fat NUMERIC DEFAULT 62,
    target_water NUMERIC DEFAULT 2.4
);

-- 2. Tüketilen Besinler & Dışarıda Yemek Günlüğü Tablosu
CREATE TABLE IF NOT EXISTS public.food_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    food_name TEXT NOT NULL,
    meal_type TEXT NOT NULL,
    calories NUMERIC NOT NULL,
    carbs NUMERIC NOT NULL DEFAULT 0,
    protein NUMERIC NOT NULL DEFAULT 0,
    fat NUMERIC NOT NULL DEFAULT 0,
    ke_value NUMERIC GENERATED ALWAYS AS (ROUND(carbs / 15.0, 1)) STORED
);

-- 3. Row Level Security (RLS) Ayarları
-- Anonim erişim veya herkese açık (anon key) ile veri ekleme/okuma izni
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;

-- Herkesin profil oluşturmasına ve okumasına izin veren politikalar (Anon Key ile uyumlu)
CREATE POLICY "Herkes profil ekleyebilir" 
ON public.profiles FOR INSERT 
TO public, anon 
WITH CHECK (true);

CREATE POLICY "Herkes profilleri okuyabilir" 
ON public.profiles FOR SELECT 
TO public, anon 
USING (true);

CREATE POLICY "Herkes profilleri güncelleyebilir" 
ON public.profiles FOR UPDATE 
TO public, anon 
USING (true);

-- Yemek günlüğü politikaları
CREATE POLICY "Herkes yemek günlüğüne ekleme yapabilir" 
ON public.food_logs FOR INSERT 
TO public, anon 
WITH CHECK (true);

CREATE POLICY "Herkes yemek günlüğünü okuyabilir" 
ON public.food_logs FOR SELECT 
TO public, anon 
USING (true);

CREATE POLICY "Herkes yemek günlüğünü silebilir" 
ON public.food_logs FOR DELETE 
TO public, anon 
USING (true);

-- Otomatik zaman güncelleme tetikleyicisi
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
