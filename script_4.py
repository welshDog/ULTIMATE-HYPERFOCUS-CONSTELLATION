# Create Pull Request template
pr_template = '''# 🌟 Ultimate Hyperfocus Constellation - Pull Request

## 📝 **Description**
Brief summary of the changes and which issue is fixed (if applicable).

**Fixes #** (issue number)

## 🎯 **Type of Change**
- [ ] 🐛 **Bug fix** (non-breaking change which fixes an issue)
- [ ] ✨ **New feature** (non-breaking change which adds functionality)
- [ ] 💥 **Breaking change** (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 **Documentation** (changes to documentation only)
- [ ] 🎨 **Style/UI** (changes that affect appearance but not functionality)
- [ ] ♿ **Accessibility** (changes that improve accessibility)
- [ ] ⚡ **Performance** (changes that improve performance)
- [ ] 🧠 **Neurodivergent Enhancement** (changes specifically designed for neurodivergent users)

## ✅ **Testing Checklist**
- [ ] **Manual Testing**: I have tested this change manually
- [ ] **Keyboard Navigation**: All new features work with keyboard-only navigation
- [ ] **Screen Reader**: Tested with screen reader (specify which one): ___________
- [ ] **Mobile**: Tested on mobile devices (responsive design)
- [ ] **Browser Testing**: Tested in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] **Performance**: No significant performance regression
- [ ] **Accessibility**: Maintains or improves accessibility (WCAG 2.1 AA)

## 🧠 **Neurodivergent User Impact**
How does this change affect neurodivergent users?
- [ ] **Improves hyperfocus sessions** (better focus support)
- [ ] **Benefits ADHD users** (attention-friendly features)  
- [ ] **Helps dyslexic users** (reading/text improvements)
- [ ] **Benefits autistic users** (predictable, sensory-friendly)
- [ ] **Improves executive function** (better organization/structure)
- [ ] **No specific neurodivergent impact**
- [ ] **Other**: ___________

## ♿ **Accessibility Impact**
- [ ] **Keyboard navigation** is maintained/improved
- [ ] **Screen reader support** is maintained/improved  
- [ ] **Focus management** works correctly
- [ ] **Color contrast** meets WCAG standards
- [ ] **Motion/animation** respects user preferences
- [ ] **ARIA labels** are appropriate and complete
- [ ] **No accessibility impact**

## 📱 **Mobile Impact**
- [ ] **Touch interactions** work correctly
- [ ] **Responsive design** maintained
- [ ] **Performance** on mobile devices is acceptable
- [ ] **No mobile impact**

## 🎮 **Feature Areas Affected**
- [ ] **Repository Mode** (3D repository visualization)
- [ ] **Research Mode** (interactive research navigation)  
- [ ] **Hyperfocus Sessions** (session management and tracking)
- [ ] **Achievement System** (progress tracking and gamification)
- [ ] **Accessibility Controls** (user customization options)
- [ ] **Navigation** (mode switching, menus, shortcuts)
- [ ] **Performance** (rendering, API calls, optimization)
- [ ] **Documentation** (README, guides, comments)

## 🔧 **Implementation Details**

### **Technical Changes**
Describe the technical implementation:

### **Files Modified**
List the main files that were changed:
- 
- 
- 

### **API Changes**
If applicable, describe any API changes:

### **Database/Data Changes**
If applicable, describe data structure changes:

## 📸 **Screenshots/Evidence**
If applicable, add screenshots or screen recordings to help reviewers understand the changes:

**Before:**
[Screenshot or description of before state]

**After:**  
[Screenshot or description of after state]

## 🧪 **Testing Instructions**
Step-by-step instructions for reviewers to test your changes:

1. 
2. 
3. 

**Expected Result:**

**Edge Cases to Test:**
- 
- 

## ⚠️ **Known Issues/Limitations**
List any known issues or limitations with this change:
- 
- 

## 📚 **Documentation Updates**
- [ ] **README.md** updated (if needed)
- [ ] **API documentation** updated (if needed)
- [ ] **User guide** updated (if needed)
- [ ] **Accessibility documentation** updated (if needed)
- [ ] **Code comments** added/updated
- [ ] **No documentation changes needed**

## 🔄 **Breaking Changes**
If this is a breaking change, describe:
- What breaks:
- How to update existing usage:
- Migration guide (if complex):

## 🤝 **Review Requests**
Specific areas where you'd like focused review:
- [ ] **Code quality and architecture**
- [ ] **Accessibility implementation**
- [ ] **Performance impact**
- [ ] **User experience flow**
- [ ] **Mobile responsiveness** 
- [ ] **Cross-browser compatibility**
- [ ] **Security implications**

## 📝 **Additional Notes**
Any additional information that reviewers should know:

---

## **Reviewer Guidelines** 🔍

### **For Maintainers:**
- [ ] **Code Review**: Architecture, quality, maintainability
- [ ] **Accessibility Review**: WCAG compliance, screen reader testing
- [ ] **Performance Review**: No regressions, optimization opportunities
- [ ] **UX Review**: Neurodivergent-friendly, intuitive interface
- [ ] **Documentation Review**: Clear, complete, up-to-date

### **Testing Priorities:**
1. **Accessibility**: Keyboard navigation, screen readers, ARIA
2. **Performance**: 60 FPS, loading times, memory usage
3. **Mobile**: Touch interactions, responsive design
4. **Cross-browser**: Chrome, Firefox, Safari, Edge
5. **Neurodivergent UX**: Hyperfocus-friendly, ADHD considerations

### **Merge Criteria:**
- [ ] All tests pass (automated + manual)
- [ ] Accessibility audit passes
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] At least one maintainer approval
- [ ] No merge conflicts

---

**Thank you for contributing to the Ultimate Hyperfocus Constellation! Your work helps create a more accessible and inclusive developer experience.** 🌟

**Remember: Every contribution makes the constellation brighter for neurodivergent developers everywhere!** ✨
'''

