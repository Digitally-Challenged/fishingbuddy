# Edit Entries & Form Validation Design

## Overview

Add the ability to edit existing journal entries and improve form validation UX by replacing alert() dialogs with inline field validation.

## Features

### 1. Edit Entry (Modal-Based)

**User Flow:**
- Click entry row → opens detail modal (existing)
- Modal header gains "Edit" button next to X close button
- Click Edit → modal switches to edit mode
- All display fields become editable form inputs (pre-filled)
- Header shows "Editing: [Stream Name]"
- Save/Cancel buttons replace Close button

**Edit Mode Behavior:**
- Save → dispatches `UPDATE_ENTRY` action, shows success toast, returns to view mode
- Cancel → discards changes, returns to view mode
- Validation runs before save (same rules as new entry)

### 2. Form Validation (Inline)

**Required Fields:**
- Date (required, cannot be future)
- Stream Name (required, non-empty)
- All other fields optional

**Validation Behavior:**
- Validate on blur (when field loses focus)
- Validate all fields on submit attempt
- Show inline error below invalid field with red border
- Error clears when user starts typing

**Visual Treatment:**
- Red border on invalid field
- Red helper text below field (e.g., "Stream name is required")
- Submit button always enabled
- On submit with errors → scroll to first error, focus that field

### 3. Modal Layout Improvement

**Current Issue:** Catch Details section uses single column for fish species and bait, wasting horizontal space.

**Fix:** Split into two-column layout matching Weather/Water Conditions:

```
┌─────────────────────────────────────────────────────────┐
│ Catch Details                                           │
│ 24 fish                                                 │
├────────────────────────────┬────────────────────────────┤
│ Species Caught             │ Bait Used                  │
│                            │                            │
│ Game Fish:                 │ • Perch-colored Shad Rap   │
│   • Walleye                │ • Jig and Pig              │
│   • Smallmouth Bass        │                            │
│                            │                            │
│ Other:                     │                            │
│   • Sauger                 │                            │
└────────────────────────────┴────────────────────────────┘
```

## Technical Implementation

### New Reducer Action

```typescript
// In JournalContext.tsx
case 'UPDATE_ENTRY':
  const updatedEntries = [...state.entries];
  updatedEntries[action.payload.index] = action.payload.entry;
  saveEntries(updatedEntries);
  return { ...state, entries: updatedEntries };
```

### New Validation Hook

```typescript
// src/hooks/useFormValidation.ts
interface ValidationRules {
  [field: string]: {
    required?: boolean;
    validate?: (value: any) => string | null;
  };
}

interface UseFormValidationReturn {
  errors: Record<string, string>;
  validate: (data: FormData) => boolean;
  validateField: (field: string, value: any) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
}

export function useFormValidation(rules: ValidationRules): UseFormValidationReturn
```

### Edit Mode State

```typescript
// In JournalEntryList.tsx
const [isEditing, setIsEditing] = useState(false);
const [editFormData, setEditFormData] = useState<FormData | null>(null);
const { errors, validate, validateField, clearError } = useFormValidation({
  date: { required: true, validate: (v) => isFuture(v) ? 'Date cannot be in the future' : null },
  streamName: { required: true },
});
```

## Files to Modify

1. **src/context/JournalContext.tsx**
   - Add `UPDATE_ENTRY` action to reducer
   - Export action type

2. **src/hooks/useFormValidation.ts** (new file)
   - Reusable validation hook
   - Field-level and form-level validation
   - Error state management

3. **src/components/dashboard/JournalEntryList.tsx**
   - Add edit mode state and UI to modal
   - Fix Catch Details to two-column layout
   - Add Edit button to modal header
   - Add form fields for edit mode
   - Add Save/Cancel buttons

4. **src/components/FishingJournalForm.tsx**
   - Replace alert() with useFormValidation hook
   - Add inline error display to fields

5. **src/components/WizardForm.tsx**
   - Replace alert() with useFormValidation hook
   - Add inline error display to fields

## Out of Scope

- Photo management improvements (separate effort)
- Data type fixes (numberCaught as string, etc.)
- Multi-entry bulk edit
