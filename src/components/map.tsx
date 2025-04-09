"use client";

import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";

interface TrafficLight {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  queue: number;
}

const defaultMapContainerStyle = {
  width: "100%",
  height: "75vh",
};

const defaultMapCenter = {
  lat: 49.4445,
  lng: 32.0598,
};

const defaultMapZoom = 14;

const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  mapTypeId: "roadmap",
};

const MapComponent = () => {
  const [selectedQueue, setSelectedQueue] = useState(0);
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>([]);
  const [selectedLight, setSelectedLight] = useState<TrafficLight | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [tempQueue, setTempQueue] = useState(0);

  useEffect(() => {
    if (selectedLight) {
      setTempQueue(selectedLight.queue);
    }
  }, [selectedLight]);

  useEffect(() => {
    fetch("/data/traffic_lights_cherkasy.json")
      .then((res) => res.json())
      .then((data: TrafficLight[]) => setTrafficLights(data))
      .catch((err) =>
        console.error("Помилка завантаження даних про світлофори:", err)
      );
  }, []);

  return (
    <div className="w-full">
      <div className="p-4 bg-gray-500 text-white flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Cherkasy: Traffic Lights
        </h1>
      </div>

      <div className="mt-6 px-4 sm:px-10">
        <label htmlFor="queue-select" className="mr-2 font-semibold">
          Оберіть чергу:
        </label>
        <select
          id="queue-select"
          value={selectedQueue}
          onChange={(e) => setSelectedQueue(Number(e.target.value))}
          className="p-2 rounded border"
        >
          {[0, 1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num} className="text-black">
              Черга {num}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full mt-4">
        <GoogleMap
          mapContainerStyle={defaultMapContainerStyle}
          center={defaultMapCenter}
          zoom={defaultMapZoom}
          options={defaultMapOptions}
        >
          {trafficLights.map((light) => (
            <Marker
              key={light.id}
              position={{ lat: light.latitude, lng: light.longitude }}
              title={light.name}
              icon={{
                url:
                  light.queue === selectedQueue
                    ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                    : "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              onClick={() => setSelectedLight(light)}
            />
          ))}

          {selectedLight && (
            <InfoWindow
              position={{
                lat: selectedLight.latitude,
                lng: selectedLight.longitude,
              }}
              onCloseClick={() => {
                setSelectedLight(null);
                setShowAdmin(false);
              }}
            >
              <div className="text-sm text-black">
                <h2 className="font-bold mb-1">{selectedLight.name}</h2>
                <p>Поточна черга: {selectedLight.queue}</p>

                {!showAdmin ? (
                  <button
                    className="text-green-400 underline mt-2 "
                    onClick={() => setShowAdmin(true)}
                  >
                    Не та черга?
                  </button>
                ) : (
                  <div className="mt-2">
                    <label
                      htmlFor="admin-queue-select"
                      className="block font-semibold"
                    >
                      Змінити чергу:
                    </label>
                    <select
                      id="admin-queue-select"
                      value={tempQueue}
                      onChange={(e) => setTempQueue(Number(e.target.value))}
                      className="mt-1 p-1 border rounded text-black"
                    >
                      {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          Черга {num}
                        </option>
                      ))}
                    </select>
                    <button
                      className="block mt-2 bg-green-400 text-white px-3 py-1 rounded hover:bg-green-400"
                      onClick={() => {
                        setTrafficLights((prev) =>
                          prev.map((light) =>
                            light.id === selectedLight.id
                              ? { ...light, queue: tempQueue }
                              : light
                          )
                        );
                        setSelectedLight({
                          ...selectedLight,
                          queue: tempQueue,
                        });
                        setShowAdmin(false);
                      }}
                    >
                      Зберегти зміни
                    </button>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export { MapComponent };
