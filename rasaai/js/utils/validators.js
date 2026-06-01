/*
 * Filename: validators.js
 * Path: /js/utils/validators.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Form validation, data validation, input sanitization, XSS protection
 * Type: Utility JavaScript
 */

// ============================================
// VALIDATION STATE
// ============================================

const ValidationState = {
    errors: {},
    isValid: true,
    isDirty: false
};

// ============================================
// SANITIZATION (XSS Prevention)
// ============================================

function sanitizeInput(input) {
    if (input === null || input === undefined) return '';
    
    const str = String(input);
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    
    const reg = /[&<>"'`=/]/gi;
    return str.replace(reg, match => map[match]);
}

function sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
}

function sanitizeURL(url) {
    if (!url) return '';
    
    // Only allow http, https, and relative URLs
    const cleaned = url.trim().toLowerCase();
    
    if (cleaned.startsWith('http://') || 
        cleaned.startsWith('https://') || 
        cleaned.startsWith('/') ||
        cleaned.startsWith('./') ||
        cleaned.startsWith('../')) {
        return cleaned;
    }
    
    return '';
}

function sanitizePhone(phone) {
    if (!phone) return '';
    return phone.replace(/[^0-9+]/g, '').substring(0, 15);
}

function sanitizeEmail(email) {
    if (!email) return '';
    return email.trim().toLowerCase().substring(0, 254);
}

function sanitizeText(text, maxLength = 500) {
    if (!text) return '';
    return sanitizeInput(text.trim()).substring(0, maxLength);
}

function sanitizeNumber(value, min = null, max = null) {
    let num = parseFloat(value);
    if (isNaN(num)) return null;
    if (min !== null) num = Math.max(num, min);
    if (max !== null) num = Math.min(num, max);
    return num;
}

function sanitizeInteger(value, min = null, max = null) {
    const num = sanitizeNumber(value, min, max);
    return num !== null ? Math.floor(num) : null;
}

function sanitizeJSON(str) {
    try {
        const parsed = JSON.parse(str);
        return JSON.stringify(parsed);
    } catch {
        return '';
    }
}

// ============================================
// REQUIRED FIELD VALIDATION
// ============================================

function validateRequired(value, fieldName = 'This field') {
    if (value === null || value === undefined || 
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0)) {
        return `${fieldName} is required.`;
    }
    return null;
}

function validateEmail(value) {
    if (!value) return null; // Use required check separately
    
    const email = value.trim().toLowerCase();
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Please enter a valid email address.';
    }
    
    if (email.length > 254) {
        return 'Email address is too long.';
    }
    
    // Check for disposable email domains
    const disposableDomains = [
        'tempmail.com', 'throwaway.com', 'mailinator.com',
        'guerrillamail.com', 'sharklasers.com', '10minutemail.com'
    ];
    
    const domain = email.split('@')[1];
    if (disposableDomains.includes(domain)) {
        return 'Please use a permanent email address.';
    }
    
    return null;
}

function validatePassword(value, options = {}) {
    if (!value) return null;
    
    const {
        minLength = 6,
        maxLength = 128,
        requireUppercase = false,
        requireLowercase = false,
        requireNumber = false,
        requireSpecial = false
    } = options;
    
    if (value.length < minLength) {
        return `Password must be at least ${minLength} characters.`;
    }
    
    if (value.length > maxLength) {
        return `Password must be less than ${maxLength} characters.`;
    }
    
    if (requireUppercase && !/[A-Z]/.test(value)) {
        return 'Password must contain at least one uppercase letter.';
    }
    
    if (requireLowercase && !/[a-z]/.test(value)) {
        return 'Password must contain at least one lowercase letter.';
    }
    
    if (requireNumber && !/[0-9]/.test(value)) {
        return 'Password must contain at least one number.';
    }
    
    if (requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
        return 'Password must contain at least one special character.';
    }
    
    return null;
}

function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) return null;
    if (password !== confirmPassword) {
        return 'Passwords do not match.';
    }
    return null;
}

function validatePhone(value) {
    if (!value) return null;
    
    const cleaned = value.replace(/[^0-9]/g, '');
    
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
        return 'Please enter a valid 10-digit Indian phone number.';
    }
    
    return null;
}

