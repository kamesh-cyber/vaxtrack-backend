function generateRollNumber(grade) {
    const prefix = grade< 10 ? "0" + grade : grade;
    console.log("Prefix: ", prefix);
    const rollNumber = Math.floor(1000 + Math.random() * 9000);
    return prefix +""+ rollNumber;

}
module.exports = {
    generateRollNumber
}