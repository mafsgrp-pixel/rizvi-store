/*
 * Filename: formatters.js
 * Path: /js/utils/formatters.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Number, date, text, data formatters for display and export
 * Type: Utility JavaScript
 */

// ============================================
// NUMBER FORMATTERS
// ============================================

function formatIndianNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    
    const n = parseFloat(num);
    const isNegative = n < 0;
    const absNum = Math.abs(n);
    
    // Convert to string with 2 decimal places if needed
    let [integer, decimal] = absNum.toFixed(2).split('.');
    
    // Indian numbering system
    const lastThree = integer.substring(integer.length - 3);
    const otherNumbers = integer.substring(0, integer.length - 3);
    
    if (otherNumbers !== '') {
        const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
        integer = formatted + ',' + lastThree;
    } else {
        integer = lastThree;
    }
    
    let result = integer;
    if (decimal && decimal !== '00') {
        result += '.' + decimal;
    }
    
    return isNegative ? '-' + result : result;
}

function formatCompactNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    
    const n = parseFloat(num);
    const absN = Math.abs(n);
    const sign = n < 0 ? '-' : '';
    
    if (absN >= 10000000) {
        return sign + (absN / 10000000).toFixed(2) + ' Cr';
    }
    if (absN >= 100000) {
        return sign + (absN / 100000).toFixed(2) + ' L';
    }
    if (absN >= 1000) {
        return sign + (absN / 1000).toFixed(1) + ' K';
    }
    
    return sign + absN.toString();
}

function formatPercentage(value, decimals = 1, includeSign = true) {
    if (value === null || value === undefined || isNaN(value)) return '0%';
    
    const formatted = parseFloat(value).toFixed(decimals);
    const prefix = includeSign && value > 0 ? '+' : '';
    return prefix + formatted + '%';
}

function formatDecimal(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) return '0.00';
    return parseFloat(value).toFixed(decimals);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    if (!bytes || isNaN(bytes)) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatOrdinal(num) {
    if (num === null || num === undefined || isNaN(num)) return '';
    
    const n = parseInt(num);
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function formatRank(rank) {
    if (!rank) return '-';
    const num = parseInt(rank);
    
    if (num === 1) return '🥇 1st';
    if (num === 2) return '🥈 2nd';
    if (num === 3) return '🥉 3rd';
    return '#' + num;
}

// ============================================
// CURRENCY FORMATTERS
// ============================================

function formatINR(amount, showSymbol = true, decimals = 0) {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return showSymbol ? '₹0' : '0';
    }
    
    const num = parseFloat(amount);
    const formatted = formatIndianNumber(Math.abs(num));
    const symbol = showSymbol ? '₹' : '';
    const prefix = num < 0 ? '-' : '';
    
    if (decimals > 0) {
        const decimalPart = (Math.abs(num) % 1).toFixed(decimals).substring(1);
        return prefix + symbol + Math.floor(Math.abs(num)).toLocaleString('en-IN') + decimalPart;
    }
    
    return prefix + symbol + Math.floor(Math.abs(num)).toLocaleString('en-IN');
}

function formatINRWithDecimals(amount) {
    return formatINR(amount, true, 2);
}

function formatINRCompact(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
    
    const n = parseFloat(amount);
    const absN = Math.abs(n);
    const sign = n < 0 ? '-' : '';
    
    if (absN >= 10000000) {
        return sign + '₹' + (absN / 10000000).toFixed(2) + ' Cr';
    }
    if (absN >= 100000) {
        return sign + '₹' + (absN / 100000).toFixed(2) + ' L';
    }
    if (absN >= 1000) {
        return sign + '₹' + (absN / 1000).toFixed(1) + ' K';
    }
    
    return sign + '₹' + absN.toFixed(0);
}