function validateName(value, fieldName = 'Name') {
    if (!value) return null;
    
    const trimmed = value.trim();
    
    if (trimmed.length < 2) {
        return `${fieldName} must be at least 2 characters.`;
    }
    
    if (trimmed.length > 100) {
        return `${fieldName} must be less than 100 characters.`;
    }
    
    if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
        return `${fieldName} contains invalid characters.`;
    }
    
    return null;
}

function validateCompany(value) {
    if (!value) return null;
    
    const trimmed = value.trim();
    
    if (trimmed.length < 2) {
        return 'Company name must be at least 2 characters.';
    }
    
    if (trimmed.length > 200) {
        return 'Company name must be less than 200 characters.';
    }
    
    return null;
}

// ============================================
// BUSINESS VALIDATIONS
// ============================================

function validateGST(value) {
    if (!value) return null;
    
    const cleaned = value.trim().toUpperCase();
    
    // GST format: 22AAAAA0000A1Z5
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    
    if (!gstRegex.test(cleaned)) {
        return 'Please enter a valid GST number (e.g., 22AAAAA0000A1Z5).';
    }
    
    return null;
}

function validateUPI(value) {
    if (!value) return null;
    
    const trimmed = value.trim();
    
    if (!/^[\w.-]+@[\w]+$/.test(trimmed)) {
        return 'Please enter a valid UPI ID (e.g., name@upi).';
    }
    
    if (trimmed.length > 50) {
        return 'UPI ID is too long.';
    }
    
    return null;
}

function validateIFSC(value) {
    if (!value) return null;
    
    const trimmed = value.trim().toUpperCase();
    
    // IFSC format: ABCD0123456
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    
    if (!ifscRegex.test(trimmed)) {
        return 'Please enter a valid IFSC code (e.g., SBIN0001234).';
    }
    
    return null;
}

function validateAccountNumber(value) {
    if (!value) return null;
    
    const cleaned = value.replace(/[^0-9]/g, '');
    
    if (cleaned.length < 9 || cleaned.length > 18) {
        return 'Account number must be between 9 and 18 digits.';
    }
    
    return null;
}

// ============================================
// CAMPAIGN VALIDATIONS
// ============================================

function validateZone(zone) {
    if (!zone) return 'Please select a zone.';
    
    const validZones = ZONES.map(z => z.name);
    if (!validZones.includes(zone)) {
        return 'Please select a valid zone.';
    }
    
    return null;
}

function validateRickshawCount(value) {
    if (!value && value !== 0) return 'Please enter number of rickshaws.';
    
    const count = parseInt(value);
    
    if (isNaN(count) || count < PRICING_CONFIG.minRickshaws) {
        return `Minimum ${PRICING_CONFIG.minRickshaws} rickshaw required.`;
    }
    
    if (count > PRICING_CONFIG.maxRickshaws) {
        return `Maximum ${PRICING_CONFIG.maxRickshaws} rickshaws allowed.`;
    }
    
    return null;
}

function validateCampaignDuration(value) {
    if (!value && value !== 0) return 'Please enter campaign duration.';
    
    const days = parseInt(value);
    
    if (isNaN(days) || days < PRICING_CONFIG.minDays) {
        return `Minimum ${PRICING_CONFIG.minDays} day required.`;
    }
    
    if (days > PRICING_CONFIG.maxDays) {
        return `Maximum ${PRICING_CONFIG.maxDays} days allowed.`;
    }
    
    return null;
}

function validateCampaignType(type) {
    if (!type) return 'Please select a campaign type.';
    
    const validTypes = Object.keys(CAMPAIGN_TYPES);
    if (!validTypes.includes(type)) {
        return 'Please select a valid campaign type.';
    }
    
    return null;
}

function validateStartDate(date) {
    if (!date) return 'Please select a start date.';
    
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selected < today) {
        return 'Start date cannot be in the past.';
    }
    
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    
    if (selected > maxDate) {
        return 'Start date must be within 90 days.';
    }
    
    return null;
}

function validateEndDate(startDate, endDate, minDays = 1, maxDays = 90) {
    if (!endDate) return 'Please select an end date.';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
        return 'End date must be after start date.';
    }
    
    const diffDays = daysBetween(start, end);
    
    if (diffDays < minDays) {
        return `Campaign must be at least ${minDays} day(s).`;
    }
    
    if (diffDays > maxDays) {
        return `Campaign cannot exceed ${maxDays} days.`;
    }
    
    return null;
}

