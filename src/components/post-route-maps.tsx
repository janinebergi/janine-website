import type { Lang } from "@/lib/i18n-constants";
import { SriLankaRouteMap } from "@/components/route-map";
import { BaliRouteMap } from "@/components/bali-route-map";
import { MoroccoRouteMap } from "@/components/morocco-route-map";
import { PortugalRouteMap } from "@/components/portugal-route-map";
import { ScotlandRouteMap } from "@/components/scotland-route-map";
import { FloridaRouteMap } from "@/components/florida-route-map";
import { NewYorkRouteMap } from "@/components/new-york-route-map";

// Ordnet jedem Beitrag seine Routenkarte zu. Die Karte wird dadurch im
// Blog-Template an einer festen Stelle (direkt unter dem Titelbild) gerendert
// statt inline im MDX – so steht sie in jedem Beitrag an derselben Position.
export const postRouteMaps: Record<
  string,
  (props: { lang?: Lang }) => React.ReactElement
> = {
  "sri-lanka-rundreise": SriLankaRouteMap,
  "bali-reisebericht": BaliRouteMap,
  "marokko-wueste": MoroccoRouteMap,
  "surfcamp-portugal": PortugalRouteMap,
  "harry-potter-tour-schottland": ScotlandRouteMap,
  "roadtrip-florida": FloridaRouteMap,
  "new-york": NewYorkRouteMap,
};
