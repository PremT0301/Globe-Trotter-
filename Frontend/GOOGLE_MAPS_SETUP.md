# Google Maps API Setup Guide

## Step 1: Get a Google Maps API Key

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top
3. Click "New Project"
4. Enter a project name (e.g., "Travel App")
5. Click "Create"

### 2. Enable Required APIs
1. In your project, go to [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Search for and enable these APIs:
   - **Places API** (for location search/autocomplete)
   - **Maps JavaScript API** (for maps functionality)
   - **Geocoding API** (for converting addresses to coordinates)

### 3. Create API Credentials
1. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

### 4. Restrict the API Key (Recommended)
1. Click on the API key you just created
2. Under "Application restrictions", select "HTTP referrers (websites)"
3. Add your domains:
   - For development: `http://localhost:3000/*`, `http://localhost:5173/*`
   - For production: `https://yourdomain.com/*`
4. Under "API restrictions", select "Restrict key"
5. Select the APIs you enabled (Places API, Maps JavaScript API, Geocoding API)
6. Click "Save"

## Step 2: Configure in Your Project

### 1. Create Environment File
1. Copy `env.example` to `.env` in the Frontend directory:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and replace `your_google_maps_api_key_here` with your actual API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyC_your_actual_api_key_here
   ```

### 2. Restart Your Development Server
After adding the API key, restart your frontend development server:
```bash
cd Frontend
npm start
```

## Step 3: Test the Integration

1. Go to your app and navigate to "Create Trip" or "Itinerary Builder"
2. Try adding an activity and search for a location
3. You should see real location suggestions from Google Places API
4. If the API key is not configured, you'll see mock data with a warning in the console

## Troubleshooting

### Common Issues:

1. **"Google Maps API key not found" warning**
   - Make sure you created the `.env` file in the Frontend directory
   - Ensure the variable name is exactly `VITE_GOOGLE_MAPS_API_KEY`
   - Restart your development server after adding the API key

2. **"REQUEST_DENIED" error**
   - Check that you've enabled the required APIs in Google Cloud Console
   - Verify your API key restrictions allow your domain
   - Ensure you're using the correct API key

3. **"QUOTA_EXCEEDED" error**
   - Check your Google Cloud Console billing
   - Review your API usage in the Google Cloud Console

### API Usage Limits:
- Places API: 1,000 requests per day (free tier)
- Maps JavaScript API: 28,500 requests per month (free tier)
- Geocoding API: 2,500 requests per day (free tier)

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Use API key restrictions to limit usage to your domains
- Monitor your API usage in Google Cloud Console

## Cost Information

- Google Maps APIs have a generous free tier
- Most small to medium applications stay within free limits
- Check [Google Maps Platform Pricing](https://developers.google.com/maps/pricing) for current rates
