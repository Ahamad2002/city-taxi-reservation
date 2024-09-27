import React, { useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import '../css/Dhome.css'; // CSS file for styling
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaMoneyBillWave } from 'react-icons/fa';

function DHome() {
  // Fake data
  const completedOrders = 100;
  const canceledOrders = 8;
  const pendingOrders = 12;
  const totalIncome = 200000; // Total income in Rs

  // Use useMemo to memoize the monthly income data
  const monthlyIncomeData = useMemo(() => [
    { month: 'Jan', income: 18000 },
    { month: 'Feb', income: 22000 },
    { month: 'March', income: 24000 },
    { month: 'April', income: 21000 },
    { month: 'May', income: 25000 },
    { month: 'June', income: 23000 },
    { month: 'July', income: 26000 },
    { month: 'Aug', income: 27000 },
    { month: 'Sep', income: 28000 },
    { month: 'Oct', income: 30000 },
    { month: 'Nov', income: 25000 },
    { month: 'Dec', income: 35000 }
  ], []);

  // D3.js Income Bar Chart
  useEffect(() => {
    const svg = d3.select('#incomeBarChart')
      .attr('width', 600)
      .attr('height', 450);

    const margin = { top: 40, right: 30, bottom: 40, left: 60 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(monthlyIncomeData.map(d => d.month))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(monthlyIncomeData, d => d.income)])
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

    // Income bars
    chart.selectAll('.income-bar')
      .data(monthlyIncomeData)
      .enter()
      .append('rect')
      .attr('class', 'income-bar')
      .attr('x', d => x(d.month))
      .attr('y', d => y(d.income))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.income))
      .attr('fill', '#28a745'); // Income bar color
  }, [monthlyIncomeData]);

  // D3.js Pie Chart for Completed vs Canceled Orders
  useEffect(() => {
    const data = [
      { label: 'Completed Orders', value: completedOrders },
      { label: 'Canceled Orders', value: canceledOrders }
    ];

    const svg = d3.select('#ordersPieChart')
      .attr('width', 350)
      .attr('height', 350)
      .append('g')
      .attr('transform', 'translate(175,175)');

    const radius = 175;

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(['#28a745', '#dc3545']); // Green for completed, red for canceled

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
      .text(d => `${d.data.label}: ${((d.data.value / (completedOrders + canceledOrders)) * 100).toFixed(1)}%`);
  }, [completedOrders, canceledOrders]);

  return (
    <div className="driver-home">
      <h1>Driver Dashboard</h1>
      <div className="overview-section">
        {/* Completed Orders */}
        <div className="overview-card completed-orders">
          <FaCheckCircle size={50} color="#28a745" />
          <div className="order-info">
            <h2>Completed Orders</h2>
            <p>{completedOrders}</p>
          </div>
        </div>

        {/* Canceled Orders */}
        <div className="overview-card canceled-orders">
          <FaTimesCircle size={50} color="#dc3545" />
          <div className="order-info">
            <h2>Canceled Orders</h2>
            <p>{canceledOrders}</p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="overview-card pending-orders">
          <FaHourglassHalf size={50} color="#ffc107" />
          <div className="order-info">
            <h2>Pending Orders</h2>
            <p>{pendingOrders}</p>
          </div>
        </div>

        {/* Total Income */}
        <div className="overview-card total-income">
          <FaMoneyBillWave size={50} color="#007bff" />
          <div className="order-info">
            <h2>Total Income</h2>
            <p>Rs. {totalIncome.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Bar and Pie Charts Side by Side */}
      <div className="chart-section">
        <div className="chart-container">
          <h3>Monthly Income (Rs.)</h3>
          <svg id="incomeBarChart"></svg>
        </div>

        {/* Pie chart for Completed vs Canceled Orders */}
        <div className="pie-chart-container">
          <h3>Completed vs Canceled Orders</h3>
          <svg id="ordersPieChart"></svg>
        </div>
      </div>
    </div>
  );
}

export default DHome;
