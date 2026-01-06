// Input validation utilities

// Validate call data
export function validateCall(call) {
  const errors = [];

  // Required fields
  if (!call.id || typeof call.id !== 'number') {
    errors.push('Invalid or missing ID');
  }

  if (!call.caller || typeof call.caller !== 'string' || call.caller.trim().length === 0) {
    errors.push('Invalid or missing caller');
  }

  if (!call.companyName || typeof call.companyName !== 'string' || call.companyName.trim().length === 0) {
    errors.push('Invalid or missing company name');
  }

  // String length validations
  if (call.caller && call.caller.length > 255) {
    errors.push('Caller name too long (max 255 characters)');
  }

  if (call.companyName && call.companyName.length > 500) {
    errors.push('Company name too long (max 500 characters)');
  }

  if (call.contactPerson && call.contactPerson.length > 255) {
    errors.push('Contact person name too long (max 255 characters)');
  }

  // Phone number validation (basic)
  const phoneRegex = /^[\d\s\(\)\-\+]*$/;
  if (call.contactPhone && !phoneRegex.test(call.contactPhone)) {
    errors.push('Invalid contact phone format');
  }

  if (call.newContactPhone && !phoneRegex.test(call.newContactPhone)) {
    errors.push('Invalid new contact phone format');
  }

  // Date validation
  if (call.callDate && isNaN(Date.parse(call.callDate))) {
    errors.push('Invalid call date');
  }

  // Time validation (HH:MM format)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (call.callTime && !timeRegex.test(call.callTime)) {
    errors.push('Invalid call time format (use HH:MM)');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Validate task data
export function validateTask(task) {
  const errors = [];

  // Required fields
  if (!task.id || typeof task.id !== 'string' || task.id.trim().length === 0) {
    errors.push('Invalid or missing task ID');
  }

  if (!task.person || typeof task.person !== 'string' || task.person.trim().length === 0) {
    errors.push('Invalid or missing person');
  }

  // Date validation
  if (task.date && isNaN(Date.parse(task.date))) {
    errors.push('Invalid task date');
  }

  // Time validation
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (task.startTime && !timeRegex.test(task.startTime)) {
    errors.push('Invalid start time format (use HH:MM)');
  }

  if (task.endTime && !timeRegex.test(task.endTime)) {
    errors.push('Invalid end time format (use HH:MM)');
  }

  // Status validation
  const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
  if (task.status && !validStatuses.includes(task.status)) {
    errors.push(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Sanitize string input (prevent XSS)
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;

  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Validate and sanitize calls array
export function validateCalls(calls) {
  if (!Array.isArray(calls)) {
    return {
      valid: false,
      errors: ['Calls must be an array'],
      sanitized: []
    };
  }

  const allErrors = [];
  const sanitized = [];

  calls.forEach((call, index) => {
    const validation = validateCall(call);

    if (!validation.valid) {
      allErrors.push(`Call ${index + 1}: ${validation.errors.join(', ')}`);
    } else {
      // Sanitize string fields
      sanitized.push({
        ...call,
        caller: sanitizeString(call.caller),
        companyName: sanitizeString(call.companyName),
        contactPerson: sanitizeString(call.contactPerson),
        contactTitle: sanitizeString(call.contactTitle),
        industry: sanitizeString(call.industry),
        city: sanitizeString(call.city),
        district: sanitizeString(call.district),
        addressDetail: sanitizeString(call.addressDetail),
        result: sanitizeString(call.result),
        notes: sanitizeString(call.notes)
      });
    }
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    sanitized: allErrors.length === 0 ? sanitized : []
  };
}

// Validate and sanitize tasks array
export function validateTasks(tasks) {
  if (!Array.isArray(tasks)) {
    return {
      valid: false,
      errors: ['Tasks must be an array'],
      sanitized: []
    };
  }

  const allErrors = [];
  const sanitized = [];

  tasks.forEach((task, index) => {
    const validation = validateTask(task);

    if (!validation.valid) {
      allErrors.push(`Task ${index + 1}: ${validation.errors.join(', ')}`);
    } else {
      // Sanitize string fields
      sanitized.push({
        ...task,
        person: sanitizeString(task.person),
        taskType: sanitizeString(task.taskType),
        description: sanitizeString(task.description),
        status: sanitizeString(task.status)
      });
    }
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    sanitized: allErrors.length === 0 ? sanitized : []
  };
}
