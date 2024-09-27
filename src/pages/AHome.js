import React, { useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import '../css/AHome.css'; // CSS file for admin home styling
import { FaUsers, FaCar, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';

function AHome() {
  // Fake data
  const totalUsers = 350;
  const totalDrivers = 150;
  const totalBookings = 1200;
  const completedBookings = 900;
  const pendingBookings = 200;
  const canceledBookings = 100;
  const totalRevenue = 500000; 

  // Monthly revenue data (in Rs.)
  const monthlyRevenueData = useMemo(() => [
    { month: 'January', revenue: 40000 },
    { month: 'February', revenue: 45000 },
    { month: 'March', revenue: 50000 },
    { month: 'April', revenue: 55000 },
    { month: 'May', revenue: 60000 },
    { month: 'June', revenue: 65000 },
    { month: 'July', revenue: 70000 },
    { month: 'August', revenue: 75000 },
    { month: 'September', revenue: 80000 },
    { month: 'October', revenue: 85000 },
    { month: 'November', revenue: 90000 },
    { month: 'December', revenue: 95000 }
  ], []);

  // D3.js Revenue Bar Chart
  useEffect(() => {
    const svg = d3.select('#revenueBarChart')
      .attr('width', 700)
      .attr('height', 450);

    const margin = { top: 40, right: 30, bottom: 40, left: 60 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(monthlyRevenueData.map(d => d.month))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(monthlyRevenueData, d => d.revenue)])
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

    // Revenue bars
    chart.selectAll('.revenue-bar')
      .data(monthlyRevenueData)
      .enter()
      .append('rect')
      .attr('class', 'revenue-bar')
      .attr('x', d => x(d.month))
      .attr('y', d => y(d.revenue))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.revenue))
      .attr('fill', '#007bff'); // Revenue bar color
  }, [monthlyRevenueData]);

  // D3.js Pie Chart for Bookings Status
  useEffect(() => {
    const data = [
      { label: 'Completed', value: completedBookings },
      { label: 'Pending', value: pendingBookings },
      { label: 'Canceled', value: canceledBookings }
    ];

    const svg = d3.select('#bookingsPieChart')
      .attr('width', 350)
      .attr('height', 350)
      .append('g')
      .attr('transform', 'translate(175,175)');

    const radius = 175;

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(['#28a745', '#ffc107', '#dc3545']); // Green for completed, yellow for pending, red for canceled

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
      .attr('font-size', '16px')
      .attr('fill', '#fff')
      .text(d => `${d.data.label}: ${(d.data.value / totalBookings * 100).toFixed(1)}%`);
  }, [completedBookings, pendingBookings, canceledBookings, totalBookings]);

  return (
    <div className="admin-home">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. Here, you can manage users, drivers, bookings, and more.</p>

      <div className="overview-section">
        {/* Total Users */}
        <div className="overview-card total-users">
          <FaUsers size={50} color="#007bff" />
          <div className="info">
            <h2>Total Users</h2>
            <p>{totalUsers}</p>
          </div>
        </div>

        {/* Total Drivers */}
        <div className="overview-card total-drivers">
          <FaCar size={50} color="#28a745" />
          <div className="info">
            <h2>Total Drivers</h2>
            <p>{totalDrivers}</p>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="overview-card total-bookings">
          <FaCalendarAlt size={50} color="#ffc107" />
          <div className="info">
            <h2>Total Bookings</h2>
            <p>{totalBookings}</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="overview-card total-revenue">
          <FaDollarSign size={50} color="#28a745" />
          <div className="info">
            <h2>Total Revenue</h2>
            <p>Rs. {totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Bar and Pie Charts Side by Side */}
      <div className="chart-section">
        <div className="chart-container">
          <h3>Monthly Revenue (Rs.)</h3>
          <svg id="revenueBarChart"></svg>
        </div>

        {/* Pie chart for Completed vs Canceled Orders */}
        <div className="pie-chart-container">
          <h3>Bookings Status</h3>
          <svg id="bookingsPieChart"></svg>
        </div>
      </div>
    </div>
  );
}

export default AHome;
