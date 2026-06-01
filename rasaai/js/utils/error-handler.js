/*
 * Filename: error-handler.js
 * Path: /js/utils/error-handler.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Global error catching, error logging, graceful degradation, user-friendly messages
 * Type: Utility JavaScript
 */

// ============================================
// ERROR TYPES
// ============================================

const ErrorTypes = {
    NETWORK: 'network',
    AUTH: 'auth',
    VALIDATION: 'validation',
    SHEETS: 'sheets',
    PAYMENT: 'payment',
    CAMPAIGN: 'campaign',
    AUDIO: 'audio',
    STORAGE: 'storage',
    UI: 'ui',
    UNKNOWN: 'unknown'
};

// ============================================
// ERROR STATE
// ============================================

const ErrorState = {
    errors: [],
    maxErrors: 100,
    isReporting: false,
    lastError: null,
    errorCount: 0
};

// ============================================
// CUSTOM ERROR CLASSES
// ============================================

class RASAAIError extends Error {
    constructor(message, type = ErrorTypes.UNKNOWN, code = null, details = null) {
        super(message);
        this.name = 'RASAAIError';
        this.type = type;
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
        this.userMessage = this.getUserMessage();
    }
    
    getUserMessage() {
        switch (this.type) {
            case ErrorTypes.NETWORK:
                return 'Network connection error. Please check your internet and try again.';
            case ErrorTypes.AUTH:
                return 'Authentication error. Please login again.';
            case ErrorTypes.VALIDATION:
                return this.message || 'Please check your input and try again.';
            case ErrorTypes.SHEETS:
                return 'Unable to load data. Please try again in a moment.';
            case ErrorTypes.PAYMENT:
                return 'Payment processing error. Please try again or contact support.';
            case ErrorTypes.CAMPAIGN:
                return this.message || 'Campaign operation failed. Please try again.';
            case ErrorTypes.AUDIO:
                return 'Audio playback error. Please check your speaker connection.';
            case ErrorTypes.STORAGE:
                return 'Storage error. Please clear some space and try again.';
            case ErrorTypes.UI:
                return 'Something went wrong displaying this page.';
            default:
                return 'Something went wrong. Please try again.';
        }
    }
    
    toJSON() {
        return {
            name: this.name,
            type: this.type,
            code: this.code,
            message: this.message,
            details: this.details,
            timestamp: this.timestamp,
            userMessage: this.userMessage
        };
    }
}

class NetworkError extends RASAAIError {
    constructor(message = 'Network error', details = null) {
        super(message, ErrorTypes.NETWORK, 'NET_ERR', details);
        this.name = 'NetworkError';
    }
}

class AuthError extends RASAAIError {
    constructor(message = 'Authentication error', details = null) {
        super(message, ErrorTypes.AUTH, 'AUTH_ERR', details);
        this.name = 'AuthError';
    }
}

class ValidationError extends RASAAIError {
    constructor(message = 'Validation error', details = null) {
        super(message, ErrorTypes.VALIDATION, 'VAL_ERR', details);
        this.name = 'ValidationError';
    }
}

class SheetsError extends RASAAIError {
    constructor(message = 'Sheets API error', details = null) {
        super(message, ErrorTypes.SHEETS, 'SHEETS_ERR', details);
        this.name = 'SheetsError';
    }
}

class PaymentError extends RASAAIError {
    constructor(message = 'Payment error', details = null) {
        super(message, ErrorTypes.PAYMENT, 'PAY_ERR', details);
        this.name = 'PaymentError';
    }
}

// ============================================
// ERROR CREATION HELPERS
// ============================================

function createError(message, type = ErrorTypes.UNKNOWN, details = null) {
    return new RASAAIError(message, type, null, details);
}

function createNetworkError(message = 'Network connection failed', details = null) {
    return new NetworkError(message, details);
}

function createAuthError(message = 'Authentication failed', details = null) {
    return new AuthError(message, details);
}

function createValidationError(message = 'Validation failed', details = null) {
    return new ValidationError(message, details);
}

function createSheetsError(message = 'Data operation failed', details = null) {
    return new SheetsError(message, details);
}

function createPaymentError(message = 'Payment failed', details = null) {
    return new PaymentError(message, details);
}

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

