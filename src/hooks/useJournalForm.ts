import { useState } from 'react';
import { FormData, FormErrors, Picture, FormChangeHandler } from '../types';
import { useJournal } from '../context/JournalContext';

const initialFormData: FormData = {
  date: '',
  streamName: '',
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
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
      setFormData(initialFormData);
      alert('Journal entry saved successfully!');
    }
  };

  const handlePictureChange = (pictures: Picture[]) => {
    setFormData(prev => ({
      ...prev,
      pictures
    }));
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    handlePictureChange,
  };
}