import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

interface Country {
    id: number;
    name: string;
    iso3: string;
    iso2: string;
}

interface Region {
    id: number;
    name: string;
    population: number;
}

interface Metrics {
    fcs: {
        people: number;
        prevalence: number;
    };
    rcsi: {
        people: number;
        prevalence: number;
    };
}

export interface SurveyData {
    country: Country;
    region: Region;
    date: string; // Format: YYYY-MM-DD
    dataType: string; // e.g., "SURVEY"
    metrics: Metrics;
    cfii: number;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    basePath = 'https://8t41ym2n38.execute-api.eu-central-1.amazonaws.com/v1';

    constructor(
        private httpClient: HttpClient
    ) {
    }

    /**
     * Fetches food security data for a given country and date range
     */
    async getFoodSecurityData(iso3, date_start, date_end): Promise<SurveyData[]> {
        return await this.httpClient.post(this.basePath + '/foodSecurityData', {
                iso3, date_start, date_end
            }
        ).toPromise()
            .then((res: any) => {
                if (res?.body?.body?.error) {
                    return
                }
                const data = res?.body?.body;
                for (const item of data) {
                    item.cfii = 0.5 * item.metrics.fcs.prevalence + 1.5 * item.metrics.rcsi.prevalence;
                }
                return data;
            });
    }
}
