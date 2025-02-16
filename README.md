# Food Security Monitoring Platform

<p align="center">
  <img src="https://github.com/user-attachments/assets/e967aa56-f424-4394-898d-adf8cd27f3db" alt="logo" width="300"/> <!-- Adjust width as needed -->
</p>

## Index
- [Introduction](#introduction)
- [Technical Details](#technical-details)
- [How to Use the Dashboard](#how-to-use-the-dashboard)
- [How to Run the Project Locally](#how-to-run-the-project-locally)
- [Personal notes](#personal-notes)

## Introduction
The project aims to build a Minimum Viable Product (MVP) of a food security monitoring platform that will facilitate the validation of a composite indicator, the Composite Food Insecurity Index (CFII). This index is derived from two widely used indicators: the Food Consumption Score (FCS) and the Reduced Coping Strategy Index (rCSI).

Food security analysts are tasked with monitoring food security levels in Yemen and Syria. This project involves creating a web dashboard that allows users to visualize food security data and statistics.

## Technical Details
The project is built using Angular framework version 14.

### System Architecture Diagram
<p align="center">
  <img src="https://github.com/user-attachments/assets/b6ef42f2-63db-44d8-b99f-770996970070" alt="logo" style="width: 80%"/>
</p>

### Data Retrieval
An API call to obtain the data displayed on the dashboard has been deployed using AWS Lambda Function. By using an AWS API Gateway trigger connected to the Lambda Function, we can fetch the necessary data for visualization on the dashboard.

**Swagger documentation**: `https://d3uylfhvn5dmm1.cloudfront.net/index.html`

The endpoint to retrieve the data is as follows:
- **POST** - `https://8t41ym2n38.execute-api.eu-central-1.amazonaws.com/v1/foodSecurityData`
  
**Example Request Body:**
```json
{
  "iso3": "SYR",
  "date_start": "2025-02-13",
  "date_end": "2025-02-13"
}
```
**Example Response:**
```json
{
  "statusCode": 200,
  "body": {
    "statusCode": "200",
    "body": [
      {
        "country": {
          "id": 238,
          "name": "Syrian Arab Republic",
          "iso3": "SYR",
          "iso2": "SY"
        },
        "region": {
          "id": 900218,
          "name": "Al-Hasakeh",
          "population": 1033316
        },
        "date": "2025-02-13",
        "dataType": "SURVEY",
        "metrics": {
          "fcs": {
            "people": 231969,
            "prevalence": 0.2244898946692009
          },
          "rcsi": {
            "people": 681848,
            "prevalence": 0.6598639719117869
          },
          "marketAccess": {
            "people": 794318,
            "prevalence": 0.7687069644550111
          },
          "livelihoodCoping": {
            "people": 618582,
            "prevalence": 0.5986380829205729
          }
        }
      }
    ]
  }
}
```

No Authentication is required.

### Dashboard Hosting
The Angular dashboard is hosted on AWS S3 and distributed via CloudFront.

### Access the Dashboard
You can access the public dashboard at the following URL: [Food Security Monitoring Dashboard](https://d21h382dud9b2d.cloudfront.net).

## How to Use the Dashboard
The dashboard is primarily composed of two sections:

1. **Daily Food Security Overview**: 
  - This section allows users to select a country and a date using a dropdown menu. The dashboard will display the food security status for the selected day.
  - Users can choose between Yemen, Syria, or both countries.
  - The map will highlight regions with a CFII coefficient greater than 1 in red, indicating areas of concern, while regions with a CFII coefficient of 1 or less will be shown in green.
  - Next to the map, there is a table that filters and displays only the regions marked in red.
  <img width="1424" alt="Screenshot 2025-02-16 alle 12 17 46" src="https://github.com/user-attachments/assets/5a2c1edc-c97c-40ec-a155-42d232236c95" />
  - Users have the option to export the displayed data in Excel format for further analysis.
  <img width="702" alt="Screenshot 2025-02-16 alle 12 19 38" src="https://github.com/user-attachments/assets/98bf4cc2-9aa6-4959-9d66-6e8f769f1314" />

2. **Detailed Food Security Statistics**:
  - Users must select a country (Yemen or Syria) and a range of dates (starting and ending).
  - The dashboard will then display the following statistical data:
    - The number of occurrences of CFII values greater than 1.
    - The number of occurrences of CFII values less than or equal to 1.
    - A pie chart showing the distribution of CFII values in the selected period.
    - A bar chart representing occurrences of data with CFII > 1 during the selected period.
    - A comprehensive table showing all recorded data, including region, date, FCS, RCSI, and the calculated CFII value (highlighted in red if > 1).
  - Filtering the table by region will display a **time series** for only that region via a line chart.
  <img width="1304" alt="Screenshot 2025-02-16 alle 12 26 24" src="https://github.com/user-attachments/assets/9962011a-2374-491e-afd9-a03e9715d9fc" />


## How to Run the Project Locally
1. **Clone the Repository**: Clone the project repository to your local machine.
  ```bash
  git clone https://github.com/johnnywfp/WFP-food-security-dashboard.git
  ```
2. **Install NPM Dependencies**
  ```bash
  npm i --legacy-peer-deps
  ```
3. **Run the project**: Start the development server.
  ```bash
  ng serve --configuration=development
  ```
4. **Access Locally**: Open your browser and navigate to http://localhost:3000 to view the project.

## Personal Notes
- Regarding the geographical boundaries, I used the provided endpoint to retrieve the administrative boundaries of the countries. Specifically, I made a GET call to the [GeoAPI](https://api.vam.wfp.org/geodata/GetGeoAdmins?adm0={adm0}&admcode={adm0}), using the `adm0` to obtain all the regions of Yemen and Syria. After retrieving this information, I decided to save the data in a static file within the project, since this is static data that does not change over time.
The data has been saved in the file [src/app/extras/geoJSON.ts](src/app/extras/geoJSON.ts).
- I have noticed that the data for the current day is never available. However, the data for the previous day becomes available starting from 3:00 PM. To avoid displaying an alert for "data not found", I have chosen to set the initial date to two days prior to the date when the user accesses the dashboard.
