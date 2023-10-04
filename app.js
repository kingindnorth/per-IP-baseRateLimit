const express = require('express')

const app = express()

//per-ip based rate limit.
// Define the maximum number of requests allowed per IP
const MAX_REQUESTS = 5;

// Define the whitelist of IP addresses
const whitelist = ['::1'];

// Create an object to store the request count per IP
const requestCount = {};

// Middleware function to check and block IPs
const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  console.log(ip)

  // Check if the IP is whitelisted
  if (whitelist.includes(ip)) {
    return next();
  }

  // Increment the request count for the IP
  requestCount[ip] = requestCount[ip] ? requestCount[ip] + 1 : 1;

  // If the request count exceeds the maximum, block the IP
  if (requestCount[ip] > MAX_REQUESTS) {
    console.log(`Blocking IP: ${ip}`);
    return res.status(403).send('Forbidden');
  }

  next();
};

// Apply the rate limiter middleware to all routes
app.use(rateLimiter);

// route middleware
app.use('/',(req,res)=>{
    res.send('ip getting tracked')
})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`server running...`)
})