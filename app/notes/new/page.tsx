import { Suspense } from 'react';
import NoteForm from './note-form';
import styles from "./page.module.css";

function FormSkeleton() {
  return (
    <div className={`flex flex-col gap-4 max-w-md mx-auto mt-8 animate-pulse`}>
      <div className={`h-8 w-48 bg-[var(--primary)] rounded-full opacity-30`} />
      <div className={`h-12 w-full bg-[var(--accent)] rounded-2xl opacity-40`} />
      <div className={`h-40 w-full bg-[var(--accent)] rounded-2xl opacity-40`} />
      <div className={`h-12 w-32 bg-[var(--primary)] rounded-full opacity-30 mx-auto`} />
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
          <NoteForm />
        </Suspense>
      </div>
    </main>
  );
}
