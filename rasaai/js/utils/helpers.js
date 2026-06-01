/*
 * Filename: helpers.js
 * Path: /js/utils/helpers.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Currency formatting, date helpers, string utilities, general helper functions
 * Type: Utility JavaScript
 */

// ============================================
// CURRENCY FORMATTING
// ============================================

function formatCurrency(amount, symbol = '₹', decimals = 0) {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return symbol + '0';
    }
    
    const num = parseFloat(amount);
    
    if (decimals > 0) {
        return symbol + num.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }
    
    return symbol + num.toLocaleString('en-IN');
}

function formatCurrencyWithDecimals(amount) {
    return formatCurrency(amount, '₹', 2);
}

function formatCompactCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
    
    const num = parseFloat(amount);
    
    if (num >= 10000000) {
        return '₹' + (num / 10000000).toFixed(1) + 'Cr';
    }
    if (num >= 100000) {
        return '₹' + (num / 100000).toFixed(1) + 'L';
    }
    if (num >= 1000) {
        return '₹' + (num / 1000).toFixed(1) + 'K';
    }
    
    return '₹' + num.toFixed(0);
}

function parseCurrency(currencyString) {
    if (!currencyString) return 0;
    const cleaned = currencyString.replace(/[₹,]/g, '').trim();
    return parseFloat(cleaned) || 0;
}

function calculateGST(amount, rate = null) {
    const gstRate = rate || PRICING_CONFIG.gstRate;
    return amount * (gstRate / 100);
}

function calculateTotalWithGST(amount, rate = null) {
    return amount + calculateGST(amount, rate);
}

function calculateDiscount(amount, discountPercent) {
    return amount * (discountPercent / 100);
}

function calculateFinalPrice(basePrice, discountPercent = 0, gstRate = null) {
    const afterDiscount = basePrice - calculateDiscount(basePrice, discountPercent);
    return calculateTotalWithGST(afterDiscount, gstRate);
}

// ============================================
// DATE HELPERS
// ============================================

function formatDate(date, format = 'DD MMM YYYY') {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const monthFull = d.toLocaleString('en-US', { month: 'long' });
    const monthNum = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const yearShort = year.toString().slice(-2);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    const hours12 = (d.getHours() % 12 || 12).toString().padStart(2, '0');
    
    return format
        .replace('DD', day)
        .replace('MMM', month)
        .replace('MMMM', monthFull)
        .replace('MM', monthNum)
        .replace('YYYY', year)
        .replace('YY', yearShort)
        .replace('HH', hours)
        .replace('hh', hours12)
        .replace('mm', minutes)
        .replace('ss', seconds)
        .replace('A', ampm)
        .replace('a', ampm.toLowerCase());
}

function formatDateShort(date) {
    return formatDate(date, 'DD/MM/YYYY');
}

function formatDateFull(date) {
    return formatDate(date, 'DD MMM YYYY, hh:mm A');
}

function formatDateISO(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

function formatTime(date) {
    return formatDate(date, 'hh:mm A');
}

function formatTimeAgo(date) {
    if (!date) return '';
    
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffSeconds < 60) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

function getCurrentMonth() {
    return new Date().toISOString().substring(0, 7);
}

function getCurrentYear() {
    return new Date().getFullYear().toString();
}

function getDateRange(days) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
    };
}

function getMonthStart() {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
}

function getMonthEnd() {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return d.toISOString().split('T')[0];
}

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffMs = Math.abs(d2 - d1);
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function isDateInRange(date, startDate, endDate) {
    const d = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return d >= start && d <= end;
}

function isToday(date) {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
}

