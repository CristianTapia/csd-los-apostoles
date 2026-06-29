import { notFound } from "next/navigation";
import { SportsLiveHome } from "@/components/public/templates/sports-live/SportsLiveHome";
import { getPublicCalendarEvents } from "@/server/queries/get-public-calendar-events";
import { getPublicClubPage } from "@/server/queries/get-public-club-page";

type PublicClubHomePageProps = {
  params: Promise<{
    clubSlug: string;
  }>;
};

export default async function PublicClubHomePage({ params }: PublicClubHomePageProps) {
  const { clubSlug } = await params;

  const pageResult = await getPublicClubPage(clubSlug);

  if (!pageResult.ok || !pageResult.data) {
    notFound();
  }

  const { club, settings, enabledModules } = pageResult.data;

  const eventsResult = await getPublicCalendarEvents(club.slug);
  const events = eventsResult.ok && eventsResult.data ? eventsResult.data.events : [];

  return <SportsLiveHome club={club} settings={settings} enabledModules={enabledModules} events={events} />;
}