function handleError(error, context = '') {
    // Convert to RASAAIError if it's a regular Error
    const rasaaError = error instanceof RASAAIError 
        ? error 
        : new RASAAIError(error.message || 'Unknown error', ErrorTypes.UNKNOWN, null, {
              originalError: error,
              stack: error.stack,
              context: context
          });
    
    // Log the error
    logError(rasaaError);
    
    // Show user-friendly message
    showErrorMessage(rasaaError);
    
    // Track error count
    ErrorState.errorCount++;
    ErrorState.lastError = rasaaError;
    
    // Report if needed
    if (ErrorState.errorCount % 10 === 0) {
        reportErrors();
    }
    
    return rasaaError;
}

// ============================================
// ERROR LOGGING
// ============================================

function logError(error) {
    const errorRecord = {
        id: generateErrorId(),
        ...error.toJSON(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        user: AuthState?.currentUser?.email || 'guest',
        stack: error.stack || 'No stack trace'
    };
    
    // Add to error state
    ErrorState.errors.push(errorRecord);
    
    // Trim old errors if exceeding max
    if (ErrorState.errors.length > ErrorState.maxErrors) {
        ErrorState.errors = ErrorState.errors.slice(-ErrorState.maxErrors);
    }
    
    // Console output based on environment
    if (FEATURES && FEATURES.debugMode) {
        console.group(`❌ ${error.name}: ${error.message}`);
        console.error('Type:', error.type);
        console.error('Code:', error.code);
        console.error('Timestamp:', error.timestamp);
        console.error('Details:', error.details);
        console.error('Stack:', error.stack);
        console.groupEnd();
    } else {
        console.error(`❌ ${error.type}: ${error.userMessage}`);
    }
    
    // Log to Google Sheets if online
    logErrorToSheets(errorRecord);
}

function generateErrorId() {
    return 'ERR-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
}

async function logErrorToSheets(errorRecord) {
    if (!FEATURES?.googleSheets || !SheetsState?.isOnline) return;
    
    try {
        // Store errors in a separate sheet or append to audit logs
        const logEntry = {
            type: 'error',
            timestamp: errorRecord.timestamp,
            error_type: errorRecord.type,
            error_code: errorRecord.code,
            message: errorRecord.message,
            user_message: errorRecord.userMessage,
            url: errorRecord.url,
            user: errorRecord.user,
            stack: (errorRecord.stack || '').substring(0, 500),
            user_agent: errorRecord.userAgent?.substring(0, 200)
        };
        
        // Use audit log sheet for errors
        if (typeof sheetsAPI !== 'undefined') {
            await sheetsAPI.appendRow(SHEETS.auditLogs, logEntry).catch(() => {});
        }
    } catch {
        // Silently fail - don't want error logging to cause errors
    }
}

// ============================================
// USER-FRIENDLY ERROR DISPLAY
// ============================================

function showErrorMessage(error) {
    const message = error.userMessage || error.message || 'Something went wrong.';
    
    // Try to use toast if available
    if (typeof showToast === 'function') {
        showToast(message, 'error', 5000);
        return;
    }
    
    // Try to use RASAAI global
    if (window.RASAAI && typeof window.RASAAI.showToast === 'function') {
        window.RASAAI.showToast(message, 'error', 5000);
        return;
    }
    
    // Fallback: show inline error if there's an error container
    const errorContainer = document.getElementById('global-error');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }
}

function showNetworkError() {
    const message = '⚠️ You are offline. Some features may not be available.';
    
    if (typeof showToast === 'function') {
        showToast(message, 'warning', 4000);
    }
    
    const offlineIndicator = document.getElementById('offline-indicator');
    if (offlineIndicator) {
        offlineIndicator.style.display = 'block';
    }
}

function hideNetworkError() {
    const offlineIndicator = document.getElementById('offline-indicator');
    if (offlineIndicator) {
        offlineIndicator.style.display = 'none';
    }
}

// ============================================
// TRY-CATCH WRAPPERS
// ============================================

async function safeAsync(fn, context = '', fallbackValue = null) {
    try {
        return await fn();
    } catch (error) {
        handleError(error, context);
        return fallbackValue;
    }
}

