import { StormGlass } from '@src/clients/stormGlass';
import * as HTPUtil from '@src/util/request';
import stormglassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalize3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('@src/util/request');

describe('StoremGlass Client', () => {
  const MockedRequestClass = HTPUtil.Request as jest.Mocked<
    typeof HTPUtil.Request
  >;

  const mockedRequest = new HTPUtil.Request() as jest.Mocked<HTPUtil.Request>;

  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289825;

    mockedRequest.get.mockResolvedValue({
      data: stormglassWeather3HoursFixture,
    } as HTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalize3HoursFixture);
  });

  it('should exclude incomplete data points', async () => {
    const lat = -33.792726;
    const lng = 151.289825;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };

    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const lat = -33.792726;
    const lng = 151.289825;

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error',
    );
  });

  it('should get a stormGlassError when StromGlass service responds with error', async () => {
    const lat = -33.792726;
    const lng = 151.289825;

    MockedRequestClass.isRequestError.mockReturnValue(true);
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429',
    );
  });
});
