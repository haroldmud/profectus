import { ModuleDetail } from '@/components/module/ModuleDetail'

export const instant = false

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ModuleDetail moduleId={id} />
}