function isThisMonth(date) {
    const d = new Date(date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

// ============================================
// STRING HELPERS
// ============================================

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function capitalizeWords(str) {
    if (!str) return '';
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function truncate(str, length = 50, suffix = '...') {
    if (!str || str.length <= length) return str || '';
    return str.substring(0, length).trim() + suffix;
}

function slugify(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function generateId(prefix = '') {
    return prefix + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
}

function generateCampaignId() {
    return 'CAM' + Date.now().toString(36).toUpperCase();
}

function generateReferralLink(affiliateCode) {
    return `${APP_CONFIG.fullUrl}/index.html?ref=${affiliateCode}`;
}

function maskEmail(email) {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    const maskedName = name.substring(0, 2) + '***' + name.substring(name.length - 1);
    return `${maskedName}@${domain}`;
}

function maskPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.length < 10) return phone;
    return cleaned.substring(0, 2) + '******' + cleaned.substring(cleaned.length - 2);
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function getAvatarColor(name) {
    const colors = [
        '#FF5A00', '#221F60', '#00A86B', '#E74C3C', 
        '#3498DB', '#8E44AD', '#FFB800', '#1ABC9C'
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

// ============================================
// NUMBER HELPERS
// ============================================

function formatNumber(num, decimals = 0) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return parseFloat(num).toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function formatCompactNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    
    const n = parseFloat(num);
    if (n >= 10000000) return (n / 10000000).toFixed(1) + 'Cr';
    if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
}

function formatPercentage(num, decimals = 1) {
    if (num === null || num === undefined || isNaN(num)) return '0%';
    return parseFloat(num).toFixed(decimals) + '%';
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min, max, decimals = 2) {
    const num = Math.random() * (max - min) + min;
    return parseFloat(num.toFixed(decimals));
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function roundTo(num, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
}

function sumArray(arr, key = null) {
    if (!arr || !arr.length) return 0;
    if (key) {
        return arr.reduce((sum, item) => sum + (parseFloat(item[key]) || 0), 0);
    }
    return arr.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
}

function averageArray(arr, key = null) {
    if (!arr || !arr.length) return 0;
    return sumArray(arr, key) / arr.length;
}

// ============================================
// OBJECT / ARRAY HELPERS
// ============================================

function groupBy(array, key) {
    return array.reduce((groups, item) => {
        const groupKey = typeof key === 'function' ? key(item) : item[key];
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(item);
        return groups;
    }, {});
}

function sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
        const valA = typeof key === 'function' ? key(a) : a[key];
        const valB = typeof key === 'function' ? key(b) : b[key];
        
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

function uniqueBy(array, key) {
    const seen = new Set();
    return array.filter(item => {
        const val = typeof key === 'function' ? key(item) : item[key];
        if (seen.has(val)) return false;
        seen.add(val);
        return true;
    });
}

function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

function paginate(array, page = 1, perPage = 20) {
    const total = array.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const items = array.slice(start, end);
    
    return {
        items,
        pagination: {
            current: page,
            perPage,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}

function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    
    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

function pick(obj, keys) {
    const result = {};
    keys.forEach(key => {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
    });
    return result;
}

function omit(obj, keys) {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
}

// ============================================
// COLOR HELPERS
// ============================================

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getStatusColor(status) {
    const colors = {
        active: '#00A86B',
        pending: '#FFB800',
        paused: '#6C757D',
        completed: '#3498DB',
        cancelled: '#E74C3C',
        draft: '#ADB5BD',
        approved: '#00A86B',
        rejected: '#E74C3C',
        paid: '#00A86B',
        unpaid: '#FFB800',
        overdue: '#E74C3C'
    };
    return colors[status] || '#6C757D';
}

function getStatusBgColor(status) {
    const colors = {
        active: '#E6F7F0',
        pending: '#FFF3D6',
        paused: '#F1F3F5',
        completed: '#EBF5FB',
        cancelled: '#FDEDEC',
        draft: '#F8F9FA',
        approved: '#E6F7F0',
        rejected: '#FDEDEC',
        paid: '#E6F7F0',
        unpaid: '#FFF3D6',
        overdue: '#FDEDEC'
    };
    return colors[status] || '#F8F9FA';
}

// ============================================
// URL HELPERS
// ============================================

function getUrlParam(name, url = null) {
    const targetUrl = url || window.location.href;
    const urlObj = new URL(targetUrl);
    return urlObj.searchParams.get(name);
}

function setUrlParams(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }
    });
    window.history.replaceState({}, '', url.toString());
}

function buildUrl(base, params = {}) {
    const url = new URL(base, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            url.searchParams.set(key, value);
        }
    });
    return url.toString();
}

function copyToClipboard(text) {
    return new Promise((resolve, reject) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => resolve(true))
                .catch(reject);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                resolve(true);
            } catch (err) {
                reject(err);
            }
            document.body.removeChild(textarea);
        }
    });
}

