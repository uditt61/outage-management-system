import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

// Fix for default marker icons in Vite/React-Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}

function LocationMarker({ position, setPosition }: LocationPickerProps) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

export default function LocationPicker({
  position,
  setPosition,
}: LocationPickerProps) {
  // Set default center to your desired city (e.g., London coordinates)
  const defaultCenter: [number, number] = [51.505, -0.09];
  const [map, setMap] = useState<L.Map | null>(null);

  const handleLocateMe = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(newPos);
        if (map) {
          map.flyTo(newPos, 15); // Pan to the GPS location and zoom in
        }
      },
      () => {
        alert(
          "Unable to retrieve your location. Please check your browser permissions.",
        );
      },
    );
  };

  return (
    <div className="h-[300px] w-full rounded-md overflow-hidden border z-0 relative">
      <Button
        variant="secondary"
        size="sm"
        className="absolute top-2 right-2 z-[1000] shadow-md"
        onClick={handleLocateMe}
      >
        <MapPin className="w-4 h-4 mr-2" />
        Locate Me
      </Button>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
}