function formatINRWords(amount) {
    if (!amount || isNaN(amount)) return 'Zero Rupees';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
                  'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    function convertHundreds(n) {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
        return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convertHundreds(n % 100) : '');
    }
    
    const num = Math.round(parseFloat(amount));
    if (num === 0) return 'Zero Rupees';
    
    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const remainder = num % 1000;
    
    let words = '';
    
    if (crore > 0) words += convertHundreds(crore) + ' Crore ';
    if (lakh > 0) words += convertHundreds(lakh) + ' Lakh ';
    if (thousand > 0) words += convertHundreds(thousand) + ' Thousand ';
    if (remainder > 0) words += convertHundreds(remainder) + ' ';
    
    return words.trim() + ' Rupees';
}

// ============================================
// DATE FORMATTERS
// ============================================

function formatDate(date, format = 'DD MMM YYYY') {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const tokens = {
        'DD': d.getDate().toString().padStart(2, '0'),
        'D': d.getDate().toString(),
        'MMM': months[d.getMonth()],
        'MMMM': monthsFull[d.getMonth()],
        'MM': (d.getMonth() + 1).toString().padStart(2, '0'),
        'M': (d.getMonth() + 1).toString(),
        'YYYY': d.getFullYear().toString(),
        'YY': d.getFullYear().toString().slice(-2),
        'HH': d.getHours().toString().padStart(2, '0'),
        'H': d.getHours().toString(),
        'hh': (d.getHours() % 12 || 12).toString().padStart(2, '0'),
        'h': (d.getHours() % 12 || 12).toString(),
        'mm': d.getMinutes().toString().padStart(2, '0'),
        'm': d.getMinutes().toString(),
        'ss': d.getSeconds().toString().padStart(2, '0'),
        's': d.getSeconds().toString(),
        'A': d.getHours() >= 12 ? 'PM' : 'AM',
        'a': d.getHours() >= 12 ? 'pm' : 'am',
        'ddd': days[d.getDay()],
        'dddd': daysFull[d.getDay()]
    };
    
    let result = format;
    for (const [token, value] of Object.entries(tokens)) {
        result = result.replace(token, value);
    }
    
    return result;
}

function formatDateShort(date) {
    return formatDate(date, 'DD/MM/YYYY');
}

function formatDateMedium(date) {
    return formatDate(date, 'DD MMM YYYY');
}

function formatDateLong(date) {
    return formatDate(date, 'dddd, DD MMMM YYYY');
}

function formatDateTime(date) {
    return formatDate(date, 'DD MMM YYYY, hh:mm A');
}

function formatDateTimeShort(date) {
    return formatDate(date, 'DD/MM/YY hh:mm A');
}

function formatTime(date) {
    return formatDate(date, 'hh:mm A');
}

function formatTimeWithSeconds(date) {
    return formatDate(date, 'hh:mm:ss A');
}

function formatDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
    
    // Same day
    if (start.toDateString() === end.toDateString()) {
        return formatDate(start, 'DD MMM YYYY');
    }
    
    // Same month
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return formatDate(start, 'DD') + ' - ' + formatDate(end, 'DD MMM YYYY');
    }
    
    // Same year
    if (start.getFullYear() === end.getFullYear()) {
        return formatDate(start, 'DD MMM') + ' - ' + formatDate(end, 'DD MMM YYYY');
    }
    
    return formatDate(start, 'DD MMM YYYY') + ' - ' + formatDate(end, 'DD MMM YYYY');
}

function formatDuration(days) {
    if (!days || days < 1) return '1 Day';
    if (days === 1) return '1 Day';
    if (days < 7) return days + ' Days';
    if (days === 7) return '1 Week';
    if (days < 30) return Math.floor(days / 7) + ' Weeks';
    if (days === 30) return '1 Month';
    if (days < 365) return Math.floor(days / 30) + ' Months';
    return Math.floor(days / 365) + ' Years';
}

