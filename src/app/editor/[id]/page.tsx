import { EditorLayout } from '@/components/editor/EditorLayout';

interface EditorPageProps {
  params: { id: string };
}

export default function EditorPage({ params }: EditorPageProps) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Invalid visualization ID</p>
      </div>
    );
  }

  return <EditorLayout visualizationId={id} />;
}
