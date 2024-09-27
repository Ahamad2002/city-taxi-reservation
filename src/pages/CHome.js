import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import '../css/CHome.css';
import { FaCar, FaChartBar, FaTimesCircle } from 'react-icons/fa';

function CHome() {
  const [totalRides] = useState(128); 
  const [canceledRides] = useState(10); 
  const completedRides = totalRides - canceledRides;

  const monthlyData = [
    { month: 'January', rides: 12, canceled: 2 },
    { month: 'February', rides: 9, canceled: 1 },
    { month: 'March', rides: 15, canceled: 3 },
    { month: 'April', rides: 18, canceled: 2 },
    { month: 'May', rides: 22, canceled: 1 },
    { month: 'June', rides: 25, canceled: 0 },
    { month: 'July', rides: 19, canceled: 3 },
    { month: 'Aug', rides: 21, canceled: 2 },
    { month: 'Sep', rides: 17, canceled: 1 },
    { month: 'Oct', rides: 23, canceled: 2 },
    { month: 'Nov', rides: 20, canceled: 1 },
    { month: 'Dec', rides: 24, canceled: 2 }
  ];

  // D3.js Bar Chart
  useEffect(() => {
    const svg = d3.select('#barChart')
      .attr('width', 600)
      .attr('height', 450);

    const margin = { top: 40, right: 30, bottom: 40, left: 60 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(monthlyData.map(d => d.month))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(monthlyData, d => Math.max(d.rides, d.canceled))])
      .range([height, 0]);

    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X-axis
    chart.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Y-axis
    chart.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    // Rides bars
    chart.selectAll('.ride-bar')
      .data(monthlyData)
      .enter()
      .append('rect')
      .attr('class', 'ride-bar')
      .attr('x', d => x(d.month))
      .attr('y', d => y(d.rides))
      .attr('width', x.bandwidth() / 2)
      .attr('height', d => height - y(d.rides))
      .attr('fill', '#ffcc00'); // Ride bar color

    // Canceled bars
    chart.selectAll('.canceled-bar')
      .data(monthlyData)
      .enter()
      .append('rect')
      .attr('class', 'canceled-bar')
      .attr('x', d => x(d.month) + x.bandwidth() / 2)
      .attr('y', d => y(d.canceled))
      .attr('width', x.bandwidth() / 2)
      .attr('height', d => height - y(d.canceled))
      .attr('fill', '#ff3300'); // Canceled ride bar color
  }, [monthlyData]);

  // D3.js Pie Chart
  useEffect(() => {
    const data = [
      { label: 'Completed', value: completedRides },
      { label: 'Canceled', value: canceledRides }
    ];

    const svg = d3.select('#pieChart')
      .attr('width', 350)
      .attr('height', 350)
      .append('g')
      .attr('transform', 'translate(175,175)');

    const radius = 175;

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(['#ffcc00', '#ff3300']);

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label));

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('fill', '#fff')
      .text(d => `${d.data.label}: ${((d.data.value / totalRides) * 100).toFixed(1)}%`);
  }, [completedRides, canceledRides, totalRides]);

  return (
    <div className="customer-home">
      <h1>Customer Dashboard</h1>
      <div className="overview-section">
   
        <div className="total-rides">
          <FaCar size={50} color="#ff3300" />
          <div className="ride-info">
            <h2>Total Rides</h2>
            <p>{totalRides}</p>
          </div>
        </div>

        {/* Canceled Rides */}
        <div className="canceled-rides">
          <FaTimesCircle size={50} color="#cc0000" />
          <div className="ride-info">
            <h2>Canceled Rides</h2>
            <p>{canceledRides}</p>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="monthly-overview">
          <FaChartBar size={50} color="#ffcc00" />
          <div className="ride-info">
            <h2>Monthly Rides Overview</h2>
          </div>
        </div>
      </div>

      {/* Bar chart and Pie chart side by side */}
      <div className="chart-section">
        <div className="chart-container">
          <h3>Monthly Rides and Canceled Rides</h3>
          <svg id="barChart"></svg>
        </div>

        {/* Pie chart for Completed vs Canceled Rides */}
        <div className="pie-chart-container">
          <h3>Completed vs Canceled Rides</h3>
          <svg id="pieChart"></svg>
        </div>
      </div>
    </div>
  );
}

export default CHome;
