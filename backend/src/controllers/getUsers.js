import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({}).select('-password');
    
    // Decrypt sensitive data for each user
    const decryptedUsers = users.map(user => user.decryptUserData());
    
    res.status(200).json({
      success: true,
      count: decryptedUsers.length,
      data: decryptedUsers
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query, district, minAge, maxAge } = req.query;
    
    // Build filter object
    let filter = {};
    
    if (district) {
      // Since district is encrypted, we'll need to search differently
      // For now, we'll fetch all and filter in memory
      // In production, consider using encrypted search or separate search fields
    }
    
    // Fetch users with basic filters
    let users = await User.find(filter).select('-password');
    
    // Apply additional filters in memory for encrypted fields
    let filteredUsers = users;
    
    if (query) {
      filteredUsers = filteredUsers.filter(user => {
        const decryptedUser = user.decryptUserData();
        return (
          decryptedUser.username.toLowerCase().includes(query.toLowerCase()) ||
          decryptedUser.email.toLowerCase().includes(query.toLowerCase()) ||
          decryptedUser.district.toLowerCase().includes(query.toLowerCase()) ||
          decryptedUser.mobileNumber.includes(query)
        );
      });
    }
    
    if (district) {
      filteredUsers = filteredUsers.filter(user => {
        const decryptedUser = user.decryptUserData();
        return decryptedUser.district.toLowerCase().includes(district.toLowerCase());
      });
    }
    
    if (minAge || maxAge) {
      filteredUsers = filteredUsers.filter(user => {
        const age = calculateAge(user.birthdate);
        if (minAge && maxAge) {
          return age >= parseInt(minAge) && age <= parseInt(maxAge);
        } else if (minAge) {
          return age >= parseInt(minAge);
        } else if (maxAge) {
          return age <= parseInt(maxAge);
        }
        return true;
      });
    }
    
    // Decrypt all filtered users
    const decryptedUsers = filteredUsers.map(user => user.decryptUserData());
    
    res.status(200).json({
      success: true,
      count: decryptedUsers.length,
      data: decryptedUsers
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search users",
      error: error.message
    });
  }
};

// Helper function to calculate age
const calculateAge = (birthdate) => {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
