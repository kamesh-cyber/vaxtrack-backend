function addActiveStatus(drives) {
    const currentDate = new Date();
    
    if (!Array.isArray(drives)) {
      if (drives) {
        const driveDate = new Date(drives.scheduled_date);
        return {
          ...drives,
          active: driveDate >= currentDate
        };
      }
      return drives; 
    }
    
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