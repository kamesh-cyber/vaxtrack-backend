function checkForDuplicateVaccinations(student, updateBody) {
    if(!student.vaccinations) {
        return false;
    }
    if(student.vaccinations.length>0){
        for (let i = 0; i < student.vaccinations.length; i++) {
            const vaccination = student.vaccinations[i];
            if (vaccination.vaccineName === updateBody.vaccinations.vaccineName) {
                return true;
            }
        }
    }
    return false;
}

module.exports = {
    checkForDuplicateVaccinations
}