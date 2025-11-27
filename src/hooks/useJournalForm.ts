import { useState } from 'react';
import { JournalEntry, FormErrors, Picture, FormChangeHandler, createEmptyEntry } from '../types';
import { useJournal } from '../context/JournalContext';

interface UseJournalFormOptions {
  mode?: 'quick' | 'full';
  onSuccess?: () => void;
}

export function useJournalForm(options: UseJournalFormOptions = {}) {
  const { mode = 'full', onSuccess } = options;
  const [formData, setFormData] = useState<JournalEntry>(createEmptyEntry(mode));
  const [errors, setErrors] = useState<FormErrors>({});
  const { addEntry } = useJournal();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.streamName) {
      newErrors.streamName = 'Stream name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange: FormChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString(),
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleNumberChange = (name: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(numValue as number) ? null : numValue,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      addEntry({
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      setFormData(createEmptyEntry(mode));
      onSuccess?.();
    }
  };

  const handlePictureChange = (pictures: Picture[]) => {
    setFormData((prev) => ({
      ...prev,
      pictures,
      updatedAt: new Date().toISOString(),
    }));
  };

  const resetForm = () => {
    setFormData(createEmptyEntry(mode));
    setErrors({});
  };

  return {
    formData,
    errors,
    handleChange,
    handleNumberChange,
    handleSubmit,
    handlePictureChange,
    resetForm,
    setFormData,
  };
}
