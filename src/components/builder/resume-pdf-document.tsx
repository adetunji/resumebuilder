
"use client";
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { ResumeData, WorkExperienceEntry, EducationEntry } from '@/lib/types';

// Register fonts - Optional: If you want to use custom fonts, you need to register them.
// For simplicity, we'll use default fonts.
// Font.register({
//   family: 'Open Sans',
//   fonts: [
//     { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
//     { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 }
//   ]
// });

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica', // Default font
    fontSize: 10,
    padding: 40,
    lineHeight: 1.5,
    color: '#333',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#129990', // Dark Teal
  },
  jobTitle: {
    fontSize: 16,
    color: '#90D1CA', // Light Teal
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 9,
    color: '#555',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  contactItem: {
    marginHorizontal: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#129990', // Dark Teal
    borderBottomWidth: 1,
    borderBottomColor: '#90D1CA', // Light Teal
    paddingBottom: 3,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  paragraph: {
    textAlign: 'justify',
    marginBottom: 5,
  },
  listItem: {
    marginLeft: 10,
    marginBottom: 2,
  },
  entry: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  entrySubtitle: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  entryDate: {
    fontSize: 9,
    color: '#777',
  },
  entryLocation: {
    fontSize: 9,
    color: '#777',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    backgroundColor: '#e0f2f1', // Very light teal
    color: '#096B68', // Deep Teal
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 9,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 10,
  }
});

const ResumePdfDocument: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, workExperience, education, skills } = data || {};

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr || typeof dateStr !== 'string') return 'N/A';
    const lowerDateStr = dateStr.toLowerCase();
    if (lowerDateStr === 'present' || lowerDateStr === '') return 'Present'; // Treat empty string as 'Present' or 'N/A'
    
    try {
      const parts = dateStr.split('-');
      const yearStr = parts[0];
      const monthStr = parts[1];

      if (!yearStr || !monthStr) { // Basic check for YYYY-MM format
        return dateStr; // Return original if not in expected format
      }

      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);

      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return dateStr; // Return original if parsing fails or month is invalid
      }
      
      const dateObj = new Date(year, month - 1);
      if (isNaN(dateObj.getTime())) {
        return dateStr; // Return original if date object is invalid
      }
      return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (e) {
      return dateStr; // Fallback to original string in case of any error
    }
  };
  
  // Ensure personalInfo exists and has fallback values
  const pi = personalInfo || {
    fullName: '', jobTitle: '', email: '', phoneNumber: '', address: '',
    linkedin: '', github: '', portfolio: ''
  };

  return (
  <Document title={`${pi.fullName || 'Resume'} - Resume`} author={pi.fullName || 'User'}>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.fullName}>{pi.fullName || "Your Name"}</Text>
        <Text style={styles.jobTitle}>{pi.jobTitle || "Your Job Title"}</Text>
        <View style={styles.contactInfo}>
          {pi.email && <Text style={styles.contactItem}>{pi.email}</Text>}
          {pi.phoneNumber && <Text style={styles.contactItem}>{(pi.email ? '• ' : '') + (pi.phoneNumber || '')}</Text>}
          {pi.address && <Text style={styles.contactItem}>{(pi.email || pi.phoneNumber ? '• ' : '') + (pi.address || '')}</Text>}
        </View>
        <View style={styles.contactInfo}>
           {pi.linkedin && <Text style={styles.contactItem}>LinkedIn: {pi.linkedin || ''}</Text>}
           {pi.github && <Text style={styles.contactItem}>GitHub: {pi.github || ''}</Text>}
           {pi.portfolio && <Text style={styles.contactItem}>Portfolio: {pi.portfolio || ''}</Text>}
        </View>
      </View>

      {(summary || '') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.paragraph}>{summary || ''}</Text>
        </View>
      )}

      {workExperience && workExperience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {workExperience.map((exp: WorkExperienceEntry | null) => exp && (
            <View key={exp.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{exp.jobTitle || ''}</Text>
                <Text style={styles.entryDate}>{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</Text>
              </View>
              <View style={styles.entryHeader}>
                <Text style={styles.entrySubtitle}>{exp.company || ''}</Text>
                <Text style={styles.entryLocation}>{exp.location || ''}</Text>
              </View>
              {(exp.description || '').toString().split('\n').map((line, i) => {
                const trimmedLine = line.trim();
                return trimmedLine && (
                  <Text key={i} style={styles.listItem}>• {trimmedLine.replace(/^- /, '')}</Text>
                );
              })}
            </View>
          ))}
        </View>
      )}

      {education && education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((edu: EducationEntry | null) => edu && (
            <View key={edu.id} style={styles.entry}>
               <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{edu.degree || ''}</Text>
                <Text style={styles.entryDate}>{formatDate(edu.graduationDate)}</Text>
              </View>
               <View style={styles.entryHeader}>
                 <Text style={styles.entrySubtitle}>{edu.institution || ''}</Text>
                 <Text style={styles.entryLocation}>{edu.location || ''}</Text>
              </View>
              {(edu.details || '') && <Text style={styles.paragraph}>{edu.details || ''}</Text>}
            </View>
          ))}
        </View>
      )}

      {(skills || '') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {(skills || '').toString().split(/[,;\n]+/).map((skill, i) => {
              const trimmedSkill = skill.trim();
              return trimmedSkill && (
                <Text key={i} style={styles.skill}>{trimmedSkill}</Text>
              );
            })}
          </View>
        </View>
      )}
    </Page>
  </Document>
  );
};

export default ResumePdfDocument;