// ============================================
// WHATSAPP HELPERS
// ============================================

function openWhatsApp(message = '', number = null) {
    const phoneNumber = number || APP_CONFIG.whatsappNumber;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
}

function shareViaWhatsApp(text, url = null) {
    const shareText = url ? `${text}\n${url}` : text;
    openWhatsApp(shareText);
}

// ============================================
// DOM HELPERS
// ============================================

function $(selector, parent = document) {
    return parent.querySelector(selector);
}

function $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}

function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else if (key === 'dataset' && typeof value === 'object') {
            Object.assign(element.dataset, value);
        } else if (key === 'html') {
            element.innerHTML = value;
        } else if (key === 'text') {
            element.textContent = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    
    if (Array.isArray(children)) {
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
    }
    
    return element;
}

function showElement(element) {
    if (typeof element === 'string') element = $(element);
    if (element) element.classList.remove('hidden');
}

function hideElement(element) {
    if (typeof element === 'string') element = $(element);
    if (element) element.classList.add('hidden');
}

function toggleElement(element) {
    if (typeof element === 'string') element = $(element);
    if (element) element.classList.toggle('hidden');
}

function isElementVisible(element) {
    if (typeof element === 'string') element = $(element);
    return element && !element.classList.contains('hidden');
}

// ============================================
// STORAGE HELPERS
// ============================================

function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn('⚠️ localStorage full or unavailable');
        return false;
    }
}

function getLocalStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
        return defaultValue;
    }
}

function removeLocalStorage(key) {
    localStorage.removeItem(key);
}

function clearLocalStorage() {
    localStorage.clear();
}

// ============================================
// VALIDATION HELPERS
// ============================================

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidPhone(phone) {
    const cleaned = phone.replace(/[^0-9]/g, '');
    return /^[6-9]\d{9}$/.test(cleaned);
}

function isValidGST(gst) {
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return regex.test(gst);
}

function isValidUPI(upi) {
    const regex = /^[\w.-]+@[\w]+$/;
    return regex.test(upi);
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ============================================
// DEBOUNCE & THROTTLE
// ============================================

function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit = 300) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// MISC HELPERS
// ============================================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function retry(fn, maxAttempts = 3, delayMs = 1000) {
    return new Promise(async (resolve, reject) => {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const result = await fn();
                resolve(result);
                return;
            } catch (error) {
                if (attempt === maxAttempts) {
                    reject(error);
                    return;
                }
                await sleep(delayMs * attempt);
            }
        }
    });
}

function once(fn) {
    let called = false;
    let result;
    return function (...args) {
        if (!called) {
            called = true;
            result = fn.apply(this, args);
        }
        return result;
    };
}

function memoize(fn) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

function noop() {}

function identity(value) {
    return value;
}

// ============================================
// CONSOLE LOGGING (Controlled)
// ============================================

function log(...args) {
    if (FEATURES.debugMode) {
        console.log(...args);
    }
}

function warn(...args) {
    if (FEATURES.debugMode) {
        console.warn(...args);
    }
}

function error(...args) {
    console.error(...args);
}

console.log('✅ Helpers Module Loaded');
