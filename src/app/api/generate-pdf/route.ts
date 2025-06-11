import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import type { ResumeData } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { resumeData, templateId } = await request.json();
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Create HTML content based on template
    const htmlContent = generateResumeHTML(resumeData, templateId);
    
    // Set the HTML content
    await page.setContent(htmlContent);
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      }
    });
    
    await browser.close();
    
    // Return the PDF
    const fileName = `${(resumeData.personalInfo.fullName || 'resume').replace(/\s+/g, '_')}_${templateId}.pdf`;
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

function generateResumeHTML(resumeData: ResumeData, templateId: string): string {
  const { personalInfo, workExperience, education, skills } = resumeData;
  
  // Base styles for all templates
  const baseStyles = `
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #2c3e50;
    }
    .name {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #2c3e50;
    }
    .job-title {
      font-size: 18px;
      color: #7f8c8d;
      margin-bottom: 15px;
    }
    .contact-info {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #2c3e50;
      border-bottom: 1px solid #bdc3c7;
      padding-bottom: 5px;
    }
    .job, .education-item {
      margin-bottom: 15px;
    }
    .job-title, .degree {
      font-weight: bold;
      font-size: 16px;
      color: #34495e;
    }
    .job-company, .institution {
      font-style: italic;
      color: #7f8c8d;
      margin-bottom: 5px;
    }
    .job-date, .graduation-date {
      color: #95a5a6;
      font-size: 14px;
    }
    .job-description, .education-details {
      margin-top: 8px;
      text-align: justify;
    }
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .skill-item {
      background-color: #ecf0f1;
      padding: 5px 12px;
      border-radius: 15px;
      font-size: 14px;
      color: #2c3e50;
    }
  `;

  // Template-specific styles
  const templateStyles = {
    modern: `
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px;
        border-radius: 10px;
        margin-bottom: 30px;
      }
      .name {
        color: white;
        font-size: 36px;
      }
      .job-title {
        color: #ecf0f1;
      }
      .contact-info {
        color: #ecf0f1;
      }
      .section-title {
        color: #667eea;
        border-bottom-color: #667eea;
      }
    `,
    classic: `
      .header {
        border-bottom: 3px solid #2c3e50;
      }
      .section-title {
        color: #2c3e50;
        border-bottom: 2px solid #2c3e50;
      }
    `,
    minimalist: `
      .header {
        border-bottom: 1px solid #bdc3c7;
      }
      .section-title {
        color: #34495e;
        border-bottom: 1px solid #ecf0f1;
      }
      .name {
        font-size: 28px;
      }
    `,
    creative: `
      .header {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        color: white;
        padding: 30px;
        border-radius: 15px;
        margin-bottom: 30px;
      }
      .name {
        color: white;
        font-size: 36px;
      }
      .job-title {
        color: #ecf0f1;
      }
      .contact-info {
        color: #ecf0f1;
      }
      .section-title {
        color: #ff6b6b;
        border-bottom-color: #ff6b6b;
      }
    `,
    technical: `
      .header {
        background: #2c3e50;
        color: white;
        padding: 30px;
        margin-bottom: 30px;
      }
      .name {
        color: white;
        font-size: 36px;
      }
      .job-title {
        color: #3498db;
      }
      .contact-info {
        color: #ecf0f1;
      }
      .section-title {
        color: #2c3e50;
        border-bottom: 2px solid #3498db;
      }
    `
  };

  const selectedTemplateStyle = templateStyles[templateId as keyof typeof templateStyles] || templateStyles.modern;

  // Parse skills string into array
  const skillsArray = skills ? skills.split(/[,\n]/).map(skill => skill.trim()).filter(skill => skill) : [];

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Resume - ${personalInfo.fullName}</title>
        <style>
          ${baseStyles}
          ${selectedTemplateStyle}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="name">${personalInfo.fullName || 'Your Name'}</div>
            <div class="job-title">${personalInfo.jobTitle || 'Job Title'}</div>
            <div class="contact-info">
              ${personalInfo.email ? `${personalInfo.email} • ` : ''}
              ${personalInfo.phoneNumber ? `${personalInfo.phoneNumber} • ` : ''}
              ${personalInfo.address || 'Address'}
            </div>
            ${personalInfo.linkedin ? `<div class="contact-info">${personalInfo.linkedin}</div>` : ''}
          </div>
          
          ${resumeData.summary ? `
            <div class="section">
              <div class="section-title">Professional Summary</div>
              <p>${resumeData.summary}</p>
            </div>
          ` : ''}
          
          ${workExperience && workExperience.length > 0 ? `
            <div class="section">
              <div class="section-title">Professional Experience</div>
              ${workExperience.map(job => `
                <div class="job">
                  <div class="job-title">${job.jobTitle || 'Job Title'}</div>
                  <div class="job-company">${job.company || 'Company'} - ${job.location || 'Location'}</div>
                  <div class="job-date">${job.startDate || 'Start'} - ${job.endDate || 'Present'}</div>
                  ${job.description ? `<div class="job-description">${job.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${education && education.length > 0 ? `
            <div class="section">
              <div class="section-title">Education</div>
              ${education.map(edu => `
                <div class="education-item">
                  <div class="degree">${edu.degree || 'Degree'}</div>
                  <div class="institution">${edu.institution || 'Institution'} - ${edu.location || 'Location'}</div>
                  <div class="graduation-date">${edu.graduationDate || 'Graduation Date'}</div>
                  ${edu.details ? `<div class="education-details">${edu.details}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${skillsArray.length > 0 ? `
            <div class="section">
              <div class="section-title">Skills</div>
              <div class="skills-list">
                ${skillsArray.map(skill => `
                  <span class="skill-item">${skill}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </body>
    </html>
  `;
} 