// ============================================
// PAYMENT VALIDATIONS
// ============================================

function validateAmount(value, min = 1, max = 1000000) {
    if (!value && value !== 0) return 'Please enter an amount.';
    
    const amount = parseFloat(value);
    
    if (isNaN(amount) || amount < min) {
        return `Amount must be at least ${formatCurrency(min)}.`;
    }
    
    if (amount > max) {
        return `Amount cannot exceed ${formatCurrency(max)}.`;
    }
    
    return null;
}

function validateTransactionId(value) {
    if (!value) return null;
    
    const trimmed = value.trim();
    
    if (trimmed.length < 6) {
        return 'Transaction ID must be at least 6 characters.';
    }
    
    if (trimmed.length > 50) {
        return 'Transaction ID is too long.';
    }
    
    if (!/^[a-zA-Z0-9-]+$/.test(trimmed)) {
        return 'Transaction ID contains invalid characters.';
    }
    
    return null;
}

// ============================================
// FILE VALIDATIONS
// ============================================

function validateFileSize(file, maxSizeMB = 10) {
    if (!file) return null;
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
        return `File size must be less than ${maxSizeMB}MB.`;
    }
    
    return null;
}

function validateFileType(file, allowedTypes = []) {
    if (!file) return null;
    if (allowedTypes.length === 0) return null;
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const mimeType = file.type;
    
    const isAllowed = allowedTypes.some(type => {
        return fileExtension === type || mimeType.includes(type);
    });
    
    if (!isAllowed) {
        return `File type not allowed. Allowed: ${allowedTypes.join(', ')}.`;
    }
    
    return null;
}

function validateImageFile(file) {
    if (!file) return null;
    
    const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const sizeError = validateFileSize(file, 5);
    const typeError = validateFileType(file, allowedTypes);
    
    return sizeError || typeError || null;
}

function validateAudioFile(file) {
    if (!file) return null;
    
    const allowedTypes = ['mp3', 'wav', 'ogg', 'm4a', 'aac'];
    const sizeError = validateFileSize(file, 20);
    const typeError = validateFileType(file, allowedTypes);
    
    return sizeError || typeError || null;
}

function validateVideoFile(file) {
    if (!file) return null;
    
    const allowedTypes = ['mp4', 'mov', 'avi', 'webm'];
    const sizeError = validateFileSize(file, 50);
    const typeError = validateFileType(file, allowedTypes);
    
    return sizeError || typeError || null;
}

// ============================================
// URL VALIDATIONS
// ============================================

function validateURL(value) {
    if (!value) return null;
    
    try {
        const url = new URL(value);
        if (!['http:', 'https:'].includes(url.protocol)) {
            return 'URL must start with http:// or https://.';
        }
        return null;
    } catch {
        return 'Please enter a valid URL.';
    }
}

function validateGoogleDriveURL(value) {
    if (!value) return null;
    
    const driveRegex = /^https:\/\/drive\.google\.com\/(file\/d\/|open\?id=)[\w-]+/;
    const shareRegex = /^https:\/\/drive\.google\.com\/file\/d\/([\w-]+)\/view/;
    
    if (!driveRegex.test(value) && !shareRegex.test(value)) {
        return 'Please enter a valid Google Drive link.';
    }
    
    return null;
}

// ============================================
// AUDIO AD VALIDATIONS
// ============================================

function validateAudioDuration(value) {
    if (!value && value !== 0) return 'Please set ad duration.';
    
    const duration = parseInt(value);
    const validDurations = [15, 30, 45, 60];
    
    if (!validDurations.includes(duration)) {
        return 'Duration must be 15, 30, 45, or 60 seconds.';
    }
    
    return null;
}

function validatePlayInterval(value) {
    if (!value && value !== 0) return 'Please set play interval.';
    
    const interval = parseInt(value);
    const validIntervals = [15, 30, 60, 120, 300];
    
    if (!validIntervals.includes(interval)) {
        return 'Interval must be 15s, 30s, 1min, 2min, or 5min.';
    }
    
    return null;
}

function validateTimeRange(startTime, endTime) {
    if (!startTime || !endTime) return null;
    
    if (startTime >= endTime) {
        return 'End time must be after start time.';
    }
    
    return null;
}

