import { Suspense } from 'react';
import NoteForm from './note-form';
import styles from './page.module.css';

function FormSkeleton() {
  return (
    <div className={`flex flex-col gap-5 max-w-lg mx-auto mt-8`}>
      <div className={`h-10 w-40 rounded-full bg-[#FCEEF1]`} />
      <div className={`h-14 w-full rounded-2xl bg-[#FCEEF1]`} />
      <div className={`h-48 w-full rounded-2xl bg-[#FCEEF1]`} />
      <div className={`h-14 w-40 rounded-full bg-[#FCEEF1] mx-auto`} />
    </div>
  );
}

export default async function NewNotePage({
  searchParams: searchParamsProp,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const params = await searchParamsProp;
  const editId = params?.edit;

  return (
    <main className={styles.main}>
      <div className={styles.formContainer}>
        <h1 className={styles.heading}>
          {editId ? 'Edit Note' : 'New Note'}
        </h1>
        <Suspense fallback={<FormSkeleton />}>
          <NoteForm editId={editId || undefined} />
        </Suspense>
      </div>
    </main>
  );
}
