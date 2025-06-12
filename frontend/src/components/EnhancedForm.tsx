import React, { useState, useCallback } from 'react';
import { Button, TextField, Alert, Box, CircularProgress, Fab } from '@mui/material';
import { Save as SaveIcon, Add as AddIcon } from '@mui/icons-material';

interface ValidationRule {
  validator: (value: any) => boolean;
  message: string;
}

interface EnhancedFormProps {
  onSubmit: (data: Record<string, any>) => Promise<void>;
  validationRules?: Record<string, ValidationRule[]>;
  children?: React.ReactNode;
  showFab?: boolean;
}

export const EnhancedForm: React.FC<EnhancedFormProps> = ({
  onSubmit,
  validationRules = {},
  children,
  showFab = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateField = useCallback((fieldName: string, value: any): string | null => {
    const rules = validationRules[fieldName] || [];
    
    for (const rule of rules) {
      if (!rule.validator(value)) {
        return rule.message;
      }
    }
    
    return null;
  }, [validationRules]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const value = formData[fieldName];
      const error = validateField(fieldName, value);
      
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField, validationRules]);

  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    setSubmitError(null);
    setSubmitSuccess(false);
    
    if (errors[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || '',
      }));
    }
  }, [errors, validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await onSubmit(formData);
      setSubmitSuccess(true);
      setFormData({});
      setErrors({});
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, validateForm, errors]);

  const errorSummary = Object.entries(errors).filter(([, error]) => error);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}
      
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Form submitted successfully!
        </Alert>
      )}
      
      {errorSummary.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <strong>Please correct the following errors:</strong>
          <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
            {errorSummary.map(([fieldName, error]) => (
              <li key={fieldName}>
                <button
                  type="button"
                  onClick={() => {
                    const field = document.getElementById(fieldName);
                    if (field) {
                      field.focus();
                      field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  {error}
                </button>
              </li>
            ))}
          </ul>
        </Alert>
      )}
      
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.props.name) {
          const fieldName = child.props.name;
          const error = errors[fieldName];
          
          return React.cloneElement(child, {
            ...child.props,
            id: fieldName,
            error: !!error,
            helperText: error || child.props.helperText,
            value: formData[fieldName] || '',
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              handleFieldChange(fieldName, e.target.value);
              if (child.props.onChange) {
                child.props.onChange(e);
              }
            },
            'aria-describedby': error ? `${fieldName}-error` : undefined,
            'aria-invalid': !!error,
          });
        }
        
        return child;
      })}
      
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          type="button"
          variant="outlined"
          onClick={() => {
            setFormData({});
            setErrors({});
            setSubmitError(null);
            setSubmitSuccess(false);
          }}
        >
          Reset
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
      
      {showFab && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => {
            const form = document.querySelector('form');
            if (form) {
              form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export const validators = {
  required: (value: any) => value != null && value !== '',
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: (min: number) => (value: string) => value.length >= min,
  maxLength: (max: number) => (value: string) => value.length <= max,
  pattern: (regex: RegExp) => (value: string) => regex.test(value),
};