# Create .gitignore file
gitignore_content = '''# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov
.nyc_output/

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Parcel-bundler cache
.cache/
.parcel-cache/

# Next.js build output
.next/

# Nuxt.js build output
.nuxt/
dist/

# Gatsby files
.cache/
public/

# Vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# IDE and editor files
.vscode/
!.vscode/extensions.json
!.vscode/settings.json
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
Desktop.ini

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Diagnostic reports
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# nyc test coverage
.nyc_output/

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test
.env.production

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Rollup.js default build output
dist/

# Uncomment the public line in if your project uses Gatsby and not Next.js
# public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Project specific
# Keep these files in version control but ignore user-specific versions
!.vscode/settings.json.template
!.vscode/launch.json.template

# Lighthouse reports
lighthouse-results/

# Build outputs
*.min.js
*.min.css
dist/
build/

# Testing outputs
coverage/
test-results/

# Local development
.local/
.cache/

# Backup files
*.bak
*.backup
*.orig

# Documentation builds
docs/_build/
docs/.doctrees/

# Python (if using Python tools)
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
env.bak/
venv.bak/

# Project specific ignores
# Ignore minified versions (we'll generate them in CI)
**/ultimate_hyperfocus_constellation.min.js
**/style.min.css

# Keep these files
!README.md
!LICENSE
!CONTRIBUTING.md
!CODE_OF_CONDUCT.md
!package.json
!index.html
!ultimate_hyperfocus_constellation.js
!assets/
!docs/
!.github/
'''

