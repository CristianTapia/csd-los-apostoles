import { notFound } from "next/navigation";
import { PublicModulePlaceholderPage } from "@/components/public/PublicModulePlaceholderPage";
import { getPublicClubSection } from "@/server/queries/get-public-club-section";

type PlantelPageProps = {
  params: Promise<{
    clubSlug: string;
  }>;
};

export default async function PlantelPage({ params }: PlantelPageProps) {
  const { clubSlug } = await params;

  const result = await getPublicClubSection(clubSlug, "plantel");

  if (!result.ok || !result.data) {
    notFound();
  }

  const { club, settings, activeModule } = result.data;

  return (
    <PublicModulePlaceholderPage
      clubSlug={club.slug}
      publicName={settings.public_name}
      module={activeModule}
      description="Productos, camisetas, merchandising y aportes del club."
      colors={{
        primary: settings.primary_color,
        secondary: settings.secondary_color,
        accent: settings.accent_color,
      }}
    />
  );
}
