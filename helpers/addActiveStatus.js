/**
 * Helper function to add active status to vaccination drives
 * Works with both single drives and arrays of drives
 */
function addActiveStatus(drives) {
    const currentDate = new Date();
    
    // If it's a single object (not in an array)
    if (!Array.isArray(drives)) {
      if (drives) {
        const driveDate = new Date(drives.scheduled_date);
        return {
          ...drives,
          active: driveDate >= currentDate
        };
      }
      return drives; // Return as is if null/undefined
    }
    
    // For arrays of drives
    return drives.map(drive => {
      const driveDate = new Date(drive.scheduled_date);
      return {
        ...drive,
        active: driveDate >= currentDate
      };
    });
  }

module.exports = {
    addActiveStatus
}