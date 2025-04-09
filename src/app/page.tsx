import { MapProvider } from "@/providers/map-provider";
import { MapComponent } from "@/components/map";

export const metadata = {
  title: "Cherkasy: Traffic Lights",
}

export default function Home() {
  return (
    <MapProvider>
      <MapComponent />
    </MapProvider>
  );
}
