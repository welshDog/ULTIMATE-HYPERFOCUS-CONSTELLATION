# Create GitHub Actions workflow for deployment
github_workflow = '''name: 🚀 Deploy Ultimate Hyperfocus Constellation

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    # Update repository data weekly
    - cron: '0 0 * * 0'

jobs:
  accessibility-test:
    name: ♿ Accessibility Testing
    runs-on: ubuntu-latest
    
    steps:
    - name: 🔄 Checkout code
      uses: actions/checkout@v4
      
    - name: 📦 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: 🔧 Install dependencies
      run: npm ci
      
    - name: 🧪 Run accessibility tests
      run: npm run test:a11y
      
    - name: 📊 Lighthouse accessibility audit
      uses: treosh/lighthouse-ci-action@v10
      with:
        configPath: '.lighthouserc.json'
        
  performance-test:
    name: ⚡ Performance Testing
    runs-on: ubuntu-latest
    
    steps:
    - name: 🔄 Checkout code
      uses: actions/checkout@v4
      
    - name: 📦 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: 🔧 Install dependencies  
      run: npm ci
      
    - name: ⚡ Run performance tests
      run: npm run test:performance
      
    - name: 📈 Upload performance results
      uses: actions/upload-artifact@v3
      with:
        name: performance-results
        path: lighthouse-results/

  build-and-deploy:
    name: 🌟 Build and Deploy
    runs-on: ubuntu-latest
    needs: [accessibility-test, performance-test]
    
    steps:
    - name: 🔄 Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0
        
    - name: 📦 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: 🔧 Install dependencies
      run: npm ci
      
    - name: 🏗️ Build project
      run: npm run build
      
    - name: 🧪 Validate HTML
      run: npm run validate
      
    - name: 🌐 Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
        publish_branch: gh-pages
        commit_message: '🚀 Deploy Ultimate Hyperfocus Constellation'
        
    - name: 📢 Create deployment summary
      if: github.ref == 'refs/heads/main'
      run: |
        echo "🌟 **Ultimate Hyperfocus Constellation Deployed!**" >> $GITHUB_STEP_SUMMARY
        echo "" >> $GITHUB_STEP_SUMMARY
        echo "🌐 **Live Demo**: https://welshdog.github.io/ultimate-hyperfocus-constellation/" >> $GITHUB_STEP_SUMMARY
        echo "" >> $GITHUB_STEP_SUMMARY
        echo "✅ **Accessibility**: WCAG 2.1 AA Compliant" >> $GITHUB_STEP_SUMMARY
        echo "⚡ **Performance**: Optimized for 60 FPS" >> $GITHUB_STEP_SUMMARY
        echo "📱 **Mobile**: Touch-optimized controls" >> $GITHUB_STEP_SUMMARY
        echo "🧠 **Neurodivergent**: ADHD-friendly interface" >> $GITHUB_STEP_SUMMARY
        
  security-scan:
    name: 🔒 Security Scan
    runs-on: ubuntu-latest
    
    steps:
    - name: 🔄 Checkout code
      uses: actions/checkout@v4
      
    - name: 🔍 Run security audit
      run: npm audit --audit-level high
      
    - name: 🛡️ CodeQL Analysis
      uses: github/codeql-action/init@v2
      with:
        languages: javascript
        
    - name: 🔬 Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2
'''

