import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-transparent bg-clip-padding text-[13px] font-medium transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        outline:
          'border-border bg-background text-foreground hover:bg-muted hover:text-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'text-foreground hover:bg-muted',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20',
        link: 'h-auto p-0 text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-8 px-3',
        xs: 'h-6 gap-1 rounded px-2 text-xs [&_svg]:size-3',
        sm: 'h-7 px-2.5 text-xs [&_svg]:size-3',
        lg: 'h-9 px-4 text-sm [&_svg]:size-4',
        icon: 'size-8 p-0',
        'icon-xs': 'size-6 rounded p-0 [&_svg]:size-3',
        'icon-sm': 'size-7 rounded p-0 [&_svg]:size-3.5',
        'icon-lg': 'size-9 rounded-md p-0 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
