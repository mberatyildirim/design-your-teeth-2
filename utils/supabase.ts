// Supabase client configuration and utility functions

import { createClient } from '@supabase/supabase-js';

// Supabase configuration - Environment variables veya direkt değerler
const SUPABASE_URL = 'https://gohvftucirojbvusqoge.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvaHZmdHVjaXJvamJ2dXNxb2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTAxNTMsImV4cCI6MjA4MDUyNjE1M30.7Zld3vALzvVfXjmTEi-mx9zjbCNejl5_d9ORGRHqfcA';

// Supabase client oluştur
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Form submission interface - localStorage.ts ile aynı
export interface FormSubmission {
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  freeTreatment: boolean;
  selectedToothType: string;
  selectedToothColor: string;
  outputImgUrl: string;
}

/**
 * Form submission'ı Supabase'e kaydet
 * Tablo adı: submissions
 * 
 * Supabase'de şu tabloyu oluşturmanız gerekiyor:
 * 
 * CREATE TABLE submissions (
 *   id BIGSERIAL PRIMARY KEY,
 *   timestamp TIMESTAMPTZ NOT NULL,
 *   name TEXT NOT NULL,
 *   phone TEXT NOT NULL,
 *   email TEXT,
 *   free_treatment BOOLEAN DEFAULT false,
 *   selected_tooth_type TEXT NOT NULL,
 *   selected_tooth_color TEXT NOT NULL,
 *   output_img_url TEXT NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */
export async function saveSubmissionToSupabase(submission: FormSubmission): Promise<void> {
  try {
    console.log("🟢 [Supabase] Saving submission to database...");
    console.log("🟢 [Supabase] Submission data:", submission);
    
    // Supabase'e insert işlemi
    // Boş string'leri null'a çevir (Supabase'de daha temiz)
    const { data, error } = await supabase
      .from('submissions')
      .insert([
        {
          timestamp: submission.timestamp,
          name: submission.name,
          phone: submission.phone,
          email: submission.email || null,
          free_treatment: submission.freeTreatment,
          selected_tooth_type: submission.selectedToothType || null,
          selected_tooth_color: submission.selectedToothColor || null,
          output_img_url: submission.outputImgUrl || null
        }
      ])
      .select();

    if (error) {
      console.error("❌ [Supabase] Error saving submission:", error);
      throw error;
    }

    console.log("✅ [Supabase] Submission saved successfully:", data);
  } catch (error) {
    console.error("❌ [Supabase] Failed to save submission:", error);
    throw error;
  }
}

/**
 * Tüm submission'ları Supabase'den al
 */
export async function getSubmissionsFromSupabase(): Promise<FormSubmission[]> {
  try {
    console.log("🟢 [Supabase] Fetching submissions from database...");
    
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("❌ [Supabase] Error fetching submissions:", error);
      throw error;
    }

    // Supabase'den gelen veriyi FormSubmission formatına çevir
    const submissions: FormSubmission[] = (data || []).map((row: any) => ({
      timestamp: row.timestamp,
      name: row.name,
      phone: row.phone,
      email: row.email,
      freeTreatment: row.free_treatment || false,
      selectedToothType: row.selected_tooth_type,
      selectedToothColor: row.selected_tooth_color,
      outputImgUrl: row.output_img_url
    }));

    console.log("✅ [Supabase] Fetched submissions:", submissions.length);
    return submissions;
  } catch (error) {
    console.error("❌ [Supabase] Failed to fetch submissions:", error);
    return [];
  }
}

/**
 * Supabase'den tüm submission'ları sil
 */
export async function clearSubmissionsFromSupabase(): Promise<void> {
  try {
    console.log("🟢 [Supabase] Clearing all submissions...");
    
    const { error } = await supabase
      .from('submissions')
      .delete()
      .neq('id', 0); // Tüm kayıtları sil

    if (error) {
      console.error("❌ [Supabase] Error clearing submissions:", error);
      throw error;
    }

    console.log("✅ [Supabase] All submissions cleared");
  } catch (error) {
    console.error("❌ [Supabase] Failed to clear submissions:", error);
    throw error;
  }
}

