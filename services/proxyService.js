require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Proxy cache file path
const PROXY_CACHE_PATH = path.join(__dirname, '../data/proxy-cache.json');
const WEBSHARE_API_URL = 'https://proxy.webshare.io/api/proxy/list/';

// Function to get direct proxy from environment variables
function getDirectProxy() {
  if (process.env.WEBSHARE_USERNAME && process.env.WEBSHARE_PASSWORD && process.env.WEBSHARE_PROXY) {
    const [host, port] = process.env.WEBSHARE_PROXY.split(':');
    return {
      host,
      port: parseInt(port),
      username: process.env.WEBSHARE_USERNAME,
      password: process.env.WEBSHARE_PASSWORD,
      protocol: 'http'
    };
  }
  return null;
}

// Function to get a proxy from Webshare API
async function fetchProxiesFromWebshare() {
  // If no API key but have direct proxy credentials, use those instead
  const directProxy = getDirectProxy();
  if (!process.env.WEBSHARE_API_KEY && directProxy) {
    console.log('Using direct proxy credentials from environment variables');
    return [{ 
      ...directProxy,
      country: 'N/A',
      lastUsed: null
    }];
  }
  
  try {
    // Only proceed with API call if API key is available
    if (!process.env.WEBSHARE_API_KEY) {
      throw new Error('Webshare API key not provided');
    }
    
    const response = await axios.get(WEBSHARE_API_URL, {
      headers: {
        'Authorization': `Token ${process.env.WEBSHARE_API_KEY}`
      }
    });
    
    if (response.data && response.data.results) {
      const proxies = response.data.results.map(proxy => ({
        host: proxy.proxy_address,
        port: proxy.ports.http,
        username: proxy.username,
        password: proxy.password,
        protocol: 'http',
        country: proxy.country_code,
        lastUsed: null
      }));
      
      await cacheProxies(proxies);
      return proxies;
    }
    
    throw new Error('Invalid response from Webshare API');
  } catch (error) {
    console.error('Error fetching proxies from Webshare:', error.message);
    throw error;
  }
}

// Function to cache proxies to file
async function cacheProxies(proxies) {
  try {
    // Ensure the directory exists
    await fs.mkdir(path.dirname(PROXY_CACHE_PATH), { recursive: true });
    
    // Write proxies to cache file
    await fs.writeFile(
      PROXY_CACHE_PATH, 
      JSON.stringify(proxies, null, 2)
    );
    
    console.log(`Cached ${proxies.length} proxies to ${PROXY_CACHE_PATH}`);
  } catch (error) {
    console.error('Error caching proxies:', error);
  }
}

// Function to get cached proxies
async function getCachedProxies() {
  try {
    const data = await fs.readFile(PROXY_CACHE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No proxy cache found or error reading cache');
    return [];
  }
}

// Function to get a proxy
async function getProxy() {
  try {
    // First check if we have direct proxy credentials
    const directProxy = getDirectProxy();
    if (directProxy) {
      console.log('Using direct proxy configuration from environment variables');
      // For direct proxies, we need to detect the country - might need to be added to env vars
      if (!directProxy.country) {
        try {
          // Try to detect the country from the IP
          directProxy.country = await require('../lib/utils').detectLocationFromIP(directProxy.host);
        } catch (error) {
          console.warn('Failed to detect country from direct proxy IP, using US as fallback');
          directProxy.country = 'US';
        }
      }
      return directProxy;
    }
    
    // Try to get cached proxies first
    let proxies = await getCachedProxies();
    
    // If no cached proxies or cache is older than 24 hours, fetch new proxies
    const cacheAge = await getProxyCacheAge();
    if (proxies.length === 0 || cacheAge > 24 * 60 * 60 * 1000) {
      proxies = await fetchProxiesFromWebshare();
    }
    
    // Select a proxy that hasn't been used recently
    const sortedProxies = proxies.sort((a, b) => {
      if (!a.lastUsed) return -1;
      if (!b.lastUsed) return 1;
      return new Date(a.lastUsed) - new Date(b.lastUsed);
    });
    
    const selectedProxy = sortedProxies[0];
    
    // Update last used timestamp
    selectedProxy.lastUsed = new Date().toISOString();
    await cacheProxies(proxies);
    
    return {
      host: selectedProxy.host,
      port: selectedProxy.port,
      username: selectedProxy.username,
      password: selectedProxy.password,
      protocol: selectedProxy.protocol,
      country: selectedProxy.country || 'US' // Ensure country code is included
    };
  } catch (error) {
    console.error('Error getting proxy:', error);
    return null;
  }
}

// Get the age of the proxy cache in milliseconds
async function getProxyCacheAge() {
  try {
    const stats = await fs.stat(PROXY_CACHE_PATH);
    return Date.now() - stats.mtime.getTime();
  } catch (error) {
    return Infinity; // If file doesn't exist, return Infinity to force refresh
  }
}

module.exports = { getProxy, fetchProxiesFromWebshare };
