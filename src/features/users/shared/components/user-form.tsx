
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import {
  createUserFormSchema,
  type UserFormValues,
} from '../schemas/user-form.schema';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Props = {
  onSubmit: (values: UserFormValues) => void;
  isLoading?: boolean;
  initialValues?: Partial<UserFormValues>;
  mode?: 'create' | 'edit';
  title?: string;
  description?: string;
  submitLabel?: string;
  fullWidth?: boolean;
  variant?: 'card' | 'dialog';
};

export function UserForm({
  onSubmit,
  isLoading = false,
  initialValues,
  mode = 'create',
  title,
  description,
  submitLabel,
  fullWidth = false,
  variant = 'card',
}: Props) {
  const t = useTranslations('users.form');
  const validationT = useTranslations('users.validation');

  const formId = useId();
  const isDialog = variant === 'dialog';

  const schema = useMemo(
    () =>
      createUserFormSchema({
        firstNameMin: validationT('firstNameMin'),
        lastNameMin: validationT('lastNameMin'),
        emailInvalid: validationT('emailInvalid'),
        ageMin: validationT('ageMin'),
      }),
    [validationT],
  );

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: 18,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        firstName: initialValues.firstName ?? '',
        lastName: initialValues.lastName ?? '',
        email: initialValues.email ?? '',
        age: initialValues.age ?? 18,
      });
    }
  }, [initialValues, form]);

  const fieldWrapperClassName = isDialog
    ? 'flex min-w-0 flex-col gap-2.5'
    : 'min-w-0 space-y-1';

  const labelClassName = 'text-xs font-medium text-foreground';

  const fieldClassName = isDialog
    ? 'h-10 w-full rounded-lg border-input bg-background shadow-none'
    : undefined;

  const formContent = (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={
        isDialog
          ? 'grid w-full min-w-0 grid-cols-1 gap-x-4 gap-y-5 px-6 pb-6 sm:grid-cols-2 sm:px-7'
          : `mt-5 grid w-full min-w-0 grid-cols-1 gap-4 ${
              fullWidth ? 'sm:grid-cols-2' : 'max-w-md'
            }`
      }
    >
      {/* First name */}
      <div className={fieldWrapperClassName}>
        {isDialog && (
          <label htmlFor={`${formId}-first-name`} className={labelClassName}>
            {t('firstName')}
          </label>
        )}

        <Input
          id={`${formId}-first-name`}
          placeholder={t('firstName')}
          aria-label={t('firstName')}
          aria-invalid={!!form.formState.errors.firstName}
          className={fieldClassName}
          {...form.register('firstName')}
        />

        {form.formState.errors.firstName && (
          <p className="break-words text-xs text-destructive">
            {form.formState.errors.firstName.message}
          </p>
        )}
      </div>

      {/* Last name */}
      <div className={fieldWrapperClassName}>
        {isDialog && (
          <label htmlFor={`${formId}-last-name`} className={labelClassName}>
            {t('lastName')}
          </label>
        )}

        <Input
          id={`${formId}-last-name`}
          placeholder={t('lastName')}
          aria-label={t('lastName')}
          aria-invalid={!!form.formState.errors.lastName}
          className={fieldClassName}
          {...form.register('lastName')}
        />

        {form.formState.errors.lastName && (
          <p className="break-words text-xs text-destructive">
            {form.formState.errors.lastName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div
        className={
          isDialog
            ? `${fieldWrapperClassName} sm:col-span-2`
            : fieldWrapperClassName
        }
      >
        {isDialog && (
          <label htmlFor={`${formId}-email`} className={labelClassName}>
            {t('email')}
          </label>
        )}

        <Input
          id={`${formId}-email`}
          type="email"
          placeholder={t('email')}
          aria-label={t('email')}
          aria-invalid={!!form.formState.errors.email}
          className={fieldClassName}
          {...form.register('email')}
        />

        {form.formState.errors.email && (
          <p className="break-words text-xs text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {/* Age */}
      <div className={fieldWrapperClassName}>
        {isDialog && (
          <label htmlFor={`${formId}-age`} className={labelClassName}>
            {t('age')}
          </label>
        )}

        <Input
          id={`${formId}-age`}
          type="number"
          placeholder={t('age')}
          aria-label={t('age')}
          aria-invalid={!!form.formState.errors.age}
          className={fieldClassName}
          {...form.register('age', {
            valueAsNumber: true,
          })}
        />

        {form.formState.errors.age && (
          <p className="break-words text-xs text-destructive">
            {form.formState.errors.age.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div
        className={
          isDialog
            ? 'flex justify-end border-t border-border pt-4 sm:col-span-2'
            : fullWidth
              ? 'sm:col-span-2 sm:flex sm:justify-end'
              : ''
        }
      >
        <Button
          type="submit"
          disabled={isLoading}
          className={
            isDialog
              ? 'h-9 w-full min-w-32 rounded-lg px-5 text-xs sm:w-auto'
              : fullWidth
                ? 'w-full sm:w-auto'
                : 'w-full'
          }
        >
          {isLoading
            ? t('saving')
            : (submitLabel ?? (mode === 'edit' ? t('update') : t('create')))}
        </Button>
      </div>
    </form>
  );

  if (isDialog) {
    return <div className="w-full min-w-0">{formContent}</div>;
  }

  return (
    <Card
      className={`w-full min-w-0 p-4 sm:p-6 ${
        fullWidth ? 'max-w-none' : 'max-w-2xl'
      }`}
    >
      <div className="min-w-0 space-y-1">
        <h2 className="text-lg font-bold sm:text-xl">
          {title ?? (mode === 'edit' ? t('editTitle') : t('createTitle'))}
        </h2>

        <p className="text-sm text-muted-foreground">
          {description ?? t('manageDescription')}
        </p>
      </div>

      {formContent}
    </Card>
  );
}
