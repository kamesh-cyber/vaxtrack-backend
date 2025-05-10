const { getDashboardOverviewService } = require('../services/DashboardService.js');

async function getDashboardOverview(req,resp) {
    try {
        console.log('In Dashboard Controller');
        const response = await getDashboardOverviewService(req);
        resp.status(200).send(response);
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }

}

module.exports={getDashboardOverview}