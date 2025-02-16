import {Component} from '@angular/core';
import {ApiService, SurveyData} from "../../services/api/api.service";
import {UtilsService} from "../../services/utils/utils.service";
import * as moment from "moment";

declare var Chart;

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.template.html',
    styleUrls: ['./dashboard.style.scss']
})
export class DashboardComponent {
    // Variables for managing dates
    mapDate = moment().subtract(3, 'days').format('YYYY-MM-DD');
    startDate = moment().subtract(3, 'days').format('YYYY-MM-DD');
    endDate = moment().subtract(2, 'days').format('YYYY-MM-DD');
    maxDate = moment().format('YYYY-MM-DD');

    // UI and data management variables
    showOnlyPositive;
    statsCountry = null;
    mapCountry = 'both';
    statsData: SurveyData[];
    regions = [];
    map;
    chartVisible;
    selectedRegion: string | number = -1;
    chartTimeVisible;
    combinedData;

    constructor(
        private apiService: ApiService, // Service for API calls
        public utilsService: UtilsService // Utility service for UI
    ) {
    }

    /**
     * Retrieves statistical data for the selected country and time range
     */
    async getStatsData() {
        if (!this.statsCountry) {
            this.utilsService.showSwalMessage('Missing country', 'Please select a country first.', 'error');
            return;
        }

        // Date validation checks
        if (moment(this.startDate, 'YYYY-MM-DD').isAfter(moment(this.endDate, 'YYYY-MM-DD'))) {
            this.utilsService.showSwalMessage('Invalid dates', 'The starting date must be before the ending date.', 'error');
            return;
        }
        if (moment(this.endDate, 'YYYY-MM-DD').isBefore(moment(this.startDate, 'YYYY-MM-DD'))) {
            this.utilsService.showSwalMessage('Invalid dates', 'The ending date must be after the starting date.', 'error');
            return;
        }
        if (moment(this.endDate, 'YYYY-MM-DD').diff(moment(this.startDate, 'YYYY-MM-DD'), 'days') > 500) {
            this.utilsService.showSwalMessage('Invalid dates', 'The maximum number of days is 500.', 'error');
            return;
        }

        // Reset data and fetch new data
        this.statsData = null;
        this.selectedRegion = -1;
        this.chartVisible = false;
        this.chartTimeVisible = false;
        this.showOnlyPositive = false;
        this.regions = [];

        this.utilsService.loaderActive = true;
        this.statsData = await this.apiService.getFoodSecurityData(this.statsCountry, this.startDate, this.endDate)
            .catch(err => {
                return null;
            });
        this.utilsService.loaderActive = false;
        if (!this.statsData) {
            this.utilsService.showSwalMessage('No data', 'No data found for the given period.', 'warning');
            return
        }
        this.statsData.forEach(item => {
            if (!this.regions.includes(item.region.name)) {
                this.regions.push(item.region.name);
            }
        });

        if (!this.statsData) {
            this.utilsService.showSwalMessage('No data', 'No data found for the given period.', 'warning');
            return
        }

        this.chartVisible = true;
        setTimeout(() => {
            this.drawChart();
            this.drawTimeChart();
        });
    }

    /**
     * Filters the statistical data based on user selection
     */
    getFilteredData() {
        const data = this.statsData?.filter(item => this.showOnlyPositive ? item.cfii > 1 : true);
        if (this.selectedRegion == -1) {
            return data;
        }
        return data?.filter(item => item.region.name == this.selectedRegion);
    }

    /**
     * Retrieves only positive CFII values from the dataset
     */
    getPositiveCFII() {
        return this.statsData?.filter(item => item.cfii > 1);
    }

    /**
     * Fetches CFII values for a specific country or globally if no country is provided
     */
    getPositiveCFIICombinedData(iso3?) {
        if (iso3) {
            return this.combinedData?.filter(item => item.country.iso3 === iso3 && item.cfii > 1);
        }
        return this.combinedData?.filter(item => item.cfii > 1);
    }

    /**
     * Handles map readiness and stores the map reference
     */
    mapReady(event) {
        this.map = event;
    }

    /**
     * Returns the full country name based on its ISO3 code
     */
    getCountryName() {
        switch (this.statsCountry) {
            case 'YEM':
                return 'Yemen';
            case 'SYR':
                return 'Syria';
        }
    }