# Create SECURITY.md
security_md = '''# 🔒 Security Policy

## **Supported Versions**

We actively support the following versions with security updates:

| Version | Supported          | Notes                    |
| ------- | ------------------ | ------------------------ |
| 1.0.x   | ✅ Yes             | Current stable release   |
| 0.9.x   | ⚠️ Limited         | Security fixes only      |
| < 0.9   | ❌ No              | Please upgrade           |

## **Security Standards**

### **🔐 Client-Side Security**
- **CSP Headers**: Content Security Policy implemented
- **XSS Prevention**: Input sanitization and validation
- **HTTPS Only**: Secure connections required in production
- **No Inline Scripts**: External script files only
- **Safe API Calls**: GitHub API calls with proper rate limiting

### **♿ Accessibility Security**
- **Screen Reader Safe**: No malicious screen reader content
- **Keyboard Navigation**: Secure keyboard event handling  
- **Focus Management**: Safe focus trap implementations
- **ARIA Security**: Proper ARIA usage without information leakage

### **🧠 Privacy Protection**
- **Local Storage**: Minimal data stored locally (preferences only)
- **No Tracking**: No third-party analytics or tracking
- **Data Minimization**: Only necessary data collected
- **User Control**: Users can clear all stored data

## **Reporting a Vulnerability**

We take security vulnerabilities seriously. Please help us keep the Ultimate Hyperfocus Constellation safe for all users.

### **📧 How to Report**

**For security issues, please contact:**
- **Email**: security@hyperfocus-constellation.dev
- **PGP Key**: [Available on request]
- **Response Time**: Within 48 hours

**Please include:**
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested fix (if known)

### **⚠️ Do NOT report security issues via:**
- Public GitHub issues
- Social media
- Community forums
- Public discussions

### **🕒 Response Timeline**

| Timeframe | Action |
|-----------|--------|
| **0-48 hours** | Initial response acknowledging receipt |
| **48-96 hours** | Preliminary assessment and triage |
| **1-2 weeks** | Detailed investigation and fix development |
| **2-4 weeks** | Testing, validation, and release preparation |

### **🏆 Security Disclosure Process**

1. **Report received** and acknowledged
2. **Investigation** by security team
3. **Fix developed** and tested
4. **Coordinated disclosure** with reporter
5. **Public release** with security advisory
6. **Credit given** to reporter (unless anonymity requested)

## **Security Features**

### **🛡️ Built-in Protections**
- **Input Validation**: All user inputs sanitized
- **CSP Headers**: Prevent XSS and code injection
- **HTTPS Enforcement**: Secure connections only
- **Safe API Usage**: Rate-limited GitHub API calls
- **No External Dependencies**: Minimal third-party code

### **🔒 Privacy by Design**
- **Local Processing**: All data processing happens client-side
- **No Server Storage**: No personal data stored on servers
- **User Control**: Complete control over personal data
- **Transparency**: Open source for full audit capability

### **♿ Accessibility Security**
- **Safe Screen Reader Content**: No malicious announcements
- **Secure Keyboard Handling**: Proper event management
- **Focus Security**: Safe focus management without data leakage
- **ARIA Safety**: Secure ARIA implementation

## **Best Practices for Contributors**

### **🔐 Code Security**
- **Validate all inputs** from users and APIs
- **Sanitize HTML content** before inserting into DOM  
- **Use parameterized queries** for any data operations
- **Avoid `eval()` and similar** dynamic code execution
- **Implement proper error handling** without information leakage

### **🔍 Testing Requirements**
- **Security testing** for all new features
- **Input validation testing** with edge cases
- **XSS prevention testing** for user content
- **Accessibility security testing** for screen readers
- **Performance testing** to prevent DoS vulnerabilities

### **📚 Security Resources**
- **[OWASP Top 10](https://owasp.org/www-project-top-ten/)**
- **[Web Security Guidelines](https://developer.mozilla.org/en-US/docs/Web/Security)**
- **[Content Security Policy](https://content-security-policy.com/)**
- **[Accessibility Security](https://www.w3.org/WAI/security/)**

## **Vulnerability Categories**

### **🚨 High Priority**
- **Code injection** (XSS, script injection)
- **Authentication bypass** (if applicable)
- **Data exposure** (personal information leakage)
- **Accessibility attacks** (screen reader exploitation)

### **⚠️ Medium Priority**
- **CSRF vulnerabilities** in form submissions
- **Privacy violations** in data handling
- **DoS vulnerabilities** in performance
- **Social engineering** vectors

### **📋 Low Priority**
- **Information disclosure** (non-sensitive)
- **UI spoofing** opportunities
- **Rate limiting** bypasses
- **Minor privacy concerns**

## **Security Updates**

### **🔄 Update Policy**
- **Critical vulnerabilities**: Immediate patch release
- **High vulnerabilities**: Within 7 days
- **Medium vulnerabilities**: Next minor release
- **Low vulnerabilities**: Next major release

### **📢 Notification Channels**
- **GitHub Security Advisories**: Primary notification method
- **Release Notes**: Security fixes documented
- **Email Notifications**: For registered users (coming soon)
- **Social Media**: Major security updates announced

## **Compliance**

### **🏛️ Standards Adherence**
- **OWASP**: Following OWASP security guidelines
- **W3C**: W3C security recommendations for web applications
- **WCAG**: Accessibility guidelines include security considerations
- **ISO 27001**: Security management best practices

### **♿ Accessibility Compliance**
- **WCAG 2.1 AA**: Accessibility standards with security
- **Section 508**: U.S. federal accessibility requirements
- **EN 301 549**: European accessibility standards
- **AODA**: Accessibility for Ontarians with Disabilities Act

## **Contact Information**

### **🛡️ Security Team**
- **Lead**: Lyndz Williams
- **Email**: security@hyperfocus-constellation.dev
- **Response**: Within 48 hours guaranteed

### **🤝 Community Security**
- **GitHub Discussions**: General security discussions
- **Documentation**: Security best practices
- **Training**: Community security education

---

## **Recognition**

### **🏆 Hall of Fame**
We maintain a security researchers Hall of Fame for contributors who help keep our community safe:

*[Coming soon - first security researcher contributions welcome!]*

### **💝 Responsible Disclosure**
We believe in responsible disclosure and will:
- **Credit researchers** publicly (unless anonymity requested)
- **Provide detailed feedback** on security reports
- **Share lessons learned** with the community (when appropriate)
- **Contribute back** to the security research community

---

**Thank you for helping keep the Ultimate Hyperfocus Constellation secure for all neurodivergent developers!** 🌟

*Last updated: September 2025*
*Next review: December 2025*
'''

