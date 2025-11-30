// LocalStorage utility - Form verilerini kaydetmek için

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

const STORAGE_KEY = 'design_your_teeth_submissions';

/**
 * Form submission'ı localStorage'a kaydet
 */
export function saveSubmissionToLocalStorage(submission: FormSubmission): void {
  try {
    // Mevcut verileri al
    const existing = localStorage.getItem(STORAGE_KEY);
    const submissions: FormSubmission[] = existing ? JSON.parse(existing) : [];
    
    // Yeni submission'ı ekle
    submissions.push(submission);
    
    // LocalStorage'a kaydet
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    
    console.log("✅ [LocalStorage] Submission saved successfully");
  } catch (error) {
    console.error("❌ [LocalStorage] Failed to save submission:", error);
    throw error;
  }
}

/**
 * Tüm submission'ları localStorage'dan al
 */
export function getSubmissionsFromLocalStorage(): FormSubmission[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("❌ [LocalStorage] Failed to load submissions:", error);
    return [];
  }
}

/**
 * LocalStorage'ı temizle
 */
export function clearSubmissionsFromLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log("✅ [LocalStorage] All submissions cleared");
  } catch (error) {
    console.error("❌ [LocalStorage] Failed to clear submissions:", error);
    throw error;
  }
}

