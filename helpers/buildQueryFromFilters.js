
const buildQueryFromFilters = (filters) => {
    const query = {
        where: {}
    };

    if (filters.class) {
        query.where.class = parseInt(filters.class);
    }

    if (filters.vaccinationStatus) {
        const vaccinationStatus = filters.vaccinationStatus === "true" ? true : false;
        query.where.vaccinations = {$exists: vaccinationStatus}
    }
    if (filters.vaccineName) {
        query.where.vaccinations = {$elemMatch: {vaccineName:filters.vaccineName}}
    }
    console.log("Query:", query);
    return query;
}

module.exports = {buildQueryFromFilters};