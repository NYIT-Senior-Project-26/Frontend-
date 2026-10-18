/**
 * SymptomPredict API client
 *
 * Change API_BASE_URL to point at Tulsi's backend once it's deployed.
 * For local dev, make sure the FastAPI server is running with:
 *   uvicorn app.main:app --reload --port 8000
 * and that your phone/simulator can reach your computer's LAN IP.
 *
 * iOS Simulator on same Mac  → http://localhost:8000/api/v1
 * Expo Go on physical iPhone → http://<YOUR_LAN_IP>:8000/api/v1
 *   (find it with: ipconfig getifaddr en0  on macOS)
 */

// ─── CONFIGURE THIS ──────────────────────────────────────────────────────────
// Swap to your LAN IP when testing on a real device with Expo Go:
//   e.g. 'http://192.168.1.42:8000/api/v1'
const API_BASE_URL = 'http://localhost:8000/api/v1';
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Core fetch wrapper. Throws a human-readable Error on HTTP errors.
 */
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch (_) {}
    throw new Error(detail);
  }
  return res.json();
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

/**
 * POST /predict
 *
 * @param {Object} input
 * @param {string[]} input.symptoms      - e.g. ['headache', 'fever', 'sore throat']
 * @param {number}  [input.age]          - optional patient age
 * @param {string}  [input.sex]          - optional 'male' | 'female' | 'other'
 * @param {number}  [input.duration_days]- optional days symptoms have been present
 * @param {string}  [input.notes]        - optional free-text notes
 *
 * @returns {Promise<PredictionResult>}
 *   {
 *     conditions: Array<{ name, likelihood: 'low'|'medium'|'high', rationale }>,
 *     urgency: 'self_care'|'see_doctor'|'urgent_care'|'emergency',
 *     recommended_specialty: string,
 *     advice: string,
 *     disclaimer: string,
 *   }
 */
export function predictSymptoms(input) {
  return request('/predict', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * GET /providers/nearby  (needs GOOGLE_PLACES_API_KEY on the backend)
 */
export function getNearbyProviders(specialty, lat, lng) {
  const params = new URLSearchParams({ specialty, lat, lng }).toString();
  return request(`/providers/nearby?${params}`);
}

/**
 * GET /medications/search  (RxNav — no key needed)
 */
export function searchMedication(name) {
  return request(`/medications/search?name=${encodeURIComponent(name)}`);
}

/**
 * GET /medications/label  (openFDA — no key needed)
 */
export function getMedicationLabel(name) {
  return request(`/medications/label?name=${encodeURIComponent(name)}`);
}