function safeSync(fn, context = '', fallbackValue = null) {
    try {
        return fn();
    } catch (error) {
        handleError(error, context);
        return fallbackValue;
    }
}

function safeAPICall(apiFn, context = 'API Call') {
    return async (...args) => {
        try {
            return await apiFn(...args);
        } catch (error) {
            const rasaaError = error instanceof RASAAIError 
                ? error 
                : new RASAAIError(error.message, ErrorTypes.SHEETS, null, { originalError: error });
            
            handleError(rasaaError, context);
            return { success: false, error: rasaaError.userMessage };
        }
    };
}

// ============================================
// RETRY LOGIC
// ============================================

async function retryWithBackoff(fn, options = {}) {
    const {
        maxAttempts = 3,
        baseDelay = 1000,
        maxDelay = 10000,
        backoffFactor = 2,
        onRetry = null
    } = options;
    
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            
            if (attempt === maxAttempts) break;
            
            const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt - 1), maxDelay);
            const jitter = Math.random() * 500;
            
            console.log(`🔄 Retry ${attempt}/${maxAttempts} in ${Math.round(delay + jitter)}ms`);
            
            if (onRetry) {
                onRetry(attempt, error);
            }
            
            await sleep(delay + jitter);
        }
    }
    
    throw lastError;
}

// ============================================
// GRACEFUL DEGRADATION
// ============================================

function degradeGracefully(feature, fallbackFn = null) {
    return async (...args) => {
        try {
            return await feature(...args);
        } catch (error) {
            console.warn(`⚠️ Feature degraded: ${feature.name || 'anonymous'}`);
            handleError(error, 'graceful-degradation');
            
            if (fallbackFn) {
                return await fallbackFn(...args);
            }
            
            return null;
        }
    };
}

function withOfflineFallback(onlineFn, offlineFn) {
    return async (...args) => {
        if (navigator.onLine) {
            try {
                return await onlineFn(...args);
            } catch (error) {
                console.warn('⚠️ Online operation failed, using offline fallback');
                handleError(error, 'offline-fallback');
            }
        }
        
        if (offlineFn) {
            return await offlineFn(...args);
        }
        
        return null;
    };
}

// ============================================
// UNHANDLED ERROR CATCHING
// ============================================

function setupGlobalErrorHandlers() {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const error = event.reason instanceof Error 
            ? event.reason 
            : new Error(String(event.reason));
        
        handleError(error, 'unhandled-rejection');
        
        // Prevent default console error
        event.preventDefault();
    });
    
    // Global error handler
    window.addEventListener('error', (event) => {
        // Ignore errors from external scripts
        if (event.filename && !event.filename.includes(window.location.origin)) {
            return;
        }
        
        const error = new RASAAIError(
            event.message || 'Unknown error',
            ErrorTypes.UNKNOWN,
            null,
            {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            }
        );
        
        handleError(error, 'global-error');
    });
    
    // Network status changes
    window.addEventListener('online', () => {
        console.log('🌐 Online');
        hideNetworkError();
    });
    
    window.addEventListener('offline', () => {
        console.log('📴 Offline');
        showNetworkError();
    });
    
    console.log('✅ Global error handlers setup');
}

// ============================================
// ERROR REPORTING
// ============================================

function getErrorReport() {
    return {
        totalErrors: ErrorState.errorCount,
        lastError: ErrorState.lastError?.toJSON() || null,
        recentErrors: ErrorState.errors.slice(-20).map(e => ({
            id: e.id,
            type: e.type,
            message: e.message,
            timestamp: e.timestamp,
            url: e.url
        })),
        generatedAt: new Date().toISOString()
    };
}

async function reportErrors() {
    if (ErrorState.isReporting) return;
    
    ErrorState.isReporting = true;
    
    try {
        const report = getErrorReport();
        
        // Log consolidated report
        if (FEATURES?.debugMode) {
            console.group('📊 Error Report');
            console.log('Total Errors:', report.totalErrors);
            console.log('Last Error:', report.lastError);
            console.log('Recent Errors:', report.recentErrors.length);
            console.groupEnd();
        }
        
        // Optionally send to Google Sheets
        if (report.recentErrors.length > 0 && FEATURES?.googleSheets) {
            // Batch log recent errors
            for (const err of report.recentErrors.slice(-5)) {
                await logErrorToSheets(err).catch(() => {});
            }
        }
        
        // Clear reported errors
        ErrorState.errors = ErrorState.errors.slice(-10);
        
    } catch (error) {
        console.error('Error reporting failed:', error);
    } finally {
        ErrorState.isReporting = false;
    }
}

