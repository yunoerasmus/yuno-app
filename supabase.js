import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vmifjzozrpzssaielqal.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtaWZqem96cnB6c3NhaWVscWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDE4NTAsImV4cCI6MjA4ODk3Nzg1MH0.la3iJWOTFHdhfJY3Z1sfCMz3TRU0B0Em_wND0g3pUY8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