function formatTimeAgo(date) {
    if (!date) return '';
    
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    
    if (diffMs < 0) return 'Just now';
    
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return seconds + 's ago';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return minutes + ' mins ago';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return hours + ' hours ago';
    if (days === 1) return 'Yesterday';
    if (days < 7) return days + ' days ago';
    if (weeks === 1) return '1 week ago';
    if (weeks < 4) return weeks + ' weeks ago';
    if (months === 1) return '1 month ago';
    if (months < 12) return months + ' months ago';
    if (years === 1) return '1 year ago';
    return years + ' years ago';
}

function formatTimeFromNow(date) {
    if (!date) return '';
    
    const now = new Date();
    const future = new Date(date);
    const diffMs = future - now;
    
    if (diffMs < 0) return 'Started ' + formatTimeAgo(date);
    
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'In ' + seconds + 's';
    if (minutes < 60) return 'In ' + minutes + ' mins';
    if (hours < 24) return 'In ' + hours + ' hours';
    if (days === 1) return 'Tomorrow';
    if (days < 7) return 'In ' + days + ' days';
    
    return formatDate(date, 'DD MMM YYYY');
}

function formatCountdown(seconds) {
    if (seconds <= 0) return '00:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
}

// ============================================
// TEXT FORMATTERS
// ============================================

function formatName(name) {
    if (!name) return '';
    return name.replace(/\b\w/g, char => char.toUpperCase());
}

function formatPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/[^0-9]/g, '');
    
    if (cleaned.length === 10) {
        return '+91 ' + cleaned.substring(0, 5) + ' ' + cleaned.substring(5);
    }
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
        return '+91 ' + cleaned.substring(2, 7) + ' ' + cleaned.substring(7);
    }
    
    return phone;
}

function formatEmail(email) {
    if (!email) return '';
    return email.toLowerCase().trim();
}

function formatGST(gst) {
    if (!gst) return '';
    return gst.trim().toUpperCase();
}

function formatAddress(address) {
    if (!address) return '';
    if (typeof address === 'object') {
        const parts = [
            address.line1,
            address.line2,
            address.city,
            address.state,
            address.pincode
        ].filter(Boolean);
        return parts.join(', ');
    }
    return address;
}

function formatURL(url) {
    if (!url) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
    }
    return url;
}

function formatSlug(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function formatInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function formatTruncate(text, maxLength = 50, suffix = '...') {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trimEnd() + suffix;
}

function formatTitleCase(text) {
    if (!text) return '';
    const smallWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 
                        'to', 'by', 'in', 'of', 'with', 'from', 'into', 'onto', 'upon'];
    
    return text.replace(/\w\S*/g, (word, index) => {
        if (index > 0 && index < text.length - 1 && smallWords.includes(word.toLowerCase())) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
    });
}

function formatSentenceCase(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
}

// ============================================
// DATA TYPE FORMATTERS
// ============================================

function formatBoolean(value, trueText = 'Yes', falseText = 'No') {
    return value ? trueText : falseText;
}

function formatStatus(status) {
    if (!status) return '';
    
    const statusMap = {
        'active': 'Active',
        'pending': 'Pending',
        'paused': 'Paused',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
        'draft': 'Draft',
        'approved': 'Approved',
        'rejected': 'Rejected',
        'paid': 'Paid',
        'unpaid': 'Unpaid',
        'overdue': 'Overdue',
        'verified': 'Verified',
        'failed': 'Failed',
        'refunded': 'Refunded'
    };
    
    return statusMap[status.toLowerCase()] || status;
}

function formatRole(role) {
    if (!role) return '';
    
    const roleMap = {
        'super_admin': 'Super Admin',
        'admin': 'Admin',
        'client': 'Client',
        'driver': 'Driver',
        'affiliate': 'Affiliate',
        'sales': 'Sales Representative',
        'passenger': 'Passenger',
        'guest': 'Guest'
    };
    
    return roleMap[role] || role;
}

function formatCampaignType(type) {
    if (!type) return '';
    
    const typeMap = {
        'led': 'LED Screen Ad',
        'audio': 'Audio Announcement',
        'combo': 'Combo (LED + Audio)'
    };
    
    return typeMap[type.toLowerCase()] || type;
}

