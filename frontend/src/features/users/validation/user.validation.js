/**
 * Production-Grade User Form Validation Module
 */

export const validateUserForm = (formData, isEditing = false) => {
  const { name, email, phone, dateOfBirth, roleName, department, username, password, confirmPassword } = formData;
  const errors = {};

  // 1. Full Name: Required, min 2 chars, letters & spaces only
  const trimmedName = (name || "").trim();
  if (!trimmedName) {
    errors.name = "Full Name is required.";
  } else if (trimmedName.length < 2) {
    errors.name = "Minimum 2 characters required.";
  } else if (!/^[a-zA-Z\s.-]+$/.test(trimmedName)) {
    errors.name = "Numbers & special characters are not allowed.";
  }

  // 2. Email Address: Required, valid format
  const trimmedEmail = (email || "").trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail) {
    errors.email = "Email Address is required.";
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address.";
  }

  // 3. Phone Number: Required, 7-15 digits
  const rawDigits = (phone || "").replace(/\D/g, "");
  if (!phone || !phone.trim()) {
    errors.phone = "Phone Number is required.";
  } else if (rawDigits.length < 7 || rawDigits.length > 15) {
    errors.phone = "Valid numeric length required (7-15 digits).";
  }

  // 4. Date of Birth: Valid date, future date rejected
  if (dateOfBirth) {
    const dobDate = new Date(dateOfBirth);
    const today = new Date();
    if (dobDate > today) {
      errors.dateOfBirth = "Future dates are not allowed.";
    }
  }

  // 5. Role: Required
  if (!roleName || roleName.trim() === "" || roleName === "Select role") {
    errors.roleName = "Role is required.";
  }

  // 6. Department: Required for Doctor role
  const isDoctor = (roleName || "").toUpperCase() === "DOCTOR";
  if (isDoctor && (!department || department.trim() === "" || department === "Select department")) {
    errors.department = "Department is required for Doctor role.";
  }

  // 7. Username: Required, min 3 chars
  const trimmedUser = (username || "").trim();
  if (!trimmedUser) {
    errors.username = "Username is required.";
  } else if (trimmedUser.length < 3) {
    errors.username = "Username must be at least 3 characters.";
  }

  // 8. Password & Confirm Password (for new user)
  if (!isEditing) {
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Minimum 8 characters required.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
