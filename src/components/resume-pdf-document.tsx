
"use client";
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
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
  const { personalInfo, summary, workExperience, education, skills } = data;

  // A simple way to format dates, you might want something more robust
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr || dateStr.toLowerCase() === 'present') return 'Present';
    try {
      const [year, month] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };
  
  return (
  <Document title={`${personalInfo.fullName || 'Resume'} - Resume`} author={personalInfo.fullName || 'User'}>
    <Page size="A4" style={styles.page}>
      {/* Basic Profile Image - Example, adapt as needed */}
      {/* This assumes one of the templates might have a concept of profile image */}
      {/* For the creative template, it uses picsum.photos */}
      {/* {selectedTemplateId === 'creative' && (
        <Image style={styles.profileImage} src={`https://placehold.co/100x100.png`} data-ai-hint="profile person" />
      )} */}


      <View style={styles.header}>
        <Text style={styles.fullName}>{personalInfo.fullName || "Your Name"}</Text>
        <Text style={styles.jobTitle}>{personalInfo.jobTitle || "Your Job Title"}</Text>
        <View style={styles.contactInfo}>
          {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
          {personalInfo.phoneNumber && <Text style={styles.contactItem}>{(personalInfo.email ? '• ' : '') + (personalInfo.phoneNumber || '')}</Text>}
          {personalInfo.address && <Text style={styles.contactItem}>{(personalInfo.email || personalInfo.phoneNumber ? '• ' : '') + (personalInfo.address || '')}</Text>}
        </View>
        <View style={styles.contactInfo}>
           {personalInfo.linkedin && <Text style={styles.contactItem}>LinkedIn: {personalInfo.linkedin || ''}</Text>}
           {personalInfo.github && <Text style={styles.contactItem}>GitHub: {personalInfo.github || ''}</Text>}
           {personalInfo.portfolio && <Text style={styles.contactItem}>Portfolio: {personalInfo.portfolio || ''}</Text>}
        </View>
      </View>

      {summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.paragraph}>{summary || ''}</Text>
        </View>
      )}

      {workExperience && workExperience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {workExperience.map((exp: WorkExperienceEntry) => (
            <View key={exp.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{exp.jobTitle || ''}</Text>
                <Text style={styles.entryDate}>{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</Text>
              </View>
              <View style={styles.entryHeader}>
                <Text style={styles.entrySubtitle}>{exp.company || ''}</Text>
                <Text style={styles.entryLocation}>{exp.location || ''}</Text>
              </View>
              {(exp.description || '').split('\n').map((line, i) => line.trim() && (
                <Text key={i} style={styles.listItem}>• {line.trim().replace(/^- /, '')}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {education && education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((edu: EducationEntry) => (
            <View key={edu.id} style={styles.entry}>
               <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{edu.degree || ''}</Text>
                <Text style={styles.entryDate}>{formatDate(edu.graduationDate)}</Text>
              </View>
               <View style={styles.entryHeader}>
                 <Text style={styles.entrySubtitle}>{edu.institution || ''}</Text>
                 <Text style={styles.entryLocation}>{edu.location || ''}</Text>
              </View>
              {edu.details && <Text style={styles.paragraph}>{edu.details || ''}</Text>}
            </View>
          ))}
        </View>
      )}

      {skills && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {(skills || '').split(/[,;\n]+/).map((skill, i) => skill.trim() && (
              <Text key={i} style={styles.skill}>{skill.trim()}</Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  </Document>
  );
};

export default ResumePdfDocument;
