'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
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
}: Props) {
  const t = useTranslations('users.form');
  const validationT = useTranslations('users.validation');

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

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`mt-5 grid w-full min-w-0 grid-cols-1 gap-4 ${
          fullWidth ? 'sm:grid-cols-2' : 'max-w-md'
        }`}
      >
        <div className="min-w-0 space-y-1">
          <Input
            placeholder={t('firstName')}
            aria-label={t('firstName')}
            aria-invalid={!!form.formState.errors.firstName}
            {...form.register('firstName')}
          />

          {form.formState.errors.firstName && (
            <p className="break-words text-sm text-destructive">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <Input
            placeholder={t('lastName')}
            aria-label={t('lastName')}
            aria-invalid={!!form.formState.errors.lastName}
            {...form.register('lastName')}
          />

          {form.formState.errors.lastName && (
            <p className="break-words text-sm text-destructive">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <Input
            type="email"
            placeholder={t('email')}
            aria-label={t('email')}
            aria-invalid={!!form.formState.errors.email}
            {...form.register('email')}
          />

          {form.formState.errors.email && (
            <p className="break-words text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <Input
            type="number"
            placeholder={t('age')}
            aria-label={t('age')}
            aria-invalid={!!form.formState.errors.age}
            {...form.register('age', {
              valueAsNumber: true,
            })}
          />

          {form.formState.errors.age && (
            <p className="break-words text-sm text-destructive">
              {form.formState.errors.age.message}
            </p>
          )}
        </div>

        <div
          className={fullWidth ? 'sm:col-span-2 sm:flex sm:justify-end' : ''}
        >
          <Button
            type="submit"
            disabled={isLoading}
            className={fullWidth ? 'w-full sm:w-auto' : 'w-full'}
          >
            {isLoading
              ? t('saving')
              : (submitLabel ?? (mode === 'edit' ? t('update') : t('create')))}
          </Button>
        </div>
      </form>
    </Card>
  );
}