function formatZoneName(zone) {
    if (!zone) return '';
    return zone;
}

function formatZoneTier(tier) {
    if (!tier) return '';
    
    const tierMap = {
        'high': '🔴 High Traffic',
        'medium': '🟡 Medium Traffic',
        'low': '🟢 Low Traffic'
    };
    
    return tierMap[tier.toLowerCase()] || tier;
}

// ============================================
// LIST FORMATTERS
// ============================================

function formatList(array, separator = ', ', lastSeparator = ' & ') {
    if (!array || array.length === 0) return '';
    if (array.length === 1) return array[0];
    if (array.length === 2) return array[0] + lastSeparator + array[1];
    
    const last = array[array.length - 1];
    const rest = array.slice(0, -1);
    return rest.join(separator) + lastSeparator + last;
}

function formatTags(tags) {
    if (!tags || tags.length === 0) return '';
    if (Array.isArray(tags)) return tags.join(', ');
    return tags;
}

function formatJSON(obj) {
    try {
        return JSON.stringify(obj, null, 2);
    } catch {
        return '';
    }
}

// ============================================
// IDENTIFIER FORMATTERS
// ============================================

function formatInvoiceNumber(num) {
    if (!num) return '';
    return '#' + num;
}

function formatCampaignId(id) {
    if (!id) return '';
    return '#' + id;
}

function formatTransactionId(id) {
    if (!id) return '';
    if (id.length <= 12) return id;
    return id.substring(0, 6) + '...' + id.substring(id.length - 4);
}

function formatReferralCode(code) {
    if (!code) return '';
    return code.toUpperCase();
}

// ============================================
// METRICS FORMATTERS
// ============================================

function formatImpressions(count) {
    if (!count) return '0';
    return formatCompactNumber(count);
}

function formatCPM(cost, impressions) {
    if (!impressions || impressions === 0) return '₹0';
    const cpm = (cost / impressions) * 1000;
    return formatINR(cpm, true, 2);
}

function formatROI(revenue, cost) {
    if (!cost || cost === 0) return '0%';
    const roi = ((revenue - cost) / cost) * 100;
    return formatPercentage(roi, 1);
}

function formatConversionRate(conversions, total) {
    if (!total || total === 0) return '0%';
    const rate = (conversions / total) * 100;
    return formatPercentage(rate, 2);
}

function formatEngagementRate(engagements, impressions) {
    if (!impressions || impressions === 0) return '0%';
    const rate = (engagements / impressions) * 100;
    return formatPercentage(rate, 2);
}

// ============================================
// EXPORT FORMATTERS
// ============================================

function formatForCSV(data) {
    if (!data) return '';
    const str = String(data);
    // Escape quotes and wrap in quotes if contains comma or quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

function formatArrayToCSV(headers, rows) {
    const headerLine = headers.map(h => formatForCSV(h)).join(',');
    const dataLines = rows.map(row => 
        headers.map(h => formatForCSV(row[h] || '')).join(',')
    );
    return [headerLine, ...dataLines].join('\n');
}

function formatForPDF(data) {
    // Clean data for PDF rendering
    if (typeof data === 'string') {
        return data.replace(/[^\x20-\x7E\u0900-\u097F]/g, '');
    }
    return data;
}

// ============================================
// DISPLAY HELPERS
// ============================================

function formatEmpty(value, placeholder = '-') {
    if (value === null || value === undefined || value === '') {
        return placeholder;
    }
    return value;
}

function formatNA(value) {
    return formatEmpty(value, 'N/A');
}

function formatZero(value) {
    return value || '0';
}

function formatHighlight(value, threshold, above = true) {
    if (above && value >= threshold) {
        return `<span class="text-green">${value}</span>`;
    }
    if (!above && value <= threshold) {
        return `<span class="text-red">${value}</span>`;
    }
    return value;
}

// ============================================
// INITIALIZATION
// ============================================

console.log('✅ Formatters Module Loaded');
