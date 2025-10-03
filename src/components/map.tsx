"use client";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { LatLngExpression } from "leaflet";

interface MapProps {
  data: {
    name: string;
    coordinates: LatLngExpression;
    revenue: number;
    spend: number;
  }[];
}

const Map: React.FC<MapProps> = ({ data }) => {
  const mapCenter: LatLngExpression = [25.276987, 55.296249];
  // Find max revenue to scale circle sizes and colors
  const maxRevenue =
    data.length > 0 ? Math.max(...data.map((d) => d.revenue)) : 0;

  const getCircleOptions = (revenue: number) => {
    // Base radius and a scaling factor. Adjust these to change circle sizes.
    const baseRadius = 5000; // 5km base radius
    const maxAdditionalRadius = 75000; // Max additional 75km for the highest revenue

    const scale = maxRevenue > 0 ? revenue / maxRevenue : 0;
    const radius = baseRadius + scale * maxAdditionalRadius;

    // Use a color scale from yellow to red for revenue
    const color = `hsl(60, 100%, ${50 - scale * 25}%)`; // Yellow to orange/red

    return {
      radius,
      fillColor: color,
      color: color,
      weight: 1,
      opacity: 1,
      fillOpacity: 0.6,
    };
  };

  return (
    <MapContainer
      center={mapCenter}
      zoom={6}
      style={{ height: "100%", width: "100%", backgroundColor: "#e5e7eb" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data.map((item) => {
        const circleOptions = getCircleOptions(item.revenue);
        const eventHandlers = {
          mouseover: (event: any) => {
            event.target.setStyle({
              weight: 3,
              fillOpacity: 0.8,
            });
          },
          mouseout: (event: any) => {
            event.target.setStyle({
              weight: circleOptions.weight,
              fillOpacity: circleOptions.fillOpacity,
            });
          },
        };

        return (
          <Circle
            key={item.name}
            center={item.coordinates}
            pathOptions={circleOptions}
            radius={circleOptions.radius}
            eventHandlers={eventHandlers}
          >
            <Popup>
              <div className="font-sans">
                <strong className="text-lg">{item.name}</strong>
                <br />
                <span className="text-green-600">Revenue:</span> $
                {item.revenue.toLocaleString()}
                <br />
                <span className="text-red-500">Spend:</span> $
                {item.spend.toLocaleString()}
              </div>
            </Popup>
          </Circle>
        );
      })}
    </MapContainer>
  );
};

export default Map;
