import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormglassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalize3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('StoremGlass Client', () => {
  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289825;

    axios.get = jest.fn().mockResolvedValue(stormglassWeather3HoursFixture)

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalize3HoursFixture);
  })
})