// ============================================
// ERROR RECOVERY
// ============================================

function clearErrors() {
    ErrorState.errors = [];
    ErrorState.errorCount = 0;
    ErrorState.lastError = null;
    
    // Clear UI error displays
    const errorContainer = document.getElementById('global-error');
    if (errorContainer) {
        errorContainer.style.display = 'none';
        errorContainer.textContent = '';
    }
    
    const offlineIndicator = document.getElementById('offline-indicator');
    if (offlineIndicator) {
        offlineIndicator.style.display = 'none';
    }
}

function getErrorHistory() {
    return [...ErrorState.errors];
}

function getLastError() {
    return ErrorState.lastError;
}

function getErrorCount() {
    return ErrorState.errorCount;
}

// ============================================
// VALIDATION ERROR HANDLING
// ============================================

function handleValidationErrors(errors, formElement = null) {
    if (!errors || Object.keys(errors).length === 0) return;
    
    if (formElement) {
        // Clear previous errors
        formElement.querySelectorAll('.form-error').forEach(el => {
            el.style.display = 'none';
        });
        formElement.querySelectorAll('.form-group.error').forEach(el => {
            el.classList.remove('error');
        });
        formElement.querySelectorAll('input.error, select.error, textarea.error').forEach(el => {
            el.classList.remove('error');
        });
        
        // Show new errors
        Object.entries(errors).forEach(([fieldName, message]) => {
            const field = formElement.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.classList.add('error');
                const formGroup = field.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('error');
                    const errorEl = formGroup.querySelector('.form-error');
                    if (errorEl) {
                        errorEl.textContent = Array.isArray(message) ? message[0] : message;
                        errorEl.style.display = 'block';
                    }
                }
            }
        });
    }
    
    // Scroll to first error
    const firstErrorField = formElement?.querySelector('.error');
    if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
    }
}

// ============================================
// DEVELOPMENT HELPERS
// ============================================

function assert(condition, message = 'Assertion failed') {
    if (!condition) {
        throw new RASAAIError(message, ErrorTypes.VALIDATION, 'ASSERT_ERR');
    }
}

function debugLog(...args) {
    if (FEATURES?.debugMode) {
        console.log('[DEBUG]', ...args);
    }
}

function debugWarn(...args) {
    if (FEATURES?.debugMode) {
        console.warn('[WARN]', ...args);
    }
}

function debugError(...args) {
    if (FEATURES?.debugMode) {
        console.error('[ERROR]', ...args);
    }
}

// ============================================
// INITIALIZATION
// ============================================

function initErrorHandler() {
    setupGlobalErrorHandlers();
    
    // Show offline indicator if needed
    if (!navigator.onLine) {
        showNetworkError();
    }
    
    console.log('✅ Error Handler Module Loaded');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initErrorHandler);

// ============================================
// GLOBAL ERROR HANDLER OBJECT
// ============================================

window.ErrorHandler = {
    // Error Creation
    createError,
    createNetworkError,
    createAuthError,
    createValidationError,
    createSheetsError,
    createPaymentError,
    
    // Error Handling
    handleError,
    handleValidationErrors,
    showErrorMessage,
    showNetworkError,
    hideNetworkError,
    
    // Safe Execution
    safeAsync,
    safeSync,
    safeAPICall,
    retryWithBackoff,
    
    // Graceful Degradation
    degradeGracefully,
    withOfflineFallback,
    
    // Error State
    getErrorReport,
    getErrorHistory,
    getLastError,
    getErrorCount,
    clearErrors,
    
    // Error Types
    ErrorTypes,
    
    // Error Classes
    RASAAIError,
    NetworkError,
    AuthError,
    ValidationError,
    SheetsError,
    PaymentError
};

console.log('✅ Error Handler Global Object Ready (window.ErrorHandler)');