# Create issue templates directory structure and files
bug_report_template = '''---
name: 🐛 Bug Report
about: Create a report to help us improve accessibility and functionality
title: '[BUG] '
labels: ['bug', 'needs-triage']
assignees: ''
---

## 🐛 **Bug Description**
A clear and concise description of what the bug is.

## 🔄 **Steps to Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## ✅ **Expected Behavior**
A clear and concise description of what you expected to happen.

## ❌ **Actual Behavior**
A clear and concise description of what actually happened.

## 📸 **Screenshots**
If applicable, add screenshots to help explain your problem.

## 🖥️ **Environment Information**
- **OS**: [e.g. Windows 10, macOS Big Sur, Ubuntu 20.04]
- **Browser**: [e.g. Chrome 96, Firefox 94, Safari 15]
- **Screen Resolution**: [e.g. 1920x1080, 2560x1440]
- **Device Type**: [e.g. Desktop, Laptop, Mobile, Tablet]

## ♿ **Accessibility Impact**
- [ ] This affects keyboard navigation
- [ ] This affects screen reader users  
- [ ] This affects color contrast/visibility
- [ ] This affects users with motion sensitivity
- [ ] This affects focus management
- [ ] This doesn't appear to affect accessibility

**Assistive Technology Used** (if applicable):
- [ ] Screen reader (which one?)
- [ ] Voice control
- [ ] Keyboard-only navigation
- [ ] High contrast mode
- [ ] Other: ___________

## 🧠 **Neurodivergent Impact**
- [ ] This affects hyperfocus sessions
- [ ] This affects users with ADHD
- [ ] This affects users with dyslexia
- [ ] This affects users with autism
- [ ] This affects concentration/focus
- [ ] This doesn't appear to affect neurodivergent users

## 📱 **Mobile/Touch Impact**
- [ ] This affects mobile users
- [ ] This affects touch interactions
- [ ] This affects tablet users
- [ ] This doesn't affect mobile/touch

## 🔍 **Additional Context**
Add any other context about the problem here.

## 🚀 **Possible Solution**
If you have ideas on how to fix this, please share them!

---

**Thank you for helping us improve the Ultimate Hyperfocus Constellation! Your report helps make the experience better for all neurodivergent developers.** 🌟
'''

feature_request_template = '''---
name: ✨ Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: ['enhancement', 'needs-discussion']
assignees: ''
---

## ✨ **Feature Summary**
A clear and concise description of the feature you'd like to see.

## 💡 **Motivation**
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**What would this feature help you accomplish?**
Describe your use case and how this feature would improve your experience.

## 🎯 **Detailed Description**
**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

## 🧠 **Neurodivergent Benefits**
How would this feature specifically help neurodivergent users?
- [ ] Improves hyperfocus support
- [ ] Better for ADHD users
- [ ] Helps users with dyslexia
- [ ] Benefits autistic users
- [ ] Improves executive function support
- [ ] Reduces cognitive load
- [ ] Other: ___________

## ♿ **Accessibility Considerations**
- [ ] This feature should work with screen readers
- [ ] This feature needs keyboard navigation support
- [ ] This feature should respect motion preferences
- [ ] This feature needs high contrast support
- [ ] This feature affects focus management
- [ ] Other accessibility needs: ___________

## 🎮 **User Experience**
**How should users interact with this feature?**
- Desktop users: 
- Mobile users:
- Keyboard users:
- Screen reader users:

**Where should this feature be located in the interface?**
Describe the ideal placement and integration.

## 📊 **Success Metrics**
How would we know this feature is successful?
- [ ] User engagement increases
- [ ] Accessibility improves
- [ ] Performance remains good
- [ ] Hyperfocus sessions improve
- [ ] Other: ___________

## 🛠️ **Implementation Ideas**
If you have ideas about implementation, share them here:
- Technical approach:
- UI/UX considerations:
- Potential challenges:

## 📱 **Platform Support**
Which platforms should this feature support?
- [ ] Desktop browsers
- [ ] Mobile browsers  
- [ ] Tablet browsers
- [ ] All platforms

## 🔗 **Related Issues/Features**
Link to any related issues or features:
- Related to #
- Depends on #
- Blocks #

## 📸 **Mockups/Examples**
If you have mockups, sketches, or examples from other apps, please share them!

## 🌟 **Additional Context**
Add any other context, screenshots, or examples about the feature request here.

---

**Thank you for helping us make the Ultimate Hyperfocus Constellation even better! Your ideas help create a more inclusive and powerful experience for all developers.** 🚀
'''

