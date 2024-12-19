import axios from "axios";

export async function getNearbyMarkets(latitude, longitude) {
  try {
    console.log(
      "Chamada API com latitude:",
      latitude,
      "e longitude:",
      longitude
    );
    const response = await axios.get(
      "http://localhost:3000/api/nearby-markets",
      {
        params: { latitude, longitude },
      }
    );
    console.log("Resposta da API:", response);
    return response.data.map((market) => ({
      ...market,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${market.geometry.location.lat},${market.geometry.location.lng}`,
    }));
  } catch (error) {
    console.error("Erro ao buscar mercados próximos:", error);
    throw error;
  }
}