    /**
     * Draws a time series chart using Chart.js based on the filtered data
     */
    drawTimeSeriesChart() {
        const dates = this.getFilteredData().map(item => item.date);
        const values = this.getFilteredData().map(item => item.cfii.toFixed(2));

        new Chart('myLineChartTimeSeries', {
            type: 'line', // or 'bar', 'radar', etc.
            data: {
                labels: dates,
                datasets: [{
                    label: 'CFII Values',
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    fill: true,
                }],
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            stepSize: 0.05,
                            max: 2,
                            min: 0
                        }
                    }]
                }
            },
        });
    }

    /**
     * Draws a bar chart representing CFII occurrences by region
     */
    drawTimeChart() {
        const allRegions = [];
        const allValues = [];
        this.statsData?.forEach(item => {
            if (!allRegions.includes(item.region.name)) {
                allRegions.push(item.region.name);
            }
        });

        this.statsData?.forEach(item => {
            allValues.push(this.getPositiveCFII()?.filter(a => a.region.name === item.region.name)?.length);
        });

        new Chart('myLineChart', {
            type: 'bar', // or 'bar', 'radar', etc.
            data: {
                labels: allRegions,
                datasets: [{
                    label: 'CFII occurrences',
                    data: allValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    fill: true,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    /**
     * Draws the statistical data chart
     */
    drawChart() {
        new Chart('myPieChart', {
            type: 'pie',
            data: {
                labels: ['CFII > 1', 'CFII <= 1'],
                datasets: [{
                    label: 'CFII Distribution',
                    data: [this.getPositiveCFII()?.length, this.statsData?.length - this.getPositiveCFII()?.length],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 99, 132, 0.6)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'CFII Distribution'
                    }
                }
            }
        });
    }

    /**
     * Clears all stored statistics and UI data.
     */
    clearData() {
        this.statsData = null;
        this.selectedRegion = -1;
        this.chartVisible = false;
        this.showOnlyPositive = false;
        this.chartTimeVisible = false;
        this.statsCountry = null;
    }

    /**
     * Calculates the difference in days between the selected start and end dates
     */
    getDiffDates() {
        return moment(this.endDate, 'YYYY-MM-DD').diff(moment(this.startDate, 'YYYY-MM-DD'), 'days');
    }

    /**
     * Retrieves the total number of days where CFII was greater than 1
     */
    getTotalCFIIDays() {
        const dates = new Set();
        for (let i = 0; i < this.statsData.length; i++) {
            const item = this.statsData[i];
            if (item.cfii > 1) {
                dates.add(item.date);
            }
        }
        return dates.size;
    }

    /**
     * Handles region selection changes and updates the chart accordingly
     */
    regionSelected() {
        setTimeout(() => {
            console.log(this.selectedRegion)
            if (this.selectedRegion == -1) {
                this.chartTimeVisible = false;
                return;
            } else {
                this.chartTimeVisible = true;
            }
            setTimeout(() => {
                this.drawTimeSeriesChart();
            }, 100);
        }, 100);
    }

    /**
     * Fetches map data for a given date and updates the visualization
     */
    async getMapData(date) {
        console.log('getMapData', date);
        this.utilsService.loaderActive = true;
        let allData: SurveyData[] = [];
        if (this.mapCountry === 'both') {
            const data = await Promise.all([
                this.apiService.getFoodSecurityData('SYR', moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD'))
                    .catch(err => {
                        return null;
                    }),
                this.apiService.getFoodSecurityData('YEM', moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD'))
                    .catch(err => {
                        return null;
                    })
            ]);
            console.log('asdasasdasd', data);
            allData = (data[0] || []).concat(data[1] || []);
        } else {
            allData = await this.apiService.getFoodSecurityData(this.mapCountry, moment(date).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD'))
                .catch(err => {
                    return null;
                });
        }
        this.combinedData = allData;

        this.utilsService.loaderActive = false;
        if (!allData?.length) {
            this.utilsService.showSwalMessage('No data', 'No data found for ' + this.mapDate + '.', 'warning');
            this.map.cleanMapLayers();
            return
        }

        if (this.mapCountry === 'both') {
            await this.map.setPositiveCFII(null, this.getPositiveCFII(), allData);
        } else {
            await this.map.setPositiveCFII(this.statsCountry, this.getPositiveCFIICombinedData(), allData);
        }
    }

    /**
     * Clears all stored map data
     */
    clearMapData() {
        this.combinedData = null;
        this.map.cleanMapLayers();
    }

    /**
     * Handles country selection changes for the map
     */
    mapCountryChanged(event) {
        this.mapCountry = event;
        this.map.flyToCountry(event);
    }

    /**
     * Exports data in Excel format
     */
    exportData() {
        if (this.mapCountry === 'both') {
            this.utilsService.exportAsExcelFile(this.getFilteredCombinedData('YEM'), this.getFilteredCombinedData('SYR'), 'export_syr_yem_' + this.mapDate);
        } else {
            switch (this.mapCountry) {
                case 'SYR':
                    this.utilsService.exportAsExcelFile(null, this.getFilteredCombinedData('SYR'), 'export_syr_' + this.mapDate);
                    break;
                case 'YEM':
                    this.utilsService.exportAsExcelFile(this.getFilteredCombinedData('YEM'), null, 'export_yem_' + this.mapDate);
                    break;
            }
        }
    }

    /**
     * Filters the map data based on user selection
     */
    getFilteredCombinedData(iso3) {
        return this.combinedData?.filter(item => item.country.iso3 === iso3);
    }
}
