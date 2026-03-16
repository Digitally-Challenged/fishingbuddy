import { useState } from 'react';
import { FormData, FormErrors, Picture, FormChangeHandler } from '../types';
import { useJournal } from '../context/JournalContext';
import { storageUtils } from '../utils/storage';

const initialFormData: FormData = {
  date: '',
  streamName: '',
  riverStretch: '',
  tripMembers: '',
  windVelocity: '',
  windDirection: '',
  weatherConditions: '',
  waterClarity: '',
  usgsGauge: '',
  flowRate: '',
  riverDepth: '',
  waterTemperature: '',
  fishSpecies: '',
  numberCaught: '',
  baitUsed: '',
  notes: '',
  pictures: [],
  wifesMood: '',
  airTempHigh: '',
  airTempLow: '',
  barometricPressure: '',
  moonPhase: '',
  precipitation: '',
};

export function useJournalForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const { dispatch } = useJournal();

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
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      storageUtils.saveDraft(updated);
      return updated;
    });

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch({ type: 'ADD_ENTRY', payload: formData });
      storageUtils.clearDraft();
      setFormData(initialFormData);
      alert('Journal entry saved successfully!');
    }
  };

  const handlePictureChange = (pictures: Picture[]) => {
    setFormData((prev) => {
      const updated = { ...prev, pictures };
      storageUtils.saveDraft(updated);
      return updated;
    });
  };

  const getDraft = (): FormData | null => storageUtils.loadDraft();
  const clearDraft = (): void => {
    storageUtils.clearDraft();
    setFormData(initialFormData);
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    handlePictureChange,
    getDraft,
    clearDraft,
    setFormData,
  };
}