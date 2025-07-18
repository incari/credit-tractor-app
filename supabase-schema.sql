-- Habilitar la extensión UUID si no está activa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ⚠️ Eliminar tablas si existen (solo en desarrollo, no usar en producción sin respaldo)
DROP TABLE IF EXISTS public.credit_tractor_payments CASCADE;
DROP TABLE IF EXISTS public.credit_tractor_credit_cards CASCADE;
DROP TABLE IF EXISTS public.credit_tractor_user_settings CASCADE;
DROP TABLE IF EXISTS public.credit_tractor_expense_categories CASCADE;
DROP TABLE IF EXISTS public.credit_tractor_incomes CASCADE;
DROP TABLE IF EXISTS public.credit_tractor_expenses CASCADE;

-- Crear tabla de pagos
CREATE TABLE public.credit_tractor_payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    installments INTEGER NOT NULL,
    first_payment_date DATE NOT NULL,
    credit_card TEXT NOT NULL,
    initial_payment DECIMAL(10,2) DEFAULT 0,
    interest_rate DECIMAL(5,2) DEFAULT 0,
    payment_type TEXT CHECK (payment_type IN ('monthly', 'beginning', 'ending', 'custom')) DEFAULT 'monthly',
    custom_day_of_month INTEGER CHECK (custom_day_of_month >= 1 AND custom_day_of_month <= 31),
    currency TEXT NOT NULL DEFAULT 'EUR',
    paid_installments INTEGER[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de tarjetas de crédito
CREATE TABLE public.credit_tractor_credit_cards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    last_four TEXT NOT NULL CHECK (length(last_four) = 4),
    credit_limit DECIMAL(10,2),
    yearly_fee DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, last_four)
);

