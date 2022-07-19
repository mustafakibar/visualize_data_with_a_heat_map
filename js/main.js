/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import * as d3 from 'd3';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

(async function renderChart() {
  const data = await d3
    .json(
      'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json'
    )
    .then((d) => {
      d.monthlyVariance.map((i) => {
        i.month = months[i.month - 1];
        return i;
      });

      return d;
    });

  const dataset = data;
  const baseTemp = dataset.baseTemperature;
  const { monthlyVariance } = dataset;

  const width = 1200;
  const height = width * 0.45;
  const margin = {
    top: 30,
    right: 30,
    bottom: 70,
    left: 160,
  };

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.left + margin.bottom)
    .append('g');

  const xScale = d3
    .scaleBand()
    .domain(dataset.monthlyVariance.map(({ year }) => year))
    .range([0, width]);

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
    .call(
      d3
        .axisBottom(xScale)
        .tickValues(xScale.domain().filter((year) => year % 10 === 0))
    )
    .append('text')
    .text('Years')
    .attr('transform', `translate(${width / 2}, ${margin.top * 2})`)
    .attr('fill', 'black');

  const yScale = d3.scaleBand().domain(months).range([0, height]);
  svg
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('id', 'y-axis')
    .call(d3.axisLeft(yScale))
    .append('text')
    .text('Months')
    .attr('transform', `translate(${-45}, ${height / 2}) rotate(-90)`)
    .attr('fill', 'black');

  const colorScale = d3
    .scaleQuantile()
    .domain([
      d3.min(monthlyVariance, (d) => d.variance),
      d3.max(monthlyVariance, (d) => d.variance),
    ])
    .range([
      '#f7fbff',
      '#deebf7',
      '#c6dbef',
      '#9ecae1',
      '#6baed6',
      '#4292c6',
      '#2171b5',
      '#08519c',
      '#08306b',
    ]);

  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip');

  const createTooltipText = (temp, variance) =>
    `Temperature: <b>${temp}</b> - Variance: ${variance}`;

  svg
    .selectAll('rect')
    .data(monthlyVariance)
    .enter()
    .append('rect')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('class', 'cell')
    .attr('data-month', (d) => months.indexOf(d.month))
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => d.variance + baseTemp)
    .attr('width', (d) => xScale.bandwidth(d.year))
    .attr('height', (d) => yScale.bandwidth(d.month))
    .attr('x', (d, _) => xScale(d.year))
    .attr('y', (d, _) => yScale(d.month))
    .style('fill', (d, _i) => colorScale(d.variance))
    .on('mouseover', (event, i) => {
      tooltip.transition().duration(100).style('opacity', 1);
      tooltip
        .html(createTooltipText(parseFloat(i.variance + baseTemp), i.variance))
        .style('left', `${event.pageX + 16}px`)
        .style('top', `${event.pageY}px`)
        .attr('data-year', i.year)
        .attr('data-month', i.month);
    })
    .on('mouseout', (_) =>
      tooltip.transition().duration(150).style('opacity', 0)
    );

  const legendRect = { width: 45, height: 30 };

  const legendSvg = d3
    .select('body')
    .append('div')
    .style('width', `${width}px`)
    .style('height', `${height}px`)
    .append('svg')
    .style('width', `${width * 0.5}px`)
    .style('height', `${height * 0.1}px`)
    .attr('transform', `translate(${margin.left * 0.4}, ${-margin.bottom * 2})`)
    .attr('id', 'legend');

  legendSvg
    .selectAll('.legend')
    .data(colorScale.range())
    .enter()
    .append('rect')
    .attr('width', legendRect.width)
    .attr('height', legendRect.height)
    .attr('x', (_d, i) => legendRect.width * i)
    .attr('y', 36)
    .attr('fill', (_d, i) => colorScale.range()[i]);

  legendSvg
    .selectAll('.legend')
    .data(
      [
        colorScale.quantiles()[0] +
          (colorScale.quantiles()[0] - colorScale.quantiles()[1]),
      ].concat(colorScale.quantiles())
    )
    .enter()
    .append('text')
    .attr('x', (_d, i) => 16 + legendRect.width * i)
    .attr('y', 24)
    .text((d) => `≥${Math.floor(d * 10) / 10}`)
    .style('text-anchor', 'middle');
})();
