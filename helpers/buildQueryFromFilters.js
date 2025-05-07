
const buildQueryFromFilters = (filters) => {
    const query = {
        where: {}
    };

    if (filters.class) {
        query.where.class = parseInt(filters.class);
    }

    if (filters.vaccinationStatus) {
        query.where.vaccinations = {$exists: filters.vaccinationStatus}
    }
    if (filters.vaccineName) {
        query.where.vaccinations = {$elemMatch: {vaccineName:filters.vaccineName}}
    }
    console.log("Query:", query);
    return query;
}

module.exports = {buildQueryFromFilters};