function checkForSchedulingConflicts(
    existingDrives,
    newDrive
) {
  for (const event of existingDrives) {
      const classes = event.classes;
      const hasOverlap = newDrive.classes.some(classNum => 
        classes.includes(classNum)
      );
      const overlappingClasses = newDrive.classes.filter(classNum => 
        classes.includes(classNum)
      );    
      
      if (hasOverlap) {
        console.log("Drive already exists for ",overlappingClasses);
        return overlappingClasses;
      }
      
}
  return false; // No conflicts
}
module.exports = {checkForSchedulingConflicts}