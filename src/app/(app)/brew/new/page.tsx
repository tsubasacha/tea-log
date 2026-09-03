import { PageHeader } from "@/components/page-header";
import { BrewForm } from "@/components/brew/brew-form";
import { getTeaLeaves } from "@/lib/data/tea-leaves";

export default async function NewBrewPage({
  searchParams,
}: PageProps<"/brew/new">) {
  const params = await searchParams;
  const teaLeaves = await getTeaLeaves();
  const defaultTeaLeafId =
    typeof params.tea === "string" ? params.tea : undefined;

  return (
    <div className="flex flex-col">
      <PageHeader title="お茶を記録する" backHref="/" />
      <BrewForm teaLeaves={teaLeaves} defaultTeaLeafId={defaultTeaLeafId} />
    </div>
  );
}
