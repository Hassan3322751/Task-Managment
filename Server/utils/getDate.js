exports.getCurrentDate = () => {
    const date = new Date();
    
    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Adds leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    
    // Format as dd/mm/yy
    return `${day}/${month}/${year}`;
  };