# Create FUNDING.yml
funding_yml = '''# 💝 Funding Configuration for Ultimate Hyperfocus Constellation

github: [welshDog]
patreon: welshdog-hyperfocus
open_collective: hyperfocus-constellation
ko_fi: welshdog
tidelift: "npm/ultimate-hyperfocus-constellation"
community_bridge: # Replace with a single Community Bridge project-name e.g., cloud-foundry
liberapay: welshdog
issuehunt: # Replace with a single IssueHunt username
otechie: # Replace with a single Otechie username
lfx_crowdfunding: # Replace with a single LFX Crowdfunding project-name e.g., cloud-foundry
custom: ['https://paypal.me/welshdog', 'https://buymeacoffee.com/welshdog']
'''

# Save all remaining files
remaining_files = {
    '.github/PULL_REQUEST_TEMPLATE.md': pr_template,
    '.gitignore': gitignore_content,
    'SECURITY.md': security_md,
    '.github/FUNDING.yml': funding_yml
}

for filename, content in remaining_files.items():
    # Create directory if it doesn't exist
    dirname = os.path.dirname(filename)
    if dirname:
        os.makedirs(dirname, exist_ok=True)
    
    with open(filename, 'w') as f:
        f.write(content)

print("✅ Final repository configuration files created!")
print("\n📁 Additional Files:")
for filename in remaining_files.keys():
    print(f"   📄 {filename}")

print(f"\n🏆 Complete Repository Package Status:")
print(f"   ✅ Professional documentation (README, CONTRIBUTING, etc.)")
print(f"   ✅ GitHub workflows and automation")
print(f"   ✅ Issue templates for all scenarios")
print(f"   ✅ Security policy and vulnerability reporting")
print(f"   ✅ Funding configuration for sustainability")
print(f"   ✅ Comprehensive .gitignore")
print(f"   ✅ Pull request template")
print(f"   🌟 READY FOR WORLD-CLASS GITHUB DEPLOYMENT!")