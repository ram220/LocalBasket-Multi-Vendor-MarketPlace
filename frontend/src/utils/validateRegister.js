// validation.js (create a new helper file)
export const validateRegister = ({ name, email, password, address, mobile }) => {
  const errors = {};

  // Name
  if (!name || name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  // Password
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // Mobile
  const mobileRegex = /^[0-9]{10}$/; // Only 10 digits
  if (!mobile) {
    errors.mobile = "Mobile number is required";
  } else if (!mobileRegex.test(mobile)) {
    errors.mobile = "Invalid mobile number (10 digits required)";
  }

  // Address
  if (!address || address.trim().length < 5) {
    errors.address = "Address is required";
  }

  return errors;
};