function validateMaxPlays(value) {
    if (!value && value !== 0) return null;
    
    const plays = parseInt(value);
    
    if (isNaN(plays) || plays < 1) {
        return 'Maximum plays must be at least 1.';
    }
    
    if (plays > 500) {
        return 'Maximum plays cannot exceed 500 per day.';
    }
    
    return null;
}

// ============================================
// FORM VALIDATOR
// ============================================

class FormValidator {
    constructor(formElement) {
        this.form = typeof formElement === 'string' ? 
            document.getElementById(formElement) : formElement;
        this.rules = {};
        this.errors = {};
        this.isValid = true;
    }
    
    addRule(fieldName, validationFn, errorMessage) {
        if (!this.rules[fieldName]) {
            this.rules[fieldName] = [];
        }
        this.rules[fieldName].push({
            validate: validationFn,
            message: errorMessage
        });
        return this;
    }
    
    addRequired(fieldName, message = 'This field is required.') {
        return this.addRule(fieldName, (value) => {
            return value !== null && value !== undefined && 
                   (typeof value !== 'string' || value.trim() !== '');
        }, message);
    }
    
    addEmail(fieldName) {
        return this.addRule(fieldName, (value) => {
            if (!value) return true; // Let required handle empty
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }, 'Please enter a valid email address.');
    }
    
    addPhone(fieldName) {
        return this.addRule(fieldName, (value) => {
            if (!value) return true;
            const cleaned = value.replace(/[^0-9]/g, '');
            return /^[6-9]\d{9}$/.test(cleaned);
        }, 'Please enter a valid 10-digit phone number.');
    }
    
    addMinLength(fieldName, minLength) {
        return this.addRule(fieldName, (value) => {
            if (!value) return true;
            return value.length >= minLength;
        }, `Must be at least ${minLength} characters.`);
    }
    
    addMaxLength(fieldName, maxLength) {
        return this.addRule(fieldName, (value) => {
            if (!value) return true;
            return value.length <= maxLength;
        }, `Must be less than ${maxLength} characters.`);
    }
    
    addCustom(fieldName, validationFn, errorMessage) {
        return this.addRule(fieldName, validationFn, errorMessage);
    }
    
    validate() {
        this.errors = {};
        this.isValid = true;
        
        Object.keys(this.rules).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            const value = field ? field.value : null;
            
            for (const rule of this.rules[fieldName]) {
                const passed = rule.validate(value);
                if (!passed) {
                    if (!this.errors[fieldName]) {
                        this.errors[fieldName] = [];
                    }
                    this.errors[fieldName].push(rule.message);
                    this.isValid = false;
                    
                    // Add error class to field
                    if (field) {
                        field.classList.add('error');
                        const formGroup = field.closest('.form-group');
                        if (formGroup) formGroup.classList.add('error');
                    }
                }
            }
        });
        
        return this.isValid;
    }
    
    getErrors() {
        return this.errors;
    }
    
    getFieldError(fieldName) {
        return this.errors[fieldName] ? this.errors[fieldName][0] : null;
    }
    
    displayErrors() {
        // Clear previous errors
        this.form.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
        this.form.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));
        this.form.querySelectorAll('input.error, select.error, textarea.error').forEach(el => el.classList.remove('error'));
        
        // Display new errors
        Object.keys(this.errors).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.classList.add('error');
                const formGroup = field.closest('.form-group');
                if (formGroup) formGroup.classList.add('error');
                
                const errorEl = formGroup ? formGroup.querySelector('.form-error') : null;
                if (errorEl) {
                    errorEl.textContent = this.errors[fieldName][0];
                    errorEl.style.display = 'block';
                }
            }
        });
    }
    
    reset() {
        this.errors = {};
        this.isValid = true;
        this.form.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
        this.form.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));
        this.form.querySelectorAll('input.error, select.error, textarea.error').forEach(el => el.classList.remove('error'));
    }
}

// ============================================
// QUICK VALIDATION FUNCTIONS
// ============================================

