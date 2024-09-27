import React, { useEffect } from 'react';
import * as d3 from 'd3';
import '../css/Reports.css'; // Custom CSS file for styling

function Reports() {
  useEffect(() => {
    // Payments Bar Chart - Color to Red
    const paymentsData = [3000, 3200, 2500, 4500, 5000, 4100, 3700];
    const svgPayments = d3.select('#paymentsChart')
      .attr('width', 600)
      .attr('height', 400);

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svgPayments.attr('width') - margin.left - margin.right;
    const height = +svgPayments.attr('height') - margin.top - margin.bottom;

    const xPayments = d3.scaleBand()
      .domain(['January', 'February', 'March', 'April', 'May', 'June', 'July'])
      .range([0, width])
      .padding(0.1);

    const yPayments = d3.scaleLinear()
      .domain([0, 5000])
      .range([height, 0]);

    const chartPayments = svgPayments.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    chartPayments.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xPayments));

    chartPayments.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yPayments));

    chartPayments.selectAll('.bar')
      .data(paymentsData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xPayments(['January', 'February', 'March', 'April', 'May', 'June', 'July'][i]))
      .attr('y', d => yPayments(d))
      .attr('width', xPayments.bandwidth())
      .attr('height', d => height - yPayments(d))
      .attr('fill', '#dc3545'); // Set bar color to red

    // Driver Ratings Bar Chart - Color to Yellow, Right of Payments
    const ratingsData = [4.2, 3.8, 4.5, 4.0, 4.6];
    const svgRatings = d3.select('#driverRatingsChart')
      .attr('width', 600)
      .attr('height', 400);

    const xRatings = d3.scaleBand()
      .domain(['Driver 1', 'Driver 2', 'Driver 3', 'Driver 4', 'Driver 5'])
      .range([0, width])
      .padding(0.1);

    const yRatings = d3.scaleLinear()
      .domain([0, 5])
      .range([height, 0]);

    const chartRatings = svgRatings.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    chartRatings.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xRatings));

    chartRatings.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yRatings));

    chartRatings.selectAll('.bar')
      .data(ratingsData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xRatings(['Driver 1', 'Driver 2', 'Driver 3', 'Driver 4', 'Driver 5'][i]))
      .attr('y', d => yRatings(d))
      .attr('width', xRatings.bandwidth())
      .attr('height', d => height - yRatings(d))
      .attr('fill', '#ffc107'); // Set bar color to yellow

    // Booking Status Pie Chart with Percentages
    const pieData = [60, 30, 10]; // Completed, Canceled, Pending
    const pieLabels = ['Completed', 'Canceled', 'Pending'];
    const pieColors = d3.scaleOrdinal(['#28a745', '#dc3545', '#ffc107']);
    const svgPie = d3.select('#bookingStatusChart')
      .attr('width', 400)
      .attr('height', 400)
      .append('g')
      .attr('transform', 'translate(200,200)');

    const pie = d3.pie();
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(150);

    svgPie.selectAll('path')
      .data(pie(pieData))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => pieColors(i));

    // Add percentage labels
    svgPie.selectAll('text')
      .data(pie(pieData))
      .enter()
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text((d, i) => `${pieLabels[i]}: ${pieData[i]}%`)
      .style('fill', '#fff')
      .style('font-size', '14px');

    // Income Line Chart
    const incomeData = [3200, 4000, 4500, 3700, 5000, 5500, 6000]; // Example income data
    const svgIncome = d3.select('#incomeChart')
      .attr('width', 600)
      .attr('height', 400);

    const xIncome = d3.scaleLinear()
      .domain([0, 6])
      .range([0, width]);

    const yIncome = d3.scaleLinear()
      .domain([3000, 6500])
      .range([height, 0]);

    const line = d3.line()
      .x((d, i) => xIncome(i))
      .y(d => yIncome(d));

    const chartIncome = svgIncome.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    chartIncome.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xIncome).ticks(7));

    chartIncome.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yIncome));

    chartIncome.append('path')
      .datum(incomeData)
      .attr('fill', 'none')
      .attr('stroke', '#007bff')
      .attr('stroke-width', 2)
      .attr('d', line);
  }, []);

  return (
    <div className="reports-page">
      <h1>Reports</h1>

      <div className="report-section">
        {/* Payments Bar Chart */}
        <div className="chart-container">
          <h2>Monthly Payments</h2>
          <svg id="paymentsChart"></svg>
        </div>

        {/* Driver Ratings Bar Chart */}
        <div className="chart-container">
          <h2>Driver Ratings Overview</h2>
          <svg id="driverRatingsChart"></svg>
        </div>
      </div>

      <div className="report-section">
        {/* Booking Status Pie Chart */}
        <div className="chart-container">
          <h2>Booking Status Overview</h2>
          <svg id="bookingStatusChart"></svg>
        </div>

        {/* Income Line Chart */}
        <div className="chart-container">
          <h2>Income Overview</h2>
          <svg id="incomeChart"></svg>
        </div>
      </div>
    </div>
  );
}

export default Reports;
