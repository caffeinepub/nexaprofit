import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Edit2, X, Check, AlertCircle } from 'lucide-react';

interface ProfileInlineEditFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void>;
  validate?: (value: string) => string | null;
  inputType?: 'text' | 'email';
  icon?: React.ReactNode;
  placeholder?: string;
}

export function ProfileInlineEditField({
  label,
  value,
  onSave,
  validate,
  inputType = 'text',
  icon,
  placeholder,
}: ProfileInlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setEditValue(value);
    setValidationError(null);
    setSaveError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditValue(value);
    setValidationError(null);
    setSaveError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Validate
    const error = validate ? validate(editValue) : null;
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    setSaveError(null);
    setIsSaving(true);

    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {icon}
            {label}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 gap-2"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Set {label}
          </Button>
        </div>
        <div className="text-lg font-semibold break-all">
          {value || 'Not set'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor={`edit-${label.toLowerCase()}`} className="sr-only">
            {label}
          </Label>
          <Input
            id={`edit-${label.toLowerCase()}`}
            type={inputType}
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
              setValidationError(null);
              setSaveError(null);
            }}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            disabled={isSaving}
            className="text-base"
            autoFocus
          />
        </div>

        {validationError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{validationError}</AlertDescription>
          </Alert>
        )}

        {saveError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{saveError}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                Save
              </>
            )}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isSaving}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
