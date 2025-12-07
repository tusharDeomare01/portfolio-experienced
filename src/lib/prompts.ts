import { portfolioData } from './portfolioData';

/**
 * Generates the system prompt from portfolio data
 */
function generateSystemPrompt(): string {
  const { personalInfo, education, career, projects, technicalSkills, softSkills } = portfolioData;

  let prompt = `You are an AI assistant representing ${personalInfo.name}${personalInfo.pronouns ? ` (${personalInfo.pronouns})` : ''}, ${personalInfo.title}.

Your role is to answer questions about ${personalInfo.name.split(' ')[0]}'s:
- Professional background and experience
- Education and qualifications
- Projects and achievements
- Technical skills and expertise
- Career journey

**Personal Information:**
- Name: ${personalInfo.name}${personalInfo.pronouns ? ` (${personalInfo.pronouns})` : ''}
- Title: ${personalInfo.title}
- Bio: ${personalInfo.bio}
${personalInfo.email ? `- Email: ${personalInfo.email}` : ''}
${personalInfo.location ? `- Location: ${personalInfo.location}` : ''}
${personalInfo.website ? `- Website: ${personalInfo.website}` : ''}
${personalInfo.linkedin ? `- LinkedIn: ${personalInfo.linkedin}` : ''}
${personalInfo.github ? `- GitHub: ${personalInfo.github}` : ''}

**Education:**`;

  education.forEach((edu, index) => {
    prompt += `\n${index + 1}. ${edu.degree} (${edu.period})
   - ${edu.institution}`;
    if (edu.specialization) {
      prompt += `\n   - Specialized in: ${edu.specialization}`;
    }
    if (edu.description) {
      prompt += `\n   - ${edu.description}`;
    }
    if (edu.achievements && edu.achievements.length > 0) {
      prompt += `\n   - Achievements:`;
      edu.achievements.forEach(achievement => {
        prompt += `\n     • ${achievement}`;
      });
    }
  });

  prompt += `\n\n**Career Timeline:**`;

  career.forEach((job, index) => {
    prompt += `\n${index + 1}. ${job.title} (${job.period})
   - ${job.company}
   - ${job.description}`;
    if (job.achievements && job.achievements.length > 0) {
      prompt += `\n   - Key Achievements:`;
      job.achievements.forEach(achievement => {
        prompt += `\n     • ${achievement}`;
      });
    }
    if (job.technologies && job.technologies.length > 0) {
      prompt += `\n   - Technologies: ${job.technologies.join(', ')}`;
    }
  });

  prompt += `\n\n**Recent Projects:**`;

  projects.forEach((project, index) => {
    prompt += `\n${index + 1}. ${project.name} (${project.period})
   - ${project.description}`;
    if (project.technologies && project.technologies.length > 0) {
      prompt += `\n   - Tech Stack: ${project.technologies.join(', ')}`;
    }
    if (project.features && project.features.length > 0) {
      prompt += `\n   - Key Features:`;
      project.features.forEach(feature => {
        prompt += `\n     • ${feature}`;
      });
    }
    if (project.achievements && project.achievements.length > 0) {
      prompt += `\n   - Achievements:`;
      project.achievements.forEach(achievement => {
        prompt += `\n     • ${achievement}`;
      });
    }
    if (project.link) {
      prompt += `\n   - Link: ${project.link}`;
    }
  });

  prompt += `\n\n**Technical Skills:**`;

  if (technicalSkills.frontend && technicalSkills.frontend.length > 0) {
    prompt += `\n- Frontend:`;
    technicalSkills.frontend.forEach(skill => {
      prompt += `\n  • ${skill.name}${skill.level ? ` (${skill.level}%)` : ''}`;
    });
  }

  if (technicalSkills.backend && technicalSkills.backend.length > 0) {
    prompt += `\n- Backend:`;
    technicalSkills.backend.forEach(skill => {
      prompt += `\n  • ${skill.name}${skill.level ? ` (${skill.level}%)` : ''}`;
    });
  }

  if (technicalSkills.database && technicalSkills.database.length > 0) {
    prompt += `\n- Database:`;
    technicalSkills.database.forEach(skill => {
      prompt += `\n  • ${skill.name}${skill.level ? ` (${skill.level}%)` : ''}`;
    });
  }

  if (technicalSkills.cloud && technicalSkills.cloud.length > 0) {
    prompt += `\n- Cloud:`;
    technicalSkills.cloud.forEach(skill => {
      prompt += `\n  • ${skill.name}${skill.level ? ` (${skill.level}%)` : ''}`;
    });
  }

  if (technicalSkills.devops && technicalSkills.devops.length > 0) {
    prompt += `\n- DevOps:`;
    technicalSkills.devops.forEach(skill => {
      prompt += `\n  • ${skill.name}${skill.level ? ` (${skill.level}%)` : ''}`;
    });
  }

  if (technicalSkills.tools && technicalSkills.tools.length > 0) {
    prompt += `\n- Tools:`;
    technicalSkills.tools.forEach(skill => {
      prompt += `\n  • ${skill.name}${skill.level ? ` (${skill.level}%)` : ''}`;
    });
  }

  if (technicalSkills.languages && technicalSkills.languages.length > 0) {
    prompt += `\n- Programming Languages:`;
    technicalSkills.languages.forEach(skill => {
      prompt += `\n  • ${skill.name}${skill.level ? ` (${skill.level}%)` : ''}`;
    });
  }

  if (softSkills && softSkills.length > 0) {
    prompt += `\n\n**Soft Skills:**`;
    prompt += `\n${softSkills.join(', ')}`;
  }

  if (portfolioData.certifications && portfolioData.certifications.length > 0) {
    prompt += `\n\n**Certifications:**`;
    portfolioData.certifications.forEach(cert => {
      prompt += `\n- ${cert.name}${cert.issuer ? ` (${cert.issuer})` : ''}${cert.date ? ` - ${cert.date}` : ''}`;
    });
  }

  if (portfolioData.languages && portfolioData.languages.length > 0) {
    prompt += `\n\n**Languages:**`;
    portfolioData.languages.forEach(lang => {
      prompt += `\n- ${lang.language}: ${lang.proficiency}`;
    });
  }

  prompt += `\n\n**Guidelines:**
- Be professional, friendly, and concise
- Only answer questions about ${personalInfo.name.split(' ')[0]}'s background, experience, and projects
- If asked about something not in your knowledge, politely redirect to what you know about ${personalInfo.name.split(' ')[0]}
- Use specific details from the provided context
- Maintain a conversational but professional tone
- If asked about contact information or availability, politely mention that you're an AI assistant and can provide information about ${personalInfo.name.split(' ')[0]}'s background
- Always refer to ${personalInfo.name.split(' ')[0]} in the third person (e.g., "She has experience..." or "Her project...")

**Emoji Usage Guidelines:**
- Use emojis SPARINGLY and ONLY for emotional/interactive purposes to make conversations more engaging
- Use emojis to express emotions like: 😊 (friendly), 🎉 (celebration/achievement), 💡 (insight/idea), 🚀 (excitement/progress), ⚡ (energy/speed), 🎯 (focus/goal), ✨ (excellence/quality)
- DO NOT use emojis for:
  - Dates, years, or time periods (e.g., "2024" should NOT have emojis)
  - Numbers, percentages, or statistics (e.g., "95%" should NOT have emojis)
  - Technical terms, code, or technical details
  - Names, titles, or professional information
  - Lists of technologies or skills
- Use 1-2 emojis maximum per response, only when it adds genuine emotional value
- Emojis should feel natural and enhance the conversation, not distract from the content`;

  return prompt;
}

export const SYSTEM_PROMPT = generateSystemPrompt();

export const SUGGESTED_QUESTIONS = [
  `Tell me about ${portfolioData.personalInfo.name.split(' ')[0]}'s experience with ${portfolioData.projects[0]?.name || 'recent projects'}`,
  `What are ${portfolioData.personalInfo.name.split(' ')[0]}'s technical skills?`,
  `What is ${portfolioData.personalInfo.name.split(' ')[0]}'s educational background?`,
  `Can you describe ${portfolioData.personalInfo.name.split(' ')[0]}'s career journey?`,
  `What projects has ${portfolioData.personalInfo.name.split(' ')[0]} worked on in the past 2 years?`,
  `What technologies does ${portfolioData.personalInfo.name.split(' ')[0]} use for frontend development?`,
  `Tell me about ${portfolioData.personalInfo.name.split(' ')[0]}'s leadership experience`,
  `What are ${portfolioData.personalInfo.name.split(' ')[0]}'s achievements as ${portfolioData.career[0]?.title || 'a professional'}?`,
];
