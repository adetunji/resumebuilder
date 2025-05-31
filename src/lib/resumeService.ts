import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import type { ResumeData } from './types';

const RESUMES_COLLECTION = 'resumes';

export async function saveResume(userId: string, resumeData: ResumeData, templateId: string) {
  try {
    // Validate userId
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid userId: must be a non-empty string');
    }

    // Check for invalid characters in userId
    if (/[\/\.\[\]#]/.test(userId)) {
      throw new Error('Invalid userId: contains invalid characters');
    }

    // Log the data we're trying to save
    console.log('Attempting to save resume with data:', {
      userId,
      templateId,
      resumeDataSize: JSON.stringify(resumeData).length, // Check if we're approaching the 1MB limit
      hasUndefinedValues: Object.entries(resumeData).some(([key, value]) => value === undefined),
      hasFunctionValues: Object.entries(resumeData).some(([key, value]) => typeof value === 'function'),
      personalInfoKeys: Object.keys(resumeData.personalInfo),
    });

    const resumeRef = doc(db, RESUMES_COLLECTION, userId);
    const dataToSave = {
      resumeData,
      templateId,
      updatedAt: new Date().toISOString(),
    };

    // Validate the data structure
    const validationErrors = [];
    if (typeof dataToSave.resumeData !== 'object') validationErrors.push('resumeData must be an object');
    if (typeof dataToSave.templateId !== 'string') validationErrors.push('templateId must be a string');
    if (typeof dataToSave.updatedAt !== 'string') validationErrors.push('updatedAt must be a string');
    
    if (validationErrors.length > 0) {
      throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
    }

    // Log the exact data structure being saved
    console.log('Data structure being saved:', {
      path: `${RESUMES_COLLECTION}/${userId}`,
      dataSize: JSON.stringify(dataToSave).length,
      dataPreview: JSON.stringify(dataToSave, null, 2).slice(0, 500) + '...', // First 500 chars
    });

    await setDoc(resumeRef, dataToSave);
    return { success: true };
  } catch (error) {
    // Enhanced error logging
    const errorDetails = {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorName: error instanceof Error ? error.name : 'Unknown error type',
      errorStack: error instanceof Error ? error.stack : undefined,
      userId,
      templateId,
      timestamp: new Date().toISOString(),
    };

    console.error('Error saving resume:', errorDetails);
    
    // Check for specific Firebase error codes
    if (error instanceof Error && 'code' in error) {
      const firebaseError = error as { code: string };
      switch (firebaseError.code) {
        case 'permission-denied':
          return { success: false, error: 'Permission denied. Check your Firebase security rules.' };
        case 'invalid-argument':
          return { success: false, error: 'Invalid data structure. Check the console for details.' };
        case 'resource-exhausted':
          return { success: false, error: 'Document size limit exceeded (1MB).' };
        default:
          return { 
            success: false, 
            error: `Firebase error: ${firebaseError.code}`,
            details: errorDetails
          };
      }
    }

    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save resume',
      details: errorDetails
    };
  }
}

export async function getResume(userId: string) {
  try {
    const resumeRef = doc(db, RESUMES_COLLECTION, userId);
    const resumeDoc = await getDoc(resumeRef);
    
    if (!resumeDoc.exists()) {
      return { success: false, error: 'Resume not found' };
    }

    const data = resumeDoc.data();
    return {
      success: true,
      data: {
        resumeData: data.resumeData as ResumeData,
        templateId: data.templateId as string,
      },
    };
  } catch (error) {
    console.error('Error fetching resume:', error);
    return { success: false, error: 'Failed to fetch resume' };
  }
}

export async function deleteResume(userId: string) {
  try {
    const resumeRef = doc(db, RESUMES_COLLECTION, userId);
    await deleteDoc(resumeRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting resume:', error);
    return { success: false, error: 'Failed to delete resume' };
  }
}

// For development/testing: Get all resumes (remove in production)
export async function getAllResumes() {
  try {
    const resumesRef = collection(db, RESUMES_COLLECTION);
    const querySnapshot = await getDocs(resumesRef);
    const resumes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, data: resumes };
  } catch (error) {
    console.error('Error fetching all resumes:', error);
    return { success: false, error: 'Failed to fetch resumes' };
  }
} 