const validateLogin = (req, res, next) => {
    const { code, user } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: "Missing required parameter: code" });
    }
    
    if (!user) {
      return res.status(400).json({ error: "Missing required parameter: user" });
    }
    
    next();
  };
  
  const validateInsertStudent = (req, res, next) => {
    const { name, age, class: studentClass, gender, dateOfBirth } = req.body;
    const errors = [];
    
    if (!name) errors.push("Missing required field: name");
    if (name && typeof name !== 'string') errors.push("Invalid data type: name must be a string");
    
    if (!age) errors.push("Missing required field: age");
    if (age && (isNaN(age) || !Number.isInteger(Number(age)))) {
      errors.push("Invalid data type: age must be an integer");
    } else if (age && (age < 3 || age > 18)) {
      errors.push("Invalid age: must be between 3 and 18");
    }
    
    if (!studentClass) errors.push("Missing required field: class");
    if (studentClass && (isNaN(studentClass) || !Number.isInteger(Number(studentClass)))) {
      errors.push("Invalid data type: class must be an integer");
    } else if (studentClass && (studentClass < 1 || studentClass > 12)) {
      errors.push("Invalid class: must be between 1 and 12");
    }
    
    if (!gender) errors.push("Missing required field: gender");
    if (gender && !['male', 'female'].includes(gender.toLowerCase())) {
      errors.push("Invalid gender: must be 'male', 'female'");
    }
    
    if (!dateOfBirth) errors.push("Missing required field: dateOfBirth");
    if (dateOfBirth && !/^\d{2}-\d{2}-\d{4}$/.test(dateOfBirth)) {
      errors.push("Invalid date format: dateOfBirth must be in DD-MM-YYYY format");
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    next();
  };
  
  const validateStudentId = (req, res, next) => {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: "Missing student ID" });
    }
    
    // Validate that ID matches the expected format (e.g., numeric ID with length 6)
    if (!/^\d{6}$/.test(id)) {
      return res.status(400).json({ error: "Invalid student ID format: must be a 6-digit number" });
    }
    
    next();
  };
  
  const validateUpdateVaccinationStatus = (req, res, next) => {
    const { id } = req.params;
    const {vaccineName ,vaccinatedOn} = req.body;
    console.log("req.body",req.body)
    const errors = [];
    if(!id) {
        return res.status(400).json({ error: "Missing student ID" });
    }
    if (!/^\d{6}$/.test(id)) {
      errors.push("Invalid student ID format: must be a 6-digit number");
    }
    
    if (!vaccineName) errors.push("Missing required field: vaccineName");
    if (vaccineName && typeof vaccineName !== 'string') {
      errors.push("Invalid data type: vaccineName must be a string");
    }

    if(!vaccinatedOn) errors.push("Missing required field: scheduledDate");
    if (vaccinatedOn && typeof vaccinatedOn !== 'string') {
      errors.push("Invalid data type: scheduledDate must be a string");
    }
    if (vaccinatedOn && !/^\d{2}-\d{2}-\d{4}$/.test(vaccinatedOn)) {
      errors.push("Invalid date format: scheduledDate must be in DD-MM-YYYY format");
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    next();
  };
  
  const validateBulkInsertFile = (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: "Missing required file" });
    }
    
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    if (fileExtension !== 'csv') {
      return res.status(400).json({ error: "Invalid file format: only CSV files are allowed" });
    }
    
    next();
  };
  
  const validateVaccinationDrive = (req, res, next) => {
    const { name, scheduled_date,available_doses,classes } = req.body;
    const errors = [];
    
    if (!name) errors.push("Missing required field: name");
    if(!available_doses) errors.push("Missing required field: available_doses");
    if(!classes) errors.push("Missing required field: classes");
    if (available_doses && (isNaN(available_doses) || !Number.isInteger(Number(available_doses)))) {
        errors.push("Invalid data type: available_doses must be an integer");
    }
    if(classes && !Array.isArray(classes)){
        errors.push("Invalid data type: classes must be an array");
    }
    if (name && typeof name !== 'string') errors.push("Invalid data type: name must be a string");
    
    if (!scheduled_date) errors.push("Missing required field: scheduled_date");
    if (scheduled_date) {
      try {
        const scheduledDate = new Date(scheduled_date);
        if (isNaN(scheduledDate.getTime())) {
          errors.push("Invalid data type: date must be a valid date");
        }
        else{
            const today =  new Date();
            let minimumDate = new Date()
            minimumDate.setDate(today.getDate() + 15);
            if(scheduledDate < minimumDate){
                errors.push("Invalid date: must be at least 15 days from today");
            }
        }
      } catch (e) {
        errors.push("Invalid data type: date must be a valid date");
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    next();
  };
  const validateUpdateVaccinationDrive = (req, res, next) => {
      const { id } = req.params;
      if (!id) {
          return res.status(400).json({ error: "Missing vaccination drive ID" });
      }
      const {scheduled_date,available_doses} = req.body;
      const errors = [];
      if(!scheduled_date && !available_doses){
          return res.status(400).json({ error: "Vaccination Update Data required any one field: scheduled_date,available_doses" });
      }
      if (scheduled_date) {
        try {
          const scheduledDate = new Date(scheduled_date);
          if (isNaN(scheduledDate.getTime())) {
            errors.push("Invalid data type: date must be a valid date");
          }
          else{
              const today =  new Date();
              let minimumDate = new Date()
              minimumDate.setDate(today.getDate() + 15);
              if(scheduledDate < minimumDate){
                  errors.push("Invalid date: must be at least 15 days from today");
              }
          }
        } catch (e) {
          errors.push("Invalid data type: date must be a valid date");
        }
      }
      if (available_doses && (isNaN(available_doses) || !Number.isInteger(Number(available_doses)))) {
          errors.push("Invalid data type: available_doses must be an integer");
      }
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      next();
  }

  function validateGetAllStudents(req, res, next) {
    const { class: studentClass, name, vaccinationStatus } = req.query;
    const errors = [];
    
    if (studentClass && (isNaN(studentClass) || !Number.isInteger(Number(studentClass)))) {
      errors.push("Invalid data type: class must be an integer");
    } else if (studentClass && (studentClass < 1 || studentClass > 12)) {
      errors.push("Invalid class: must be between 1 and 12");
    }
    
    if (name && typeof name !== 'string') {
      errors.push("Invalid data type: name must be a string");
    }
    
    if (vaccinationStatus && !['true', 'false'].includes(vaccinationStatus.toLowerCase())) {
      errors.push("Invalid vaccination status: must be 'true' or 'false'");
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    next();
  }
  module.exports = {
    validateLogin,
    validateInsertStudent,
    validateStudentId,
    validateUpdateVaccinationStatus,
    validateBulkInsertFile,
    validateVaccinationDrive,
    validateGetAllStudents
  };