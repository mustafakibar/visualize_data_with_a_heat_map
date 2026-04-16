# FCC Data Visualization — Global Temperature Heat Map

D3 heat map of monthly global land-surface temperature anomalies, built for the FreeCodeCamp Data Visualization certification.

## Features

- SVG heat map grid with years on the x-axis (1753–2015) and months on the y-axis
- Quantile color scale using 9 hardcoded blue shades mapping temperature variance to cell fill
- X-axis labeled every 10 years; y-axis labeled with full month names
- Hover tooltip showing absolute temperature and variance for each cell
- Color legend with quantile boundary labels rendered below the main chart

## Tech Stack

- Vanilla JavaScript
- [D3.js](https://d3js.org/)
- Parcel (bundler)
- HTML / CSS

## Requirements

- Node.js 16+ (Parcel requires it)
- npm 8+

## Installation

```bash
npm install
```

## Usage

```bash
npm run dev
```

Open `http://localhost:1234` in a browser. The default Parcel port is `1234`.

## Data Source

- `https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json`

## Project Structure

```
.
├── css/
├── js/
├── index.html
└── package.json
```

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file.
