import type { Metadata } from "next";
import { LeadForm } from "@/components/forms/LeadForm";
import { ListingCard } from "@/components/listings/ListingCard";
import { getListingsByMission } from "@/lib/data/listings";
import { MISSIONS, type MissionId } from "@/lib/types";

export const metadata: Metadata = {
  title: "Mission Lab",
  description:
    "Tell Brandon what the land is for — hunt, farm, homestead, or timber — and get matched to Southeast Ohio tracts.",
};

type Props = { searchParams: Promise<{ mission?: string }> };

export default async function FindPage({ searchParams }: Props) {
  const sp = await searchParams;
  const mission = MISSIONS.find((m) => m.id === sp.mission)?.id as
    | MissionId
    | undefined;
  const matched = mission ? getListingsByMission(mission) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-forest">
        Mission Lab
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Portals ask for price and acres. We ask what the land needs to{" "}
        <em>do</em>. Save your mission — Brandon uses it to filter noise and
        send tracts that actually fit.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MISSIONS.map((m) => {
          const active = mission === m.id;
          return (
            <a
              key={m.id}
              href={`/find?mission=${m.id}`}
              className={`rounded-2xl border p-4 transition ${
                active
                  ? "border-moss bg-forest-mid text-charcoal"
                  : "border-line bg-paper hover:border-moss"
              }`}
            >
              <p className="font-display text-lg font-semibold">{m.label}</p>
              <p
                className={`mt-1 text-sm ${active ? "text-cream" : "text-muted"}`}
              >
                {m.description}
              </p>
            </a>
          );
        })}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold text-forest">
            Save your land mission
          </h2>
          <p className="mt-2 text-sm text-muted">
            No spam portal. Your profile goes straight into Brandon&apos;s
            pipeline with a priority score.
          </p>
          <div className="mt-6">
            <LeadForm
              type="buyer"
              source="mission-lab"
              defaultMission={mission}
            />
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-forest">
            {mission
              ? `Matches for ${MISSIONS.find((m) => m.id === mission)?.label}`
              : "Pick a mission to preview matches"}
          </h2>
          {mission ? (
            <div className="mt-6 grid gap-4">
              {matched.length === 0 ? (
                <p className="text-sm text-muted">
                  No live matches for this mission yet — save your profile so
                  Brandon can prospect.
                </p>
              ) : (
                matched.map((l) => <ListingCard key={l.id} listing={l} />)
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">
              Choose Hunt, Farm, Homestead, or Timber above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