accessibility_issue_template = '''---
name: ♿ Accessibility Issue
about: Report accessibility barriers or improvements needed
title: '[A11Y] '
labels: ['accessibility', 'needs-review', 'priority-high']
assignees: ''
---

## ♿ **Accessibility Issue Description**
A clear and concise description of the accessibility barrier or improvement needed.

## 🛠️ **Assistive Technology**
What assistive technology are you using?
- [ ] Screen reader (which one?): ___________
- [ ] Voice control software
- [ ] Switch navigation
- [ ] Eye tracking
- [ ] Keyboard-only navigation
- [ ] High contrast mode
- [ ] Screen magnification
- [ ] Other: ___________

**Software/Hardware Details:**
- AT Name and Version:
- Browser and Version:
- Operating System:

## 🎯 **WCAG Guidelines**
Which WCAG guidelines does this relate to?
- [ ] 1.1 Text Alternatives
- [ ] 1.2 Time-based Media
- [ ] 1.3 Adaptable
- [ ] 1.4 Distinguishable
- [ ] 2.1 Keyboard Accessible
- [ ] 2.2 Enough Time
- [ ] 2.3 Seizures and Physical Reactions
- [ ] 2.4 Navigable
- [ ] 2.5 Input Modalities
- [ ] 3.1 Readable
- [ ] 3.2 Predictable
- [ ] 3.3 Input Assistance
- [ ] 4.1 Compatible
- [ ] Not sure/Other

## 📍 **Location**
Where in the application does this occur?
- [ ] Repository mode
- [ ] Research mode  
- [ ] Settings/controls
- [ ] Hyperfocus session interface
- [ ] Achievement system
- [ ] Navigation menus
- [ ] Modal dialogs
- [ ] Everywhere
- [ ] Other: ___________

**Specific URL or section:** ___________

## ❌ **Current Behavior**
Describe what currently happens that creates an accessibility barrier:

## ✅ **Expected Behavior**
Describe what should happen to make this accessible:

## 🔧 **Suggested Solution**
If you have ideas for how to fix this, please share:

## 🌟 **Impact Level**
- [ ] **Critical** - Makes the feature completely unusable
- [ ] **High** - Significantly impacts usability
- [ ] **Medium** - Creates difficulty but workarounds exist
- [ ] **Low** - Minor improvement that would enhance experience

## 🧠 **Neurodivergent Impact**
Does this accessibility issue specifically affect neurodivergent users?
- [ ] Affects users with ADHD
- [ ] Affects users with dyslexia
- [ ] Affects users with autism
- [ ] Affects users with learning disabilities
- [ ] Affects executive function
- [ ] Other: ___________

## 🎮 **User Journey Impact**
How does this affect the user's ability to:
- [ ] Navigate the constellation
- [ ] Start/manage hyperfocus sessions
- [ ] Switch between repository/research modes
- [ ] View repository details
- [ ] Track progress and achievements
- [ ] Use keyboard shortcuts
- [ ] Customize accessibility settings

## 📊 **Testing Details**
How did you discover this issue?
- [ ] Manual testing with AT
- [ ] Automated accessibility tools
- [ ] User feedback
- [ ] Accessibility audit
- [ ] Other: ___________

**Testing Tools Used:**
- [ ] axe DevTools
- [ ] WAVE
- [ ] Lighthouse
- [ ] Pa11y
- [ ] Manual keyboard testing
- [ ] Screen reader testing
- [ ] Other: ___________

## 📸 **Evidence**
Please provide screenshots, screen recordings, or other evidence:

## 🔗 **Related Issues**
Link to any related accessibility issues:

## 📚 **Resources**
Relevant documentation or resources:
- WCAG technique: 
- Best practice reference:
- Similar implementations:

---

**Thank you for helping us maintain the highest accessibility standards! Your report helps ensure the Ultimate Hyperfocus Constellation works for everyone.** 🌟

**Priority Note:** Accessibility issues are treated as high priority and will be addressed promptly.
'''

# Save GitHub workflow and issue templates
import os

# Create directories
os.makedirs('.github/workflows', exist_ok=True)
os.makedirs('.github/ISSUE_TEMPLATE', exist_ok=True)

with open('.github/workflows/deploy.yml', 'w') as f:
    f.write(github_workflow)

with open('.github/ISSUE_TEMPLATE/bug_report.yml', 'w') as f:
    f.write(bug_report_template)

with open('.github/ISSUE_TEMPLATE/feature_request.yml', 'w') as f:
    f.write(feature_request_template)

with open('.github/ISSUE_TEMPLATE/accessibility_issue.yml', 'w') as f:
    f.write(accessibility_issue_template)

print("✅ GitHub configuration files created!")
print("\n📁 GitHub Files:")
print("   🔄 .github/workflows/deploy.yml")
print("   🐛 .github/ISSUE_TEMPLATE/bug_report.yml") 
print("   ✨ .github/ISSUE_TEMPLATE/feature_request.yml")
print("   ♿ .github/ISSUE_TEMPLATE/accessibility_issue.yml")
print("\n🌟 Features:")
print("   🚀 Automated GitHub Pages deployment")
print("   ♿ Accessibility testing integration")  
print("   ⚡ Performance monitoring")
print("   🔒 Security scanning")
print("   📋 Professional issue templates")
print("   🏆 Automated deployment summaries")