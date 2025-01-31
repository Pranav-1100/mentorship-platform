export const useFormValidation = (step, formData) => {
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };
  
    const validatePassword = (password) => {
      return password.length >= 6;
    };
  
    const validateBasicInfo = () => {
      const required = ['full_name', 'current_position', 'location_city', 'location_country', 'bio'];
      return required.every(field => formData[field]?.trim());
    };
  
    const validateSkills = () => {
      return formData.skills.length > 0 && formData.skills.every(skill => skill.trim());
    };
  
    switch (step) {
      case 0: // Account
        return {
          isValid: validateEmail(formData.email) && validatePassword(formData.password),
          errors: {
            email: !validateEmail(formData.email) && 'Please enter a valid email',
            password: !validatePassword(formData.password) && 'Password must be at least 6 characters'
          }
        };
      case 1: // Role
        return {
          isValid: !!formData.role,
          errors: {
            role: !formData.role && 'Please select a role'
          }
        };
      case 2: // Basic Info
        return {
          isValid: validateBasicInfo(),
          errors: {
            basic: !validateBasicInfo() && 'Please fill in all required fields'
          }
        };
      case 3: // Skills
        return {
          isValid: validateSkills(),
          errors: {
            skills: !validateSkills() && 'Please add at least one skill'
          }
        };
      case 4: // Additional
        return { isValid: true, errors: {} }; // Additional info is optional
      default:
        return { isValid: false, errors: {} };
    }
  };
  