import crypto from "crypto";
import https from "https";
import { DEFAULT_BACKUP_SHEET_ID } from "./snapshot.js";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_API_HOST = "sheets.googleapis.com";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

const base64url = (input) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const getPrivateKey = () =>
  (process.env.GOOGLE_PRIVATE_KEY || process.env.BACKUP_GOOGLE_PRIVATE_KEY || "")
    .replace(/\\n/g, "\n")
    .trim();

const getClientEmail = () =>
  process.env.GOOGLE_CLIENT_EMAIL || process.env.BACKUP_GOOGLE_CLIENT_EMAIL || "";

const requestJson = ({ method = "GET", hostname, path, headers = {}, body }) =>
  new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : "";
    const req = https.request(
      {
        method,
        hostname,
        path,
        headers: {
          ...headers,
          ...(payload
            ? {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(payload),
              }
            : {}),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const parsed = data ? JSON.parse(data) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
            return;
          }
          reject(
            new Error(
              `Google API ${method} ${path} failed ${res.statusCode}: ${data}`
            )
          );
        });
      }
    );

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });

const createJwt = () => {
  const clientEmail = getClientEmail();
  const privateKey = getPrivateKey();

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Missing Google service account credentials. Set GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY."
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: clientEmail,
    scope: SHEETS_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(
    JSON.stringify(claim)
  )}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(signingInput)
    .sign(privateKey);

  return `${signingInput}.${base64url(signature)}`;
};

const getAccessToken = async () => {
  const jwt = createJwt();
  const params = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: jwt,
  });

  const token = await new Promise((resolve, reject) => {
    const payload = params.toString();
    const req = https.request(
      GOOGLE_TOKEN_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const parsed = data ? JSON.parse(data) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed.access_token);
            return;
          }
          reject(new Error(`Google token request failed ${res.statusCode}: ${data}`));
        });
      }
    );

    req.on("error", reject);
    req.write(payload);
    req.end();
  });

  if (!token) throw new Error("Google token response did not include access_token.");
  return token;
};

const sheetRange = (sheetName) => `'${sheetName.replace(/'/g, "''")}'!A1:Z1000`;

const sheetsRequest = async (accessToken, path, options = {}) =>
  requestJson({
    hostname: SHEETS_API_HOST,
    path,
    headers: { Authorization: `Bearer ${accessToken}` },
    ...options,
  });

const ensureSheets = async (accessToken, spreadsheetId, sheetNames) => {
  const spreadsheet = await sheetsRequest(
    accessToken,
    `/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=sheets.properties.title`
  );
  const existing = new Set(
    (spreadsheet.sheets || []).map((sheet) => sheet.properties?.title)
  );
  const missing = sheetNames.filter((sheetName) => !existing.has(sheetName));

  if (missing.length === 0) return;

  await sheetsRequest(
    accessToken,
    `/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}:batchUpdate`,
    {
      method: "POST",
      body: {
        requests: missing.map((title) => ({
          addSheet: { properties: { title } },
        })),
      },
    }
  );
};

const clearSheet = (accessToken, spreadsheetId, sheetName) =>
  sheetsRequest(
    accessToken,
    `/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(
      sheetRange(sheetName)
    )}:clear`,
    { method: "POST", body: {} }
  );

const updateSheet = (accessToken, spreadsheetId, sheetName, values) =>
  sheetsRequest(
    accessToken,
    `/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(
      sheetRange(sheetName)
    )}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      body: {
        majorDimension: "ROWS",
        values,
      },
    }
  );

export const writeSnapshotToGoogleSheets = async (sheetsByName) => {
  const spreadsheetId = process.env.BACKUP_SHEET_ID || DEFAULT_BACKUP_SHEET_ID;
  const accessToken = await getAccessToken();
  const sheetNames = Object.keys(sheetsByName);
  const overviewName = "總覽";
  const dataSheetNames = sheetNames.filter((name) => name !== overviewName);

  await ensureSheets(accessToken, spreadsheetId, sheetNames);

  for (const sheetName of dataSheetNames) {
    await clearSheet(accessToken, spreadsheetId, sheetName);
    await updateSheet(accessToken, spreadsheetId, sheetName, sheetsByName[sheetName]);
  }

  if (sheetsByName[overviewName]) {
    await clearSheet(accessToken, spreadsheetId, overviewName);
    await updateSheet(accessToken, spreadsheetId, overviewName, sheetsByName[overviewName]);
  }
};
