import { PageHeader } from "@/components/page-header";
import { TeaLeafForm } from "@/components/tea/tea-leaf-form";

export default function NewTeaLeafPage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="茶葉を登録" backHref="/tea" />
      <TeaLeafForm />
    </div>
  );
}