-- Crear tabla de configuración de usuario
CREATE TABLE public.credit_tractor_user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    language TEXT CHECK (language IN ('EN', 'ES', 'DE', 'FR', 'IT', 'PT')) DEFAULT 'EN',
    currency TEXT NOT NULL DEFAULT 'EUR',
    last_used_card TEXT,
    months_to_show INTEGER DEFAULT 12 CHECK (months_to_show > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de categorías de gastos
CREATE TABLE public.credit_tractor_expense_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT DEFAULT '#3B82F6',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Crear tabla de ingresos
CREATE TABLE public.credit_tractor_incomes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    is_recurring BOOLEAN DEFAULT false,
    recurrence_interval TEXT CHECK (recurrence_interval IN ('Weekly', 'Biweekly', 'Monthly', 'Quarterly', 'Yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de gastos
CREATE TABLE public.credit_tractor_expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    category_id UUID REFERENCES public.credit_tractor_expense_categories(id) ON DELETE SET NULL,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_interval TEXT CHECK (recurrence_interval IN ('Weekly', 'Biweekly', 'Monthly', 'Quarterly', 'Yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activar RLS en todas las tablas
ALTER TABLE public.credit_tractor_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_tractor_credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_tractor_user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_tractor_expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_tractor_incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_tractor_expenses ENABLE ROW LEVEL SECURITY;

-- RLS para credit_tractor_payments
CREATE POLICY "Users can view their own payments" ON public.credit_tractor_payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON public.credit_tractor_payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" ON public.credit_tractor_payments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payments" ON public.credit_tractor_payments
    FOR DELETE USING (auth.uid() = user_id);

-- RLS para credit_tractor_credit_cards
CREATE POLICY "Users can view their own credit cards" ON public.credit_tractor_credit_cards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credit cards" ON public.credit_tractor_credit_cards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credit cards" ON public.credit_tractor_credit_cards
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credit cards" ON public.credit_tractor_credit_cards
    FOR DELETE USING (auth.uid() = user_id);

-- RLS para credit_tractor_user_settings
CREATE POLICY "Users can view their own settings" ON public.credit_tractor_user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON public.credit_tractor_user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON public.credit_tractor_user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" ON public.credit_tractor_user_settings
    FOR DELETE USING (auth.uid() = user_id);

-- RLS para credit_tractor_expense_categories
CREATE POLICY "Users can view their own expense categories" ON public.credit_tractor_expense_categories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expense categories" ON public.credit_tractor_expense_categories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expense categories" ON public.credit_tractor_expense_categories
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expense categories" ON public.credit_tractor_expense_categories
    FOR DELETE USING (auth.uid() = user_id);

-- RLS para credit_tractor_incomes
CREATE POLICY "Users can view their own incomes" ON public.credit_tractor_incomes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own incomes" ON public.credit_tractor_incomes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own incomes" ON public.credit_tractor_incomes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own incomes" ON public.credit_tractor_incomes
    FOR DELETE USING (auth.uid() = user_id);

-- RLS para credit_tractor_expenses
CREATE POLICY "Users can view their own expenses" ON public.credit_tractor_expenses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses" ON public.credit_tractor_expenses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON public.credit_tractor_expenses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON public.credit_tractor_expenses
    FOR DELETE USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX credit_tractor_payments_user_id_idx ON public.credit_tractor_payments(user_id);
CREATE INDEX credit_tractor_payments_created_at_idx ON public.credit_tractor_payments(created_at DESC);
CREATE INDEX credit_tractor_payments_first_payment_date_idx ON public.credit_tractor_payments(first_payment_date);

CREATE INDEX credit_tractor_credit_cards_user_id_idx ON public.credit_tractor_credit_cards(user_id);
CREATE INDEX credit_tractor_credit_cards_last_four_idx ON public.credit_tractor_credit_cards(last_four);

CREATE INDEX credit_tractor_user_settings_user_id_idx ON public.credit_tractor_user_settings(user_id);

CREATE INDEX credit_tractor_expense_categories_user_id_idx ON public.credit_tractor_expense_categories(user_id);
CREATE INDEX credit_tractor_expense_categories_name_idx ON public.credit_tractor_expense_categories(name);

CREATE INDEX credit_tractor_incomes_user_id_idx ON public.credit_tractor_incomes(user_id);
CREATE INDEX credit_tractor_incomes_start_date_idx ON public.credit_tractor_incomes(start_date);

CREATE INDEX credit_tractor_expenses_user_id_idx ON public.credit_tractor_expenses(user_id);
CREATE INDEX credit_tractor_expenses_category_id_idx ON public.credit_tractor_expenses(category_id);
CREATE INDEX credit_tractor_expenses_start_date_idx ON public.credit_tractor_expenses(start_date);

-- Función para actualizar la columna updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_credit_tractor_payments_updated_at
BEFORE UPDATE ON public.credit_tractor_payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_tractor_credit_cards_updated_at
BEFORE UPDATE ON public.credit_tractor_credit_cards
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_tractor_user_settings_updated_at
BEFORE UPDATE ON public.credit_tractor_user_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_tractor_expense_categories_updated_at
BEFORE UPDATE ON public.credit_tractor_expense_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_tractor_incomes_updated_at
BEFORE UPDATE ON public.credit_tractor_incomes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_tractor_expenses_updated_at
BEFORE UPDATE ON public.credit_tractor_expenses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear configuración inicial del usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.credit_tractor_user_settings (user_id, language, currency, months_to_show)
    VALUES (NEW.id, 'EN', 'EUR', 12);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Asegurar que no haya conflicto con el trigger previo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear trigger para ejecutar la función al crear usuario
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función segura para estadísticas de pagos (sólo datos del usuario)
CREATE OR REPLACE FUNCTION public.get_credit_tractor_payment_stats()
RETURNS TABLE (
    user_id UUID,
    total_payments INTEGER,
    total_amount NUMERIC,
    avg_installments NUMERIC,
    unique_cards INTEGER
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        user_id,
        COUNT(*) AS total_payments,
        SUM(price * (1 + interest_rate / 100)) AS total_amount,
        AVG(installments) AS avg_installments,
        COUNT(DISTINCT credit_card) AS unique_cards
    FROM public.credit_tractor_payments
    WHERE user_id = auth.uid()
    GROUP BY user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permisos mínimos necesarios
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.credit_tractor_payments TO authenticated;
GRANT ALL ON public.credit_tractor_credit_cards TO authenticated;
GRANT ALL ON public.credit_tractor_user_settings TO authenticated;
GRANT ALL ON public.credit_tractor_expense_categories TO authenticated;
GRANT ALL ON public.credit_tractor_incomes TO authenticated;
GRANT ALL ON public.credit_tractor_expenses TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_credit_tractor_payment_stats TO authenticated;