function validateLoginForm(email, password) {
    const errors = {};
    
    if (!email || !email.trim()) {
        errors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email.';
    }
    
    if (!password) {
        errors.password = 'Password is required.';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters.';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

function validateRegistrationForm(data) {
    const errors = {};
    
    if (!data.name || !data.name.trim()) {
        errors.name = 'Name is required.';
    } else if (data.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters.';
    }
    
    if (!data.email || !data.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email.';
    }
    
    if (!data.password) {
        errors.password = 'Password is required.';
    } else if (data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters.';
    }
    
    if (data.confirmPassword && data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
    }
    
    if (data.phone && !isValidPhone(data.phone)) {
        errors.phone = 'Please enter a valid phone number.';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

function validateCampaignForm(data) {
    const errors = {};
    
    const typeError = validateCampaignType(data.type);
    if (typeError) errors.type = typeError;
    
    const zoneError = validateZone(data.zone);
    if (zoneError) errors.zone = zoneError;
    
    const rickshawError = validateRickshawCount(data.rickshaws);
    if (rickshawError) errors.rickshaws = rickshawError;
    
    const durationError = validateCampaignDuration(data.days);
    if (durationError) errors.days = durationError;
    
    const startError = validateStartDate(data.start_date);
    if (startError) errors.start_date = startError;
    
    if (data.start_date && data.end_date) {
        const endError = validateEndDate(data.start_date, data.end_date);
        if (endError) errors.end_date = endError;
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

function validatePaymentForm(data) {
    const errors = {};
    
    const amountError = validateAmount(data.amount);
    if (amountError) errors.amount = amountError;
    
    if (data.method === 'upi') {
        const upiError = validateUPI(data.upi_id);
        if (upiError) errors.upi_id = upiError;
    }
    
    if (data.transaction_id) {
        const txnError = validateTransactionId(data.transaction_id);
        if (txnError) errors.transaction_id = txnError;
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

function validateAudioAdForm(data) {
    const errors = {};
    
    if (!data.ad_name || !data.ad_name.trim()) {
        errors.ad_name = 'Ad name is required.';
    }
    
    const durationError = validateAudioDuration(data.duration_seconds);
    if (durationError) errors.duration_seconds = durationError;
    
    const intervalError = validatePlayInterval(data.play_interval_seconds);
    if (intervalError) errors.play_interval_seconds = intervalError;
    
    if (!data.assigned_zones || data.assigned_zones.length === 0) {
        errors.assigned_zones = 'Please select at least one zone.';
    }
    
    if (data.start_time && data.end_time) {
        const timeError = validateTimeRange(data.start_time, data.end_time);
        if (timeError) errors.end_time = timeError;
    }
    
    if (data.max_plays_per_day) {
        const playsError = validateMaxPlays(data.max_plays_per_day);
        if (playsError) errors.max_plays_per_day = playsError;
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// ============================================
// REAL-TIME INPUT VALIDATION
// ============================================

function setupRealTimeValidation(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            // Clear error on input
            const formGroup = input.closest('.form-group');
            if (formGroup && formGroup.classList.contains('error')) {
                formGroup.classList.remove('error');
                input.classList.remove('error');
                const errorEl = formGroup.querySelector('.form-error');
                if (errorEl) errorEl.style.display = 'none';
            }
        });
    });
}

function validateField(input) {
    const fieldName = input.name;
    const value = input.value;
    const formGroup = input.closest('.form-group');
    
    let error = null;
    
    // Check required
    if (input.required) {
        error = validateRequired(value, input.getAttribute('data-label') || fieldName);
    }
    
    // Check type-specific validations
    if (!error) {
        switch (input.type) {
            case 'email':
                error = validateEmail(value);
                break;
            case 'tel':
                error = validatePhone(value);
                break;
            case 'url':
                error = validateURL(value);
                break;
            case 'number':
                const min = input.min ? parseFloat(input.min) : null;
                const max = input.max ? parseFloat(input.max) : null;
                if (value) {
                    const num = parseFloat(value);
                    if (min !== null && num < min) error = `Minimum value is ${min}.`;
                    if (max !== null && num > max) error = `Maximum value is ${max}.`;
                }
                break;
        }
    }
    
    // Display error
    if (error && formGroup) {
        formGroup.classList.add('error');
        input.classList.add('error');
        const errorEl = formGroup.querySelector('.form-error');
        if (errorEl) {
            errorEl.textContent = error;
            errorEl.style.display = 'block';
        }
    } else if (formGroup) {
        formGroup.classList.remove('error');
        input.classList.remove('error');
        const errorEl = formGroup.querySelector('.form-error');
        if (errorEl) errorEl.style.display = 'none';
    }
    
    return error;
}

// ============================================
// INITIALIZATION
// ============================================

console.log('✅ Validators Module Loaded');
