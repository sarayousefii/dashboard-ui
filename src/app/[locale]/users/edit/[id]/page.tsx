import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function EditUserPage({ params }: Props) {
  const { id, locale } = await params;

  redirect(`/${locale}/users/${id}`);